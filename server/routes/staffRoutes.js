import { deleteStaff, getAllStaff, getStaffProfile, staffLogin, staffSignup, updateStaffProfile } from "../controllers/staffController.js";
// routes/staffRoutes.js
import express from "express";
import adminAuth from "../middleware/adminAuthMiddleware.js";
import staffAuth from "../middleware/staffAuth.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();
router.post("/admin-create", staffAuth(["ADMIN"]), staffSignup);

// Login
router.post("/login", staffLogin);

// Get Staff Profile
router.get("/profile", staffAuth(), getStaffProfile);
router.get("/get-staff",staffAuth(),getAllStaff);

// Update Staff Profile
router.put("/profile", staffAuth(), upload.single("image"), updateStaffProfile);

// Delete staff (ADMIN only)
router.delete("/:staff_id", adminAuth(), deleteStaff);

export default router;