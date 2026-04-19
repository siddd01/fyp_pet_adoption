import express from "express";

import { createAdoptionApplication, deleteApplication, getAllAdoptions, getUserNotifications, updateAdoptionApplication, updateAdoptionStatus } from "../controllers/adoptionController.js";

import { authMiddleware, verifyToken } from "../middleware/authMiddleware.js";
import { verifyFlexibleToken } from "../middleware/flexibleAuthMiddleware.js";

    const router = express.Router();



    router.post("/apply", authMiddleware, createAdoptionApplication);

    router.get("/", verifyFlexibleToken, getAllAdoptions);

    router.put("/:id/status", verifyFlexibleToken, updateAdoptionStatus);

    router.put("/:id", authMiddleware, updateAdoptionApplication);

    router.get("/notifications", verifyToken, getUserNotifications);

    

router.delete("/:id", authMiddleware, deleteApplication);



    export default router;

