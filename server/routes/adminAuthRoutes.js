import express from "express";
import {
    adminForgotPassword,
    adminLogin,
    adminRegister,
    resetAdminPassword,
    verifyAdminResetOTP,
} from "../controllers/adminAuthController.js";

const router = express.Router();

// ✅ NO middleware here
router.post("/register", adminRegister);
router.post("/login", adminLogin);
router.post("/forgot-password", adminForgotPassword);
router.post("/verify-reset-otp", verifyAdminResetOTP);
router.post("/reset-password", resetAdminPassword);

export default router;
