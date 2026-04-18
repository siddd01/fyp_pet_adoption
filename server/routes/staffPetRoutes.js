import express from "express";
import { deletePet } from "../controllers/staffPetController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.delete("/:id", authMiddleware, deletePet);

export default router;
