import express from "express";
import {
    addToCart,
    getCartByUser,
    removeFromCart,
    updateCartItem,
} from "../controllers/cartController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, addToCart);
router.get("/", verifyToken, getCartByUser);
router.put("/:id", verifyToken, updateCartItem);
router.delete("/:id", verifyToken, removeFromCart);

export default router;
