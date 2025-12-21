import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import { sendOTPEmail } from "../utils/sendEmail.js";

export const signup = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    role_id,
    date_of_birth,
    gender,
  } = req.body;

  // Validate required fields
  if (!first_name || !last_name || !email || !password || !date_of_birth || !gender) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // 6 digit OTP
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minute expiry

    const sql = `
      INSERT INTO users 
      (first_name, last_name, email, password, role_id, date_of_birth, gender, otp, otp_expiry)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        first_name,
        last_name,
        email,
        hashedPassword,
        role_id || 3, // default customer
        date_of_birth,
        gender,
        otp,
        otpExpiry,
      ],
      async (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "User already exists or DB error" });
        }

        // Send OTP email
        await sendOTPEmail(email, otp);

        res.status(201).json({
          message: "Signup successful. OTP sent to email.",
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};



export const login = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err || result.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user.user_id,
        name: user.full_name,
        role: user.role,
      },
    });
  });
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

      await sendOTPEmail(email, otp);
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
