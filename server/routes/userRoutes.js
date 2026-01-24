import express from "express";
import { getLoggedInUser, updateUserProfile } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/user/profile
router.get("/profile", verifyToken, getLoggedInUser);

// PUT /api/user/profile - Update user profile
router.put("/profile", verifyToken, updateUserProfile);

export default router;