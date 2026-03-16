import express from "express";
import { createAdoptionApplication } from "../controllers/adoptionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/apply", authMiddleware, createAdoptionApplication);

export default router;
