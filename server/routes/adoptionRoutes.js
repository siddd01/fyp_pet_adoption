import express from "express";
import { createAdoptionApplication, getAllAdoptionApplications, updateAdoptionStatus } from "../controllers/adoptionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/apply", authMiddleware, createAdoptionApplication);
router.get("/", getAllAdoptionApplications);

// PATCH status of a single application
router.put("/:id/status", updateAdoptionStatus);

export default router;
