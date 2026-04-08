import express from "express";
import { addPet, deletePet, getAllPets, updatePet } from "../controllers/petController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getAllPets);
router.post("/", upload.single("image"), addPet);
router.put("/:id", upload.single("image"), updatePet); // New
router.delete("/:id", deletePet); // New
export default router;
