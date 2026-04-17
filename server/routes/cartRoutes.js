import express from "express";
import {
    addToCart,
    clearCart,
    getCartByUser,
    removeFromCart,
    updateCartItem,
} from "../controllers/cartController.js";

import { authMiddleware, verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, addToCart);
router.get("/", verifyToken, getCartByUser);
router.put("/:id", verifyToken, updateCartItem);
router.delete("/clear", authMiddleware, clearCart);
router.delete("/:id", verifyToken, removeFromCart);

export default router;
