import bcrypt from "bcryptjs";
import db from "../config/db.js";
import sendEmail from "../utils/sendEmail.js";
import { getPasswordValidationError } from "../utils/passwordPolicy.js";
import {
  MAX_SECURITY_ATTEMPTS,
  buildBlockedResponse,
  buildSecurityMeta,
  ensureTableColumns,
  isSecurityBlocked,
  registerFailedSecurityAttempt,
  resetSecurityAttemptsIfExpired,
} from "../utils/accountSecurity.js";

const ensureStaffResetColumns = async () => {
  await ensureTableColumns({
    key: "staff-reset-columns",
    table: "staff",
    definitions: [
      "otp VARCHAR(10) NULL",
      "otp_expiry DATETIME NULL",
      "otp_attempts INT NOT NULL DEFAULT 0",
      "otp_blocked_until DATETIME NULL",
    ],
  });
};

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
          <div style="background:linear-gradient(135deg,#111827 0%,#1f2937 55%,#0f766e 100%);border-radius:28px 28px 0 0;padding:28px 32px;">
            <div style="display:inline-block;padding:8px 14px;border-radius:999px;background:rgba(255,255,255,0.12);color:#ccfbf1;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">
              Sano Ghar Staff
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

            <div style="margin:0 0 22px;padding:20px;border-radius:24px;background:linear-gradient(135deg,#ecfeff 0%,#f5f5f4 100%);border:1px solid #d6d3d1;text-align:center;">
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

const sendOtpExpiredResponse = (res, record, message = "Token expired") =>
  res.status(400).json({
    message,
    otpExpired: true,
    ...buildSecurityMeta(record, {
      attemptsKey: "otp_attempts",
      blockedUntilKey: "otp_blocked_until",
      maxAttempts: MAX_SECURITY_ATTEMPTS,
    }),
  });

export const staffForgotPassword = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  try {
    await ensureStaffResetColumns();

    const [rows] = await db.query(
      `
        SELECT
          staff_id,
          first_name,
          last_name,
          otp_attempts,
          otp_blocked_until
        FROM staff
        WHERE email = ? AND status = 'ACTIVE'
      `,
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Staff account not found" });
    }

    const staff = rows[0];

    await resetSecurityAttemptsIfExpired({
      record: staff,
      table: "staff",
      keyColumn: "email",
      keyValue: email,
      attemptsKey: "otp_attempts",
      blockedUntilKey: "otp_blocked_until",
    });

    if (isSecurityBlocked(staff, "otp_blocked_until")) {
      const blocked = buildBlockedResponse(staff, {
        attemptsKey: "otp_attempts",
        blockedUntilKey: "otp_blocked_until",
        blockedFlag: "otpBlocked",
        message: "OTP is temporarily blocked. Please wait before requesting a new code.",
      });

      return res.status(blocked.status).json(blocked.body);
    }

    await db.query(
      `
        UPDATE staff
        SET otp = ?,
            otp_expiry = ?,
            otp_attempts = 0,
            otp_blocked_until = NULL
        WHERE email = ?
      `,
      [otp, expiresAt, email]
    );

    await sendEmail({
      to: email,
      subject: "Staff Password Reset OTP",
      text: `Your staff OTP is: ${otp}. It expires in 10 minutes.`,
      html: buildOtpEmailTemplate({
        title: "Reset your staff password",
        subtitle: `A password reset was requested for ${[staff.first_name, staff.last_name].filter(Boolean).join(" ") || "your staff account"}. Use this code to continue securely.`,
        otp,
        footerNote: "This code expires in 10 minutes. If you did not request a reset, ignore this email and review your account security.",
      }),
    });

    return res.json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Staff forgot password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const verifyStaffResetOTP = async (req, res) => {
  try {
    await ensureStaffResetColumns();
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const [rows] = await db.query(
      `
        SELECT
          otp,
          otp_expiry,
          otp_attempts,
          otp_blocked_until
        FROM staff
        WHERE email = ? AND status = 'ACTIVE'
      `,
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Staff account not found" });
    }

    const staff = rows[0];

    await resetSecurityAttemptsIfExpired({
      record: staff,
      table: "staff",
      keyColumn: "email",
      keyValue: email,
      attemptsKey: "otp_attempts",
      blockedUntilKey: "otp_blocked_until",
    });

    if (isSecurityBlocked(staff, "otp_blocked_until")) {
      const blocked = buildBlockedResponse(staff, {
        attemptsKey: "otp_attempts",
        blockedUntilKey: "otp_blocked_until",
        blockedFlag: "otpBlocked",
      });

      return res.status(blocked.status).json(blocked.body);
    }

    if (!staff.otp || Number(staff.otp) !== Number(otp)) {
      const failedAttempt = await registerFailedSecurityAttempt({
        table: "staff",
        keyColumn: "email",
        keyValue: email,
        currentAttempts: staff.otp_attempts,
        attemptsKey: "otp_attempts",
        blockedUntilKey: "otp_blocked_until",
        blockedFlag: "otpBlocked",
        invalidMessage: "Invalid OTP",
      });

      return res.status(failedAttempt.status).json(failedAttempt.body);
    }

    if (!staff.otp_expiry || new Date(staff.otp_expiry) < new Date()) {
      return sendOtpExpiredResponse(res, staff);
    }

    await db.query(
      "UPDATE staff SET otp_attempts = 0, otp_blocked_until = NULL WHERE email = ?",
      [email]
    );

    return res.json({
      message: "Reset OTP verified successfully",
      remainingTries: MAX_SECURITY_ATTEMPTS,
      blockedUntil: null,
    });
  } catch (error) {
    console.error("Verify staff reset OTP error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const resetStaffPassword = async (req, res) => {
  try {
    await ensureStaffResetColumns();
    const { email, otp, password, newPassword, confirmPassword } = req.body;
    const nextPassword = newPassword || password;

    if (!email || !otp || !nextPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    if (confirmPassword && nextPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const passwordError = getPasswordValidationError(nextPassword);
    if (passwordError) {
      return res.status(400).json({ message: passwordError });
    }

    const [rows] = await db.query(
      `
        SELECT
          staff_id,
          otp,
          otp_expiry,
          otp_attempts,
          otp_blocked_until
        FROM staff
        WHERE email = ? AND status = 'ACTIVE'
      `,
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Staff account not found" });
    }

    const staff = rows[0];

    await resetSecurityAttemptsIfExpired({
      record: staff,
      table: "staff",
      keyColumn: "email",
      keyValue: email,
      attemptsKey: "otp_attempts",
      blockedUntilKey: "otp_blocked_until",
    });

    if (isSecurityBlocked(staff, "otp_blocked_until")) {
      const blocked = buildBlockedResponse(staff, {
        attemptsKey: "otp_attempts",
        blockedUntilKey: "otp_blocked_until",
        blockedFlag: "otpBlocked",
      });

      return res.status(blocked.status).json(blocked.body);
    }

    if (!staff.otp || Number(staff.otp) !== Number(otp)) {
      const failedAttempt = await registerFailedSecurityAttempt({
        table: "staff",
        keyColumn: "email",
        keyValue: email,
        currentAttempts: staff.otp_attempts,
        attemptsKey: "otp_attempts",
        blockedUntilKey: "otp_blocked_until",
        blockedFlag: "otpBlocked",
        invalidMessage: "Invalid OTP",
      });

      return res.status(failedAttempt.status).json(failedAttempt.body);
    }

    if (!staff.otp_expiry || new Date(staff.otp_expiry) < new Date()) {
      return sendOtpExpiredResponse(res, staff);
    }

    const hashedPassword = await bcrypt.hash(nextPassword, 10);

    await db.query(
      `
        UPDATE staff
        SET password = ?,
            otp = NULL,
            otp_expiry = NULL,
            otp_attempts = 0,
            otp_blocked_until = NULL
        WHERE staff_id = ?
      `,
      [hashedPassword, staff.staff_id]
    );

    return res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset staff password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
