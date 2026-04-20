import db from "../config/db.js";

// Get currently logged-in user's profile
export const getLoggedInUser = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Use profile_image instead of image
    const [rows] = await db.execute(
      `SELECT 
        u.id, 
        u.first_name, 
        u.last_name, 
        u.email, 
        u.role_id,
        r.name as role,
        u.date_of_birth, 
        u.gender, 
        u.profile_image as image,
        u.is_verified, 
        u.created_at 
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching logged-in user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserOrderHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = Math.max(1, Math.min(50, Number(req.query.limit) || 5));
    const offset = Math.max(0, Number(req.query.offset) || 0);

    const [rows] = await db.execute(
      `
      SELECT
        o.id AS order_id,
        o.total_amount,
        o.charity_amount,
        o.currency,
        o.status,
        o.transaction_id,
        o.full_name,
        o.email,
        o.phone,
        o.shipping_address,
        o.created_at,
        oi.product_id,
        oi.quantity,
        oi.price_at_purchase,
        p.name AS product_name,
        p.category,
        p.image_url
      FROM orders o
      INNER JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN products p ON p.id = oi.product_id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC, oi.id DESC
      LIMIT ? OFFSET ?
      `,
      [userId, limit, offset]
    );

    const [countRows] = await db.execute(
      `
      SELECT COUNT(*) AS total
      FROM orders o
      INNER JOIN order_items oi ON oi.order_id = o.id
      WHERE o.user_id = ?
      `,
      [userId]
    );

    const total = Number(countRows[0]?.total || 0);

    res.json({
      items: rows,
      total,
      hasMore: offset + rows.length < total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching user order history:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { first_name, last_name, date_of_birth, gender } = req.body;

    if (!first_name || !last_name) {
      return res.status(400).json({
        message: "First name and last name are required",
      });
    }

    // Cloudinary image URL (if uploaded)
    const imageUrl = req.file ? req.file.path : null;

    let query = `
      UPDATE users
      SET first_name = ?, last_name = ?, date_of_birth = ?, gender = ?
    `;
    const values = [
      first_name,
      last_name,
      date_of_birth || null,
      gender || null,
    ];

    // Only update image if a new one was uploaded
    if (imageUrl) {
      query += `, profile_image = ?`;
      values.push(imageUrl);
    }

    query += ` WHERE id = ?`;
    values.push(userId);

    await db.execute(query, values);

    // Fetch updated user
    const [rows] = await db.execute(
      `
      SELECT 
        u.id, 
        u.first_name, 
        u.last_name, 
        u.email, 
        u.role_id,
        r.name as role,
        u.date_of_birth, 
        u.gender, 
        u.profile_image as image,
        u.is_verified, 
        u.created_at 
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
      `,
      [userId]
    );

    res.json(rows[0]);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
