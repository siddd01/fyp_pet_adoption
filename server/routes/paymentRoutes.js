import express from 'express';
import { handleCheckout } from '../controllers/paymentController.js';
import { verifyPayment } from '../controllers/verifyPayment.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Initiate Khalti Checkout
router.post('/checkout', authMiddleware, handleCheckout);

// // Verify Khalti Payment (after redirect)
router.post('/verify', verifyPayment);

export default router;