import express from "express";
import { addProduct } from "../controllers/productController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", upload.single("image"), addProduct);

export default router;
