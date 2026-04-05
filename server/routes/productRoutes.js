import express from "express";
import { addProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../controllers/productController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", upload.single("image"), addProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
// productRouter.js


router.put("/:id", upload.single("image"), updateProduct); // Handle multipart for images
router.delete("/:id", deleteProduct);

export default router;
