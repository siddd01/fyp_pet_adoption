import { deleteStaff, staffLogin, staffSignup } from "../controllers/staffController.js";
// routes/staffRoutes.js
import express from "express";
import staffAuth from "../middleware/staffAuth.js";

const router = express.Router();
router.post("/admin-create", staffAuth(["ADMIN"]), staffSignup);


// Login
router.post("/login", staffLogin);

// Delete staff (MANAGER only)
router.delete("/:staff_id", staffAuth(["ADMIN"]), deleteStaff);

export default router;
