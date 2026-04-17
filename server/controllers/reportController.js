import db from "../config/db.js";

let reportsTableReady = false;

const ensureReportsTable = async () => {
  if (reportsTableReady) return;

  // Create reports table
  await db.query(`
    CREATE TABLE IF NOT EXISTS reports (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      subject VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      category ENUM('Technical', 'Payment', 'Adoption', 'Other') DEFAULT 'Other',
      priority ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
      status ENUM('Pending', 'In Progress', 'Resolved', 'Closed') DEFAULT 'Pending',
      assigned_to INT DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Create user notifications table for reports
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

  reportsTableReady = true;
};

// POST /api/reports - Create new report
export const createReport = async (req, res) => {
  try {
    await ensureReportsTable();
    const { subject, description, category, priority } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User authentication required" });
    }

    if (!subject || !description) {
      return res.status(400).json({ success: false, message: "Subject and description are required" });
    }

    const [result] = await db.query(
      `INSERT INTO reports (user_id, subject, description, category, priority) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, subject, description, category || 'Other', priority || 'Medium']
    );

    res.status(201).json({ 
      success: true, 
      message: "Report submitted successfully",
      reportId: result.insertId
    });

  } catch (error) {
    console.error("Failed to create report:", error);
    res.status(500).json({ success: false, message: "Failed to submit report" });
  }
};

// GET /api/reports - Get user's reports
export const getUserReports = async (req, res) => {
  try {
    await ensureReportsTable();
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User authentication required" });
    }

    const [reports] = await db.query(
      `SELECT id, subject, description, category, priority, status, 
              created_at, updated_at 
       FROM reports 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json({ success: true, reports });

  } catch (error) {
    console.error("Failed to fetch user reports:", error);
    res.status(500).json({ success: false, message: "Failed to fetch reports" });
  }
};

// GET /api/admin/reports - Get all reports for admin
export const getAllReports = async (req, res) => {
  try {
    await ensureReportsTable();

    const [reports] = await db.query(
      `SELECT r.id, r.subject, r.description, r.category, r.priority, 
              r.status, r.assigned_to, r.created_at, r.updated_at,
              u.first_name, u.last_name, u.email
       FROM reports r
       LEFT JOIN users u ON u.id = r.user_id
       ORDER BY r.created_at DESC`
    );

    res.json({ success: true, reports });

  } catch (error) {
    console.error("Failed to fetch all reports:", error);
    res.status(500).json({ success: false, message: "Failed to fetch reports" });
  }
};

// PUT /api/admin/reports/:reportId/status - Update report status
export const updateReportStatus = async (req, res) => {
  try {
    await ensureReportsTable();
    const reportId = Number(req.params.reportId);
    const { status, assigned_to } = req.body;
    const adminId = req.admin?.admin_id;

    if (!Number.isInteger(reportId)) {
      return res.status(400).json({ success: false, message: "Invalid report id" });
    }

    if (!['Pending', 'In Progress', 'Resolved', 'Closed'].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    // Get report details for notification
    const [reportDetails] = await db.query(
      "SELECT user_id, subject FROM reports WHERE id = ?",
      [reportId]
    );

    if (reportDetails.length === 0) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    // Update report status
    await db.query(
      "UPDATE reports SET status = ?, assigned_to = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [status, assigned_to || null, reportId]
    );

    // Create notification for user
    const userId = reportDetails[0].user_id;
    const subject = reportDetails[0].subject;
    let message = "";

    if (status === 'In Progress') {
      message = `Your report "${subject}" is now being reviewed by our team`;
    } else if (status === 'Resolved') {
      message = `Your report "${subject}" has been resolved`;
    } else if (status === 'Closed') {
      message = `Your report "${subject}" has been closed`;
    }

    if (message) {
      await db.query(
        "INSERT INTO user_notifications (user_id, type, message, related_id) VALUES (?, 'report', ?, ?)",
        [userId, message, reportId]
      );
    }

    res.json({ success: true, message: "Report status updated successfully" });

  } catch (error) {
    console.error("Failed to update report status:", error);
    res.status(500).json({ success: false, message: "Failed to update report status" });
  }
};

// GET /api/user/notifications - Get user notifications
export const getUserNotifications = async (req, res) => {
  try {
    await ensureReportsTable();
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User authentication required" });
    }

    const [notifications] = await db.query(
      `SELECT id, type, message, related_id, is_read, created_at
       FROM user_notifications 
       WHERE user_id = ? 
       ORDER BY created_at DESC
       LIMIT 50`,
      [userId]
    );

    res.json({ success: true, notifications });

  } catch (error) {
    console.error("Failed to fetch user notifications:", error);
    res.status(500).json({ success: false, message: "Failed to fetch notifications" });
  }
};

// PUT /api/user/notifications/:notificationId/read - Mark notification as read
export const markUserNotificationRead = async (req, res) => {
  try {
    await ensureReportsTable();
    const notificationId = Number(req.params.notificationId);
    const userId = req.user?.id;

    if (!Number.isInteger(notificationId)) {
      return res.status(400).json({ success: false, message: "Invalid notification id" });
    }

    await db.query(
      "UPDATE user_notifications SET is_read = TRUE WHERE id = ? AND user_id = ?",
      [notificationId, userId]
    );

    res.json({ success: true, message: "Notification marked as read" });

  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    res.status(500).json({ success: false, message: "Failed to update notification" });
  }
};
