import { deleteStaff, staffLogin, staffSignup, getStaffProfile, updateStaffProfile } from "../controllers/staffController.js";
// routes/staffRoutes.js
import express from "express";
import staffAuth from "../middleware/staffAuth.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();
router.post("/admin-create", staffAuth(["ADMIN"]), staffSignup);

// Login
router.post("/login", staffLogin);

// Get Staff Profile
router.get("/profile", staffAuth(), getStaffProfile);

// Update Staff Profile
router.put("/profile", staffAuth(), upload.single("image"), updateStaffProfile);

// Delete staff (ADMIN only)
router.delete("/:staff_id", staffAuth(["ADMIN"]), deleteStaff);

export default router;
