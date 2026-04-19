import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import sendEmail from "../utils/sendEmail.js";

const buildOtpEmailTemplate = ({
  title,
  subtitle,
  otp,
  footerNote = "For your security, never share this code with anyone.",
}) => `
  <div style="margin:0;padding:32px 16px;background:#f4efe6;font-family:Arial,Helvetica,sans-serif;color:#1c1917;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;">
      <tr>
        <td style="padding:0;">
          <div style="background:linear-gradient(135deg,#1f2937 0%,#111827 100%);border-radius:28px 28px 0 0;padding:28px 32px;">
            <div style="display:inline-block;padding:8px 14px;border-radius:999px;background:rgba(255,255,255,0.12);color:#d1fae5;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">
              Sano Ghar
            </div>
            <h1 style="margin:20px 0 8px;font-size:30px;line-height:1.15;color:#ffffff;font-family:Georgia,'Times New Roman',serif;">
              ${title}
            </h1>
            <p style="margin:0;color:#d6d3d1;font-size:15px;line-height:1.7;">
              ${subtitle}
            </p>
          </div>

          <div style="background:#ffffff;border:1px solid #e7e5e4;border-top:none;border-radius:0 0 28px 28px;padding:32px;">
            <p style="margin:0 0 18px;font-size:14px;color:#57534e;line-height:1.7;">
              Use the verification code below to continue.
            </p>

            <div style="margin:0 0 22px;padding:20px;border-radius:24px;background:linear-gradient(135deg,#ecfdf5 0%,#f5f5f4 100%);border:1px solid #d6d3d1;text-align:center;">
              <div style="font-size:12px;font-weight:700;letter-spacing:0.24em;text-transform:uppercase;color:#78716c;margin-bottom:10px;">
                One-Time Password
              </div>
              <div style="font-size:36px;line-height:1;font-weight:800;letter-spacing:0.35em;color:#111827;padding-left:0.35em;">
                ${otp}
              </div>
            </div>

            <div style="margin:0 0 20px;padding:16px 18px;border-radius:18px;background:#fafaf9;border:1px solid #e7e5e4;">
              <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#1f2937;text-transform:uppercase;letter-spacing:0.08em;">
                Valid for 10 minutes
              </p>
              <p style="margin:0;font-size:14px;line-height:1.6;color:#57534e;">
                ${footerNote}
              </p>
            </div>

            <p style="margin:0;font-size:12px;line-height:1.7;color:#a8a29e;text-align:center;">
              If you did not request this code, you can safely ignore this email.
            </p>
          </div>
        </td>
      </tr>
    </table>
  </div>
`;

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
      ` INSERT INTO users 
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
      html: buildOtpEmailTemplate({
        title: "Verify your account",
        subtitle: "Welcome to Sano Ghar. Confirm your email to complete your account setup and continue your journey.",
        otp,
      }),
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
      html: buildOtpEmailTemplate({
        title: "Your new verification code",
        subtitle: "You requested a fresh OTP for your Sano Ghar account. Enter this code to continue.",
        otp,
      }),
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
      text: `Your OTP is: ${otp}. It expires in 10 minutes.`,
      html: buildOtpEmailTemplate({
        title: "Reset your password",
        subtitle: "We received a password reset request for your account. Use this code to securely continue.",
        otp,
        footerNote: "This code expires in 10 minutes. If you did not request a reset, please ignore this message.",
      }),
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
