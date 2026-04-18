import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js"; // Path to your cloudinary file
import { changeAdminPassword, confirmAdminPassword, getAdminProfile, getCharityInflowStats, getRecentDonations, getStoreAnalysis, donateStoreCharity, getStoreAnalytics, updateAdminProfile } from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

// 🛠️ Setup Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "sano_ghar_admins", // The folder name in your Cloudinary dashboard
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

// 🔒 Routes
router.get("/profile", adminAuth(), getAdminProfile);
router.post("/confirm-password", adminAuth(), confirmAdminPassword);
router.put("/change-password", adminAuth(), changeAdminPassword);

// 📸 The Edit Route (Accepts 1 profile image and 1 cover image)

router.get('/inflow-stats',adminAuth(), getCharityInflowStats);

router.get('/recent-donations', adminAuth(), getRecentDonations);

router.get('/store-analysis', adminAuth(), getStoreAnalysis);

router.post('/donate-store-charity', adminAuth(), donateStoreCharity);

router.get('/store-analytics', adminAuth(), getStoreAnalytics);

router.put(
  "/update-profile",
  adminAuth(), 
  upload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "cover_image", maxCount: 1 }
  ]), 
  updateAdminProfile
);

export default router;