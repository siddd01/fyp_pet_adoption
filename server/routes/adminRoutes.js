import express from "express";
import { confirmAdminPassword, getAdminProfile } from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

// 🔒 Protected route
router.get("/profile", adminAuth, getAdminProfile);
router.post("/confirm-password", adminAuth, confirmAdminPassword);

export default router;