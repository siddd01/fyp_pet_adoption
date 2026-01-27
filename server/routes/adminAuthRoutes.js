import express from "express";
import {
    adminLogin,
    adminRegister,
} from "../controllers/adminAuthController.js";

const router = express.Router();

// ✅ NO middleware here
router.post("/register", adminRegister);
router.post("/login", adminLogin);

export default router;
