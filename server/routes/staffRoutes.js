import { adminUpdateStaff, deleteStaff, getAllStaff, getStaffProfile, staffLogin, staffSignup, updateStaffProfile } from "../controllers/staffController.js";
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

// Staff self-service (These are correct for the staff member themselves)
router.get("/profile", staffAuth(), getStaffProfile);
router.put("/profile", staffAuth(), upload.single("image"), updateStaffProfile);

// --- ADMIN MANAGEMENT ROUTES ---

// CHANGE: Ensure get-staff uses adminAuth so it accepts the adminToken
router.get("/get-staff", adminAuth(), getAllStaff);

// This looks correct, but ensure adminAuth doesn't need parentheses like adminAuth()
router.put("/admin-update/:staff_id", adminAuth(), adminUpdateStaff);

// Ensure deleteStaff uses the same pattern
router.delete("/:staff_id", adminAuth(), deleteStaff);

export default router;