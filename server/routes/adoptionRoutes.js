import express from "express";
import { createAdoptionApplication, getAllAdoptions, getUserNotifications, updateAdoptionStatus } from "../controllers/adoptionController.js";
import { authMiddleware, verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/apply", authMiddleware, createAdoptionApplication);
router.get("/", authMiddleware, getAllAdoptions);
router.put("/:id/status", authMiddleware, updateAdoptionStatus);
router.get("/notifications", verifyToken, getUserNotifications);

export default router;
