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
      return res.status(409).json({ success: false, message: "Email already exists."});
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

export const verifyResetOTP = async (req, res) => {
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

    if (!user.otp || Number(user.otp) !== Number(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (!user.otp_expiry || new Date(user.otp_expiry) < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    res.json({ message: "Reset OTP verified successfully" });
  } catch (error) {
    console.error("Verify reset OTP error:", error);
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

  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];

    if (!user.is_verified) {
      return res.status(403).json({ message: "Please verify your email before logging in" });
    }

    // If using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Return token and user info
    res.json({
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role_id: user.role_id,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log(" Received forgot password request for:", email);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });

    await db.query("UPDATE users SET otp = ?, otp_expiry = ? WHERE email = ?", [otp, expiresAt, email]);
    console.log("OTP updated in DB:", otp);

    // Corrected email call
    await sendEmail({
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is: ${otp}. It expires in 10 minutes.`
    });

    res.json({ message: "OTP sent to your email" });

  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};




export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password, newPassword } = req.body;
    const nextPassword = newPassword || password;

    if (!email || !otp || !nextPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    const [rows] = await db.query(
      "SELECT id, otp, otp_expiry FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];

    if (!user.otp || Number(user.otp) !== Number(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (!user.otp_expiry || new Date(user.otp_expiry) < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (String(nextPassword).length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const hashedPassword = await bcrypt.hash(nextPassword, 10);

    const [result] = await db.query(
      "UPDATE users SET password = ?, otp = NULL, otp_expiry = NULL WHERE id = ?",
      [hashedPassword, user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPasswordWithToken = async (req, res) => {
  return res.status(410).json({
    message: "This reset link flow is no longer supported. Please use the OTP reset flow.",
  });
};
