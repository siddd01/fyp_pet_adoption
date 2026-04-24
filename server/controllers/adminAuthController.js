import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import sendEmail from "../utils/sendEmail.js";

let adminResetColumnsReady = false;
const MAX_OTP_ATTEMPTS = 3;
const OTP_BLOCK_DURATION_MS = 60 * 60 * 1000;

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
              Sano Ghar Admin
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

const ensureAdminResetColumns = async () => {
  if (adminResetColumnsReady) return;

  await db.query(`
    ALTER TABLE admins
    ADD COLUMN IF NOT EXISTS otp VARCHAR(10) NULL,
    ADD COLUMN IF NOT EXISTS otp_expiry DATETIME NULL,
    ADD COLUMN IF NOT EXISTS otp_attempts INT NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS otp_blocked_until DATETIME NULL
  `);

  adminResetColumnsReady = true;
};

const buildOtpMeta = (record = {}) => {
  const attempts = Number(record.otp_attempts || 0);
  return {
    remainingTries: Math.max(0, MAX_OTP_ATTEMPTS - attempts),
    blockedUntil: record.otp_blocked_until || null,
  };
};

const sendOtpBlockedResponse = (res, record, message = "Too many OTP attempts. Try again after 1 hour.") =>
  res.status(429).json({
    message,
    otpBlocked: true,
    ...buildOtpMeta(record),
  });

const sendOtpExpiredResponse = (res, record, message = "Token expired") =>
  res.status(400).json({
    message,
    otpExpired: true,
    ...buildOtpMeta(record),
  });

const handleInvalidOtpAttempt = async ({ email, currentAttempts, res }) => {
  const nextAttempts = Number(currentAttempts || 0) + 1;

  if (nextAttempts >= MAX_OTP_ATTEMPTS) {
    const blockedUntil = new Date(Date.now() + OTP_BLOCK_DURATION_MS);
    await db.query(
      "UPDATE admins SET otp_attempts = ?, otp_blocked_until = ? WHERE email = ?",
      [MAX_OTP_ATTEMPTS, blockedUntil, email]
    );

    return sendOtpBlockedResponse(res, {
      otp_attempts: MAX_OTP_ATTEMPTS,
      otp_blocked_until: blockedUntil,
    });
  }

  await db.query(
    "UPDATE admins SET otp_attempts = ?, otp_blocked_until = NULL WHERE email = ?",
    [nextAttempts, email]
  );

  return res.status(400).json({
    message: "Invalid OTP",
    remainingTries: MAX_OTP_ATTEMPTS - nextAttempts,
    blockedUntil: null,
  });
};

export const adminRegister = async (req, res) => {
  const { full_name, email, password } = req.body;

  try {
    const [admins] = await db.query("SELECT admin_id FROM admins LIMIT 1");
    const isFirstAdmin = admins.length === 0;

    if (!isFirstAdmin) {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const token = authHeader.split(" ")[1];

      try {
        const requestingAdmin = jwt.verify(token, process.env.JWT_SECRET);

        if (requestingAdmin.role !== "ADMIN") {
          return res.status(403).json({ message: "Admins only" });
        }
      } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
      }
    }

    const [existing] = await db.query("SELECT admin_id FROM admins WHERE email = ?", [email]);
    if (existing.length) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO admins (full_name, email, password, role)
       VALUES (?, ?, ?, 'ADMIN')`,
      [full_name, email, hashedPassword]
    );

    res.status(201).json({
      message: isFirstAdmin ? "First admin created" : "Admin created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Admin registration failed" });
  }
};

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT * FROM admins WHERE email = ? AND status = 'ACTIVE'",
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        admin_id: admin.admin_id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      admin: {
        admin_id: admin.admin_id,
        full_name: admin.full_name,
        email: admin.email,
        profile_image: admin.profile_image,
        cover_image: admin.cover_image,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

export const adminForgotPassword = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  try {
    await ensureAdminResetColumns();

    const [rows] = await db.execute(
      "SELECT admin_id, full_name, otp_attempts, otp_blocked_until FROM admins WHERE email = ?",
      [email]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (rows[0].otp_blocked_until && new Date(rows[0].otp_blocked_until) > new Date()) {
      return sendOtpBlockedResponse(res, rows[0], "OTP is temporarily blocked. Please wait before requesting a new code.");
    }

    await db.query(
      "UPDATE admins SET otp = ?, otp_expiry = ?, otp_attempts = 0, otp_blocked_until = NULL WHERE email = ?",
      [otp, expiresAt, email]
    );

    await sendEmail({
      to: email,
      subject: "Admin Password Reset OTP",
      text: `Your admin OTP is: ${otp}. It expires in 10 minutes.`,
      html: buildOtpEmailTemplate({
        title: "Reset your admin password",
        subtitle: `A password reset was requested for ${rows[0].full_name || "your admin account"}. Use this code to continue securely.`,
        otp,
        footerNote: "This code expires in 10 minutes. If you did not request this reset, ignore this email and review your account security.",
      }),
    });

    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Admin forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyAdminResetOTP = async (req, res) => {
  try {
    await ensureAdminResetColumns();
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const [rows] = await db.query(
      "SELECT otp, otp_expiry, otp_attempts, otp_blocked_until FROM admins WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const admin = rows[0];

    if (admin.otp_blocked_until && new Date(admin.otp_blocked_until) > new Date()) {
      return sendOtpBlockedResponse(res, admin);
    }

    if (!admin.otp || Number(admin.otp) !== Number(otp)) {
      return handleInvalidOtpAttempt({
        email,
        currentAttempts: admin.otp_attempts,
        res,
      });
    }

    if (!admin.otp_expiry || new Date(admin.otp_expiry) < new Date()) {
      return sendOtpExpiredResponse(res, admin);
    }

    await db.query(
      "UPDATE admins SET otp_attempts = 0, otp_blocked_until = NULL WHERE email = ?",
      [email]
    );

    res.json({ message: "Reset OTP verified successfully", remainingTries: MAX_OTP_ATTEMPTS });
  } catch (error) {
    console.error("Verify admin reset OTP error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetAdminPassword = async (req, res) => {
  try {
    await ensureAdminResetColumns();
    const { email, otp, password, newPassword, confirmPassword } = req.body;
    const nextPassword = newPassword || password;

    if (!email || !otp || !nextPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    if (confirmPassword && nextPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (String(nextPassword).length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const [rows] = await db.query(
      "SELECT admin_id, otp, otp_expiry, otp_attempts, otp_blocked_until FROM admins WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const admin = rows[0];

    if (admin.otp_blocked_until && new Date(admin.otp_blocked_until) > new Date()) {
      return sendOtpBlockedResponse(res, admin);
    }

    if (!admin.otp || Number(admin.otp) !== Number(otp)) {
      return handleInvalidOtpAttempt({
        email,
        currentAttempts: admin.otp_attempts,
        res,
      });
    }

    if (!admin.otp_expiry || new Date(admin.otp_expiry) < new Date()) {
      return sendOtpExpiredResponse(res, admin);
    }

    const hashedPassword = await bcrypt.hash(nextPassword, 10);

    await db.query(
      "UPDATE admins SET password = ?, otp = NULL, otp_expiry = NULL, otp_attempts = 0, otp_blocked_until = NULL WHERE admin_id = ?",
      [hashedPassword, admin.admin_id]
    );

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset admin password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
