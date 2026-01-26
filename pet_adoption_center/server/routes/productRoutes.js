import express from "express";
import { addProduct, getAllProducts, getProductById } from "../controllers/productController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", upload.single("image"), addProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);

export default router;
