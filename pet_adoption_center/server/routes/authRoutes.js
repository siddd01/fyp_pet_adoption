import express from "express";
import {
    forgotPassword,
    login,
    resendOTP,
    resetPassword,
    signup,
    verifyOTP
} from "../controllers/authController.js";

const router = express.Router();

// Auth routes
router.post("/signup", signup);
router.post("/login", login);

// OTP routes
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);

// Password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
