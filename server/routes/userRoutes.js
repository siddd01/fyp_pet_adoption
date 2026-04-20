import express from "express";
import {
  getLoggedInUser,
  getUserOrderHistory,
  updateUserProfile,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
const router = express.Router();

// GET /api/user/profile
router.get("/profile", verifyToken, getLoggedInUser);

// GET /api/user/history
router.get("/history", verifyToken, getUserOrderHistory);

// PUT /api/user/profile - Update user profile
router.put(
  "/profile",
  verifyToken,
  upload.single("image"), // 👈 THIS IS THE KEY LINE
  updateUserProfile
);


export default router;  
