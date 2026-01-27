import express from "express";
import { getAdminProfile } from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

// 🔒 Protected route
router.get("/profile", adminAuth(), getAdminProfile);

export default router;
