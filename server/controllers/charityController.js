import axios from "axios";
import db from "../config/db.js";

// POST /api/charity/donate
export const initiateDonation = async (req, res) => {
  const { amount, message } = req.body;

  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ success: false, message: "Invalid donation amount" });
  }

  const userId = req.user?.id;

  try {
    // Fetch name + email from DB using the JWT id
    // Inside initiateDonation
// Ensure your SELECT matches your table columns
const [rows] = await db.execute(
  "SELECT first_name, last_name, email FROM users WHERE id = ?",
  [userId]
);

if (rows.length === 0) {
  return res.status(404).json({ success: false, message: "User not found" });
}

// Check what your DB actually returns
console.log("User data from DB:", rows[0]); 

// Use whatever column name exists in your DB (e.g., rows[0].username or rows[0].full_name)
const donorName = [rows[0]?.first_name, rows[0]?.last_name]
  .filter(Boolean) // Removes undefined or empty strings
  .join(" ") || "Anonymous Donor";
const donorEmail = rows[0].email || null;

    // Insert donation record first (so we always have a DB row even if Khalti fails)
    const [result] = await db.execute(
      `INSERT INTO donations
         (user_id, amount, currency, donor_name, donor_email, message, status)
       VALUES (?, ?, 'NPR', ?, ?, ?, 'pending')`,
      [userId, Number(amount), donorName, donorEmail, message?.trim() || null]
    );

    const donationId = result.insertId;

    // Initiate Khalti payment
    const khaltiRes = await axios.post(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      {
        return_url: `${process.env.FRONTEND_URL}/donation/verify`,
        website_url: process.env.FRONTEND_URL,
        amount: Math.round(Number(amount) * 100),
        purchase_order_id: `DON-${donationId}`,
        purchase_order_name: `Sano Ghar Donation #${donationId}`,
      },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Save pidx
    await db.execute(
      "UPDATE donations SET pidx = ? WHERE id = ?",
      [khaltiRes.data.pidx, donationId]
    );

    return res.status(200).json({ success: true, payment_url: khaltiRes.data.payment_url });

  } catch (err) {
    console.error("Donation initiation error:", err.response?.data ?? err.message);
    return res.status(500).json({ success: false, message: "Donation initiation failed" });
  }
};

// POST /api/charity/verify
export const verifyDonation = async (req, res) => {
  const { pidx } = req.body;

  if (!pidx) {
    return res.status(400).json({ success: false, message: "pidx is required" });
  }

  try {
    const khaltiRes = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      { headers: { Authorization: `Key ${process.env.KHALTI_SECRET_KEY}` } }
    );

    if (khaltiRes.data.status === "Completed") {
      await db.execute(
        "UPDATE donations SET status = 'paid' WHERE pidx = ?",
        [pidx]
      );
      return res.json({ success: true });
    }

    return res.json({ success: false, message: `Payment status: ${khaltiRes.data.status}` });

  } catch (err) {
    console.error("Donation verify error:", err.response?.data ?? err.message);
    return res.status(500).json({ success: false, message: "Verification failed" });
  }
};


export const createCharityPost = async (req, res) => {
  try {
    console.log("🔥 Controller hit");

    const { title, amount, content } = req.body;
    const admin_id = req.admin.admin_id;

    const image_url = req.file?.path || null;

    const sql = `
      INSERT INTO charity_posts (admin_id, title, content, image_url, amount_spent)
      VALUES (?, ?, ?, ?, ?)
    `;

    await db.query(sql, [admin_id, title, content, image_url, amount]);

    res.status(201).json({ success: true, message: "Impact Post Published!" });
  } catch (error) {
    console.error("Post Creation Error:", error);
    res.status(500).json({ message: "Failed to log expenditure" });
  }
};

export const getCharityHistory = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, title, amount_spent, image_url, created_at 
       FROM charity_posts 
       ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
};