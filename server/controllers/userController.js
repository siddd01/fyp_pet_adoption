import bcrypt from "bcryptjs";
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
import { ensureOrderFulfillmentColumns } from "../utils/orderFulfillment.js";

let userNotificationsReady = false;

const ensureUserPasswordSecurityColumns = async () => {
  await ensureTableColumns({
    key: "users-password-change-columns",
    table: "users",
    definitions: [
      "password_change_attempts INT NOT NULL DEFAULT 0",
      "password_change_blocked_until DATETIME NULL",
    ],
  });
};

const ensureUserNotificationsTable = async () => {
  if (userNotificationsReady) return;

  await db.query(`
    CREATE TABLE IF NOT EXISTS user_notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      type ENUM('adoption', 'report', 'general') NOT NULL,
      message TEXT NOT NULL,
      related_id INT DEFAULT NULL,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  userNotificationsReady = true;
};

const runCleanupQuery = async (connection, sql, params) => {
  try {
    await connection.query(sql, params);
  } catch (error) {
    if (error.code !== "ER_NO_SUCH_TABLE") {
      throw error;
    }
  }
};

const deleteUserData = async (connection, userId) => {
  await runCleanupQuery(connection, "DELETE FROM admin_notifications WHERE user_id = ?", [userId]);
  await runCleanupQuery(connection, "DELETE FROM post_comments WHERE user_id = ?", [userId]);
  await runCleanupQuery(connection, "DELETE FROM post_likes WHERE user_id = ?", [userId]);
  await runCleanupQuery(connection, "DELETE FROM user_notifications WHERE user_id = ?", [userId]);
  await runCleanupQuery(connection, "DELETE FROM reports WHERE user_id = ?", [userId]);
  await runCleanupQuery(connection, "DELETE FROM adoption_applications WHERE user_id = ?", [userId]);
  await runCleanupQuery(connection, "DELETE FROM cart_items WHERE user_id = ?", [userId]);
  await runCleanupQuery(connection, "DELETE oi FROM order_items oi INNER JOIN orders o ON oi.order_id = o.id WHERE o.user_id = ?", [userId]);
  await runCleanupQuery(connection, "DELETE FROM orders WHERE user_id = ?", [userId]);
  await runCleanupQuery(connection, "DELETE FROM donations WHERE user_id = ?", [userId]);
  await connection.query("DELETE FROM users WHERE id = ?", [userId]);
};

export const getLoggedInUser = async (req, res) => {
  try {
    const userId = req.user.id;

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
    await ensureOrderFulfillmentColumns();
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
        o.fulfillment_status,
        o.handled_at,
        o.estimated_delivery_date,
        o.staff_note,
        o.full_name,
        o.email,
        o.phone,
        o.shipping_address,
        o.created_at,
        s.staff_id AS handled_by_staff_id,
        s.first_name AS staff_first_name,
        s.last_name AS staff_last_name,
        oi.product_id,
        oi.quantity,
        oi.price_at_purchase,
        p.name AS product_name,
        p.category,
        p.image_url
      FROM orders o
      INNER JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN products p ON p.id = oi.product_id
      LEFT JOIN staff s ON s.staff_id = o.handled_by_staff_id
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

export const changeUserPassword = async (req, res) => {
  try {
    await ensureUserPasswordSecurityColumns();

    const userId = req.user.id;
    const currentPassword = req.body.currentPassword || req.body.oldPassword;
    const { newPassword, confirmPassword } = req.body;

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
        FROM users
        WHERE id = ?
      `,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];

    await resetSecurityAttemptsIfExpired({
      record: user,
      table: "users",
      keyColumn: "id",
      keyValue: userId,
      attemptsKey: "password_change_attempts",
      blockedUntilKey: "password_change_blocked_until",
    });

    if (isSecurityBlocked(user, "password_change_blocked_until")) {
      const blocked = buildBlockedResponse(user, {
        attemptsKey: "password_change_attempts",
        blockedUntilKey: "password_change_blocked_until",
        blockedFlag: "passwordChangeBlocked",
        message: "Too many incorrect current password attempts. Try again after 1 hour.",
      });

      return res.status(blocked.status).json(blocked.body);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      const failedAttempt = await registerFailedSecurityAttempt({
        table: "users",
        keyColumn: "id",
        keyValue: userId,
        currentAttempts: user.password_change_attempts,
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
        UPDATE users
        SET password = ?,
            password_change_attempts = 0,
            password_change_blocked_until = NULL
        WHERE id = ?
      `,
      [hashedPassword, userId]
    );

    return res.json({
      message: "Password updated successfully",
      remainingTries: MAX_SECURITY_ATTEMPTS,
      blockedUntil: null,
    });
  } catch (error) {
    console.error("Error changing user password:", error);
    return res.status(500).json({ message: "Failed to change password" });
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

    const imageUrl = req.file ? req.file.path : null;

    let query = `
      UPDATE users
      SET first_name = ?, last_name = ?, date_of_birth = ?, gender = ?
    `;
    const values = [first_name, last_name, date_of_birth || null, gender || null];

    if (imageUrl) {
      query += `, profile_image = ?`;
      values.push(imageUrl);
    }

    query += ` WHERE id = ?`;
    values.push(userId);

    await db.execute(query, values);

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

export const deleteOwnAccount = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const userId = req.user.id;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const [rows] = await connection.query("SELECT password FROM users WHERE id = ?", [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValid = await bcrypt.compare(password, rows[0].password);
    if (!isValid) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    await connection.beginTransaction();
    await deleteUserData(connection, userId);
    await connection.commit();

    res.json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("Error deleting own account:", error);
    res.status(500).json({ message: "Failed to delete account" });
  } finally {
    connection.release();
  }
};

export const getAllUsersForAdmin = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.gender,
        u.date_of_birth,
        u.profile_image,
        u.created_at,
        r.name AS role
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      ORDER BY u.created_at DESC`
    );

    res.json({ success: true, users: rows });
  } catch (error) {
    console.error("Error fetching users for admin:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const adminDeleteUserAccount = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const userId = Number(req.params.userId);

    if (!Number.isInteger(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const [rows] = await connection.query("SELECT id FROM users WHERE id = ?", [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    await connection.beginTransaction();
    await deleteUserData(connection, userId);
    await connection.commit();

    res.json({ success: true, message: "User account deleted successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("Error deleting user account by admin:", error);
    res.status(500).json({ message: "Failed to delete user account" });
  } finally {
    connection.release();
  }
};

export const sendManualUserNotification = async (req, res) => {
  try {
    await ensureUserNotificationsTable();
    const userId = Number(req.params.userId);
    const { message } = req.body;

    if (!Number.isInteger(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const [rows] = await db.query("SELECT id FROM users WHERE id = ?", [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    await db.query(
      "INSERT INTO user_notifications (user_id, type, message, related_id) VALUES (?, 'general', ?, NULL)",
      [userId, message.trim()]
    );

    res.json({ success: true, message: "Notification sent successfully" });
  } catch (error) {
    console.error("Error sending manual user notification:", error);
    res.status(500).json({ message: "Failed to send notification" });
  }
};
