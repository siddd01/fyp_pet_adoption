import express from "express";
import {
    forgotPassword,
    login,
    resetPassword,
    signup
} from "../controllers/authController.js";

const router = express.Router();

// Auth Routes
router.post("/signup", signup);
router.post("/login", login);

// Password Reset Routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Export router (MUST be last)
export default router;
