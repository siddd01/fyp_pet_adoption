import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
const router = express.Router();

// GET /api/user/profile
router.get("/profile", verifyToken, getUserProfile);

// PUT /api/user/profile - Update user profile
router.put(
  "/profile",
  verifyToken,
  upload.single("image"), // 👈 THIS IS THE KEY LINE
  updateUserProfile
);


export default router;  