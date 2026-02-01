import express from "express";
import { addProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../controllers/productController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
const router = express.Router();

router.post("/", upload.single("image"), addProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", authMiddleware, upload.single("image"), updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

export default router;
