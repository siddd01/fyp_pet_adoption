import express from "express";
import {
    adminLogin,
    adminRegister,
} from "../controllers/adminAuthController.js";
import adminAuth from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

// SUPER_ADMIN creates admins
router.post("/register", adminAuth(["SUPER_ADMIN"]), adminRegister);

// Admin login
router.post("/login", adminLogin);

export default router;
