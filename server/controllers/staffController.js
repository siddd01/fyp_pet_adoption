import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import { getPasswordValidationError } from "../utils/passwordPolicy.js";
import {
  MAX_SECURITY_ATTEMPTS,
  buildBlockedResponse,
  ensureTableColumns,
  isSecurityBlocked,
  registerFailedSecurityAttempt,
  resetSecurityAttemptsIfExpired,
} from "../utils/accountSecurity.js";

const ensureStaffPasswordSecurityColumns = async () => {
  await ensureTableColumns({
    key: "staff-password-change-columns",
    table: "staff",
    definitions: [
      "password_change_attempts INT NOT NULL DEFAULT 0",
      "password_change_blocked_until DATETIME NULL",
    ],
  });
};

// Signup Staff
// controllers/staffController.js

// Staff Login
export const staffLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM staff WHERE email = ? AND status = 'ACTIVE'", [email]);

    if (!rows.length) return res.status(401).json({ message: "Invalid credentials" });

    const staff = rows[0];
    const isMatch = await bcrypt.compare(password, staff.password);

    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { staff_id: staff.staff_id, role: staff.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      staff: {
        staff_id: staff.staff_id,
        first_name: staff.first_name,
        last_name: staff.last_name,
        email: staff.email,
        role: staff.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
};


export const deleteStaff = async (req, res) => {
  const { staff_id } = req.params;
  const { adminPassword } = req.body;

  try {
const [adminRows] = await db.query(
      "SELECT password FROM admins WHERE admin_id = ?", 
      [req.admin.admin_id]
    );

    if (adminRows.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }
    console.log("Admin found:", adminRows[0]);

    const isMatch = await bcrypt.compare(adminPassword, adminRows[0].password);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const [result] = await db.query(
      "DELETE FROM staff WHERE staff_id = ?",
      [staff_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllStaff = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM staff`);
    
    
    
    // If 'rows' is undefined or not an array, res.json() sends nothing.
    return res.status(200).json(rows || []); 
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Failed to fetch staff" });
  }
}
// Get Staff Profile
export const getStaffProfile = async (req, res) => {
  try {
    const staffId = req.staff.staff_id;
    
    const [rows] = await db.query(
      `SELECT staff_id, first_name, last_name, email, phone_number, date_of_birth, role, profile_image, status
       FROM staff WHERE staff_id = ?`,
      [staffId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching staff profile:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// Update Staff Profile
export const updateStaffProfile = async (req, res) => {
  try {
    console.log("Update staff profile request received");
    console.log("Staff from token:", req.staff);
    
    const staffId = req.staff.staff_id;
    
    if (!staffId) {
      return res.status(401).json({ message: "Staff ID not found in token" });
    }

    const { first_name, last_name, phone_number, date_of_birth } = req.body;
    


    if (!first_name || !last_name) {
      return res.status(400).json({
        message: "First name and last name are required",
      });
    }

    // Cloudinary image URL (if uploaded)
    const imageUrl = req.file ? req.file.path : null;
    console.log("Image URL:", imageUrl);

    let query = `
      UPDATE staff
      SET first_name = ?, 
          last_name = ?, 
          phone_number = ?, 
          date_of_birth = ?
    `;

    const values = [
      first_name,
      last_name,
      phone_number || null,
      date_of_birth || null,
    ];

    // Only update image if a new one was uploaded
    if (imageUrl) {
      query += `, profile_image = ?`;
      values.push(imageUrl);
    }

    query += ` WHERE staff_id = ?`;
    values.push(staffId);

    console.log("Executing query:", query);
    console.log("Values:", values);

    await db.query(query, values);

    // Fetch updated staff profile
    const [rows] = await db.query(
      `SELECT staff_id, first_name, last_name, email, phone_number, date_of_birth, role, profile_image, status
       FROM staff WHERE staff_id = ?`,
      [staffId]
    );

    console.log("Updated staff profile:", rows[0]);
    res.json(rows[0]);
  } catch (error) {
    console.error("Error updating staff profile:", error);
    res.status(500).json({ 
      message: "Server error",
      error: error.message 
    });
  }
};

export const changeStaffPassword = async (req, res) => {
  const staffId = req.staff?.staff_id;
  const currentPassword = req.body.currentPassword || req.body.oldPassword;
  const { newPassword, confirmPassword } = req.body;

  try {
    await ensureStaffPasswordSecurityColumns();

    if (!staffId) {
      return res.status(401).json({ message: "Staff authentication required" });
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Current password, new password, and confirm password are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const passwordError = getPasswordValidationError(newPassword);
    if (passwordError) {
      return res.status(400).json({ message: passwordError });
    }

    const [rows] = await db.query(
      `
        SELECT
          password,
          password_change_attempts,
          password_change_blocked_until
        FROM staff
        WHERE staff_id = ?
      `,
      [staffId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Staff not found" });
    }

    const staff = rows[0];

    await resetSecurityAttemptsIfExpired({
      record: staff,
      table: "staff",
      keyColumn: "staff_id",
      keyValue: staffId,
      attemptsKey: "password_change_attempts",
      blockedUntilKey: "password_change_blocked_until",
    });

    if (isSecurityBlocked(staff, "password_change_blocked_until")) {
      const blocked = buildBlockedResponse(staff, {
        attemptsKey: "password_change_attempts",
        blockedUntilKey: "password_change_blocked_until",
        blockedFlag: "passwordChangeBlocked",
        message: "Too many incorrect current password attempts. Try again after 1 hour.",
      });

      return res.status(blocked.status).json(blocked.body);
    }

    const isMatch = await bcrypt.compare(currentPassword, staff.password);
    if (!isMatch) {
      const failedAttempt = await registerFailedSecurityAttempt({
        table: "staff",
        keyColumn: "staff_id",
        keyValue: staffId,
        currentAttempts: staff.password_change_attempts,
        attemptsKey: "password_change_attempts",
        blockedUntilKey: "password_change_blocked_until",
        blockedFlag: "passwordChangeBlocked",
        invalidMessage: "Incorrect current password",
        blockedMessage: "Too many incorrect current password attempts. Try again after 1 hour.",
      });

      return res.status(failedAttempt.status).json(failedAttempt.body);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query(
      `
        UPDATE staff
        SET password = ?,
            password_change_attempts = 0,
            password_change_blocked_until = NULL
        WHERE staff_id = ?
      `,
      [hashedPassword, staffId]
    );

    return res.json({
      message: "Password updated successfully",
      remainingTries: MAX_SECURITY_ATTEMPTS,
      blockedUntil: null,
    });
  } catch (error) {
    console.error("Change staff password error:", error);
    return res.status(500).json({ message: "Failed to change password" });
  }
};

  export const adminUpdateStaff = async (req, res) => {
    const { staff_id } = req.params;
    const { first_name, last_name, email, phone_number, date_of_birth, status } = req.body;

    try {
      // 1. Check if the staff exists
      const [existing] = await db.query("SELECT * FROM staff WHERE staff_id = ?", [staff_id]);
      if (!existing.length) {
        return res.status(404).json({ message: "Staff member not found" });
      }

      // 2. Perform the update
      // Note: We use COALESCE or simple logic to handle optional fields
      const query = `
        UPDATE staff 
        SET first_name = ?, 
            last_name = ?, 
            email = ?, 
            phone_number = ?, 
            date_of_birth = ?, 
            status = ?
        WHERE staff_id = ?
      `;

      const values = [
        first_name,
        last_name,
        email,
        phone_number || null,
        date_of_birth || null,
        status || 'ACTIVE',
        staff_id
      ];

      await db.query(query, values);

      res.json({ message: "Staff updated successfully" });
    } catch (error) {
      console.error("Update Error:", error);
      // This will catch if phone_number or date_of_birth columns are missing in DB
      res.status(500).json({ 
        message: "Server error during update", 
        error: error.message 
      });
    }
  };

  export const staffSignup = async (req, res) => {
    const { first_name, last_name, email, password, phone_number, date_of_birth } = req.body;

    try {
      // FIX: Change req.staff to req.admin (or just remove the log)
      console.log("Admin creating staff:", req.admin?.admin_id);

      const passwordError = getPasswordValidationError(password);

      if (passwordError) {
        return res.status(400).json({ message: passwordError });
      }

      const [existing] = await db.query("SELECT staff_id FROM staff WHERE email = ?", [email]);
      if (existing.length) return res.status(400).json({ message: "Email already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await db.query(
        `INSERT INTO staff (first_name, last_name, email, password, phone_number, role, date_of_birth, status)
        VALUES (?, ?, ?, ?, ?, 'STAFF', ?, 'ACTIVE')`,
        [first_name, last_name, email, hashedPassword, phone_number, date_of_birth]
      );

      res.status(201).json({ message: "Staff created successfully", staff_id: result.insertId });
    } catch (error) {
      console.error("Signup Error:", error);
      res.status(500).json({ message: "Staff signup failed", error: error.message });
    }
  };
