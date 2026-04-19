import express from 'express';
import { handleCheckout } from '../controllers/paymentController.js';
import { verifyPayment, verifyPaymentReturn } from '../controllers/verifyPayment.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Initiate Khalti Checkout
router.post('/checkout', authMiddleware, handleCheckout);

// Verify Khalti Payment from frontend
router.post('/verify', verifyPayment);
router.get('/verify-return', verifyPaymentReturn);

export default router;
