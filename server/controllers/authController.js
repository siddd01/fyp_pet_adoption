import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import sendEmail from "../utils/sendEmail.js";

export const signup = async (req, res) => {
  try {
    const { first_name, last_name, email, password, role_id, date_of_birth, gender } = req.body;

    // Check if email exists
    const [existingUser] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(409).json({ success: false, message: "Email already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otp_expiry = new Date(Date.now() + 10 * 60 * 1000);

    // Insert user into DB
    await db.query(
      `INSERT INTO users 
      (first_name, last_name, email, password, role_id, date_of_birth, gender, otp, otp_expiry) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, email, hashedPassword, role_id, date_of_birth, gender, otp, otp_expiry]
    );

    // ----------------------------
    // Send OTP via email
    // ----------------------------
    await sendEmail({
      to: email,
      subject: "Your OTP for Pet Adoption Center",
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    });

    // Respond success
    res.status(201).json({
      success: true,
      message: "Account created successfully! OTP sent to email."
    });

  } catch (error) {
    console.log(error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ success: false, message: "Email already exists." });
    }
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};



// ----------------------
// Verify OTP
// ----------------------

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const [rows] = await db.query(
      "SELECT otp, otp_expiry FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];

    if (Number(user.otp) !== Number(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date(user.otp_expiry) < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    await db.query(
      "UPDATE users SET otp = NULL, otp_expiry = NULL, is_verified = 1 WHERE email = ?",
      [email]
    );

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required."
      });
    }

    const [user] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otp_expiry = new Date(Date.now() + 10 * 60 * 1000);

    await db.query(
      "UPDATE users SET otp = ?, otp_expiry = ? WHERE email = ?",
      [otp, otp_expiry, email]
    );

    await sendEmail({
      to: email,
      subject: "Your New OTP for Pet Adoption Center",
      text: `Your new OTP is ${otp}. It is valid for 10 minutes.`,
    });

    res.status(200).json({
      success: true,
      message: "New OTP sent to your email."
    });

  } catch (error) {
    console.error("RESEND OTP ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to resend OTP."
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  console.log("➡️ Login request received:", email);

  const sql = "SELECT * FROM users WHERE email = ?";

  try {
    const [result] = await db.query(sql, [email]);
    console.log("📌 DB query result:", result);

    if (result.length === 0) {
      console.log("❌ No user found");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result[0];
    console.log("📌 User record:", user);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("📌 bcrypt.compare result:", isMatch);

    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("✅ Login successful!");

    return res.json({
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        role_id: user.role_id,
      },
    });
  } catch (error) {
    console.log("❌ Login Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  db.query(
    "DELETE FROM password_reset_otps WHERE email = ?",
    [email]
  );

  db.query(
    "INSERT INTO password_reset_otps (email, otp, expires_at) VALUES (?, ?, ?)",
    [email, otp, expiresAt],
    async (err) => {
      if (err) return res.status(500).json({ message: "Error" });

      await sendEmail(email, otp);
      res.json({ message: "OTP sent to email" });
    }
  );
};



export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  db.query(
    "SELECT * FROM password_reset_otps WHERE email = ? AND otp = ?",
    [email, otp],
    async (err, result) => {
      if (err || result.length === 0) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      if (new Date(result[0].expires_at) < new Date()) {
        return res.status(400).json({ message: "OTP expired" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      db.query(
        "UPDATE users SET password = ? WHERE email = ?",
        [hashedPassword, email]
      );

      db.query(
        "DELETE FROM password_reset_otps WHERE email = ?",
        [email]
      );

      res.json({ message: "Password updated successfully" });
    }
  );
};
