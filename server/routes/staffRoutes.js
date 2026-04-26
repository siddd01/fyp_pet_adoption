import {
  adminUpdateStaff,
  changeStaffPassword,
  deleteStaff,
  getAllStaff,
  getStaffProfile,
  staffLogin,
  staffSignup,
  updateStaffProfile,
} from "../controllers/staffController.js";
import {
  resetStaffPassword,
  staffForgotPassword,
  verifyStaffResetOTP,
} from "../controllers/staffAuthController.js";
import {
  acceptStaffOrder,
  getStaffOrders,
} from "../controllers/staffOrderController.js";
// routes/staffRoutes.js
import express from "express";
import adminAuth from "../middleware/adminAuthMiddleware.js";
import staffAuth from "../middleware/staffAuth.js";
import upload from "../middleware/uploadMiddleware.js";
// ... imports

const router = express.Router();

// // CHANGE: Use adminAuth for creating staff
router.post("/admin-create", adminAuth(), staffSignup);

// Login
router.post("/login", staffLogin);
router.post("/forgot-password", staffForgotPassword);
router.post("/verify-reset-otp", verifyStaffResetOTP);
router.post("/reset-password", resetStaffPassword);

// Staff self-service (These are correct for the staff member themselves)
router.get("/profile", staffAuth(), getStaffProfile);
router.put("/profile", staffAuth(), upload.single("image"), updateStaffProfile);
router.put("/change-password", staffAuth(), changeStaffPassword);
router.get("/orders", staffAuth(), getStaffOrders);
router.put("/orders/:orderId/accept", staffAuth(), acceptStaffOrder);

// --- ADMIN MANAGEMENT ROUTES ---

// CHANGE: Ensure get-staff uses adminAuth so it accepts the adminToken
router.get("/get-staff", adminAuth(), getAllStaff);

// This looks correct, but ensure adminAuth doesn't need parentheses like adminAuth()
router.put("/admin-update/:staff_id", adminAuth(), adminUpdateStaff);

// Ensure deleteStaff uses the same pattern
router.delete("/:staff_id", adminAuth(), deleteStaff);

export default router;
