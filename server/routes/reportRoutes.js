import express from "express";
import {
  createReport,
  getUserReports,
  getAllReports,
  updateReportStatus,
  getUserNotifications,
  markUserNotificationRead,
} from "../controllers/reportController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import adminAuth from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

// User report routes
router.post("/", verifyToken, createReport);
router.get("/", verifyToken, getUserReports);
router.get("/user/notifications", verifyToken, getUserNotifications);
router.put("/user/notifications/:notificationId/read", verifyToken, markUserNotificationRead);

// Admin report routes
router.get("/admin/reports", adminAuth(), getAllReports);
router.put("/admin/reports/:reportId/status", adminAuth(), updateReportStatus);

export default router;
