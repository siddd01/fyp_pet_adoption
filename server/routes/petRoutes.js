import express from "express";
import { addPet, getAllPets } from "../controllers/petController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Get all pets
router.get("/", getAllPets);

// Add pet (Cloudinary + Multer works here)
router.post("/", upload.single("image"), addPet);

export default router;
