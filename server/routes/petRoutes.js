import express from "express";
import { addPet, deletePet, getAllPets } from "../controllers/petController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Get all pets
router.get("/", getAllPets);

// Add pet
router.post("/", upload.single("image"), addPet);


// Delete pet
router.delete("/:id", deletePet);

export default router;
