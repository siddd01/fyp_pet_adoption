import express from "express";
import { createCharityPost, initiateDonation, verifyDonation } from "../controllers/charityController.js";
import adminAuth from "../middleware/adminAuthMiddleware.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/donate", verifyToken, initiateDonation);  // POST /api/charity/donate
router.post("/verify", verifyDonation);                  // POST /api/charity/verify
router.post(
  "/spend",
  adminAuth,
  (req, res, next) => {
    upload.single("image")(req, res, function (err) {
      if (err) {
        console.error("❌ Upload Error:", err.message);
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  },
  createCharityPost
);
export default router;