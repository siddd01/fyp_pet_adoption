import express from "express";
import {
  deleteOwnAccount,
  getLoggedInUser,
  getUserOrderHistory,
  updateUserProfile,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/profile", verifyToken, getLoggedInUser);
router.get("/history", verifyToken, getUserOrderHistory);

router.put(
  "/profile",
  verifyToken,
  upload.single("image"),
  updateUserProfile
);

router.delete("/delete-account", verifyToken, deleteOwnAccount);

export default router;
