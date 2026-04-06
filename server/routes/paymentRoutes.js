import express from 'express';
import { handleCheckout, verifyPayment } from '../controllers/paymentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Initiate Khalti Checkout
router.post('/checkout', authMiddleware, handleCheckout);

// Verify Khalti Payment (after redirect)
router.post('/verify', authMiddleware, verifyPayment);

export default router;