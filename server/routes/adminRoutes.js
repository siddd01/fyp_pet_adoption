import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import {
  changeAdminPassword,
  confirmAdminPassword,
  donateStoreCharity,
  getAdminProfile,
  getCharityInflowStats,
  getRecentDonations,
  getStoreAnalysis,
  getStoreAnalytics,
  updateAdminProfile,
} from "../controllers/adminController.js";
import {
  adminDeleteUserAccount,
  getAllUsersForAdmin,
  sendManualUserNotification,
} from "../controllers/userController.js";
import adminAuth from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "sano_ghar_admins",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

router.get("/profile", adminAuth(), getAdminProfile);
router.post("/confirm-password", adminAuth(), confirmAdminPassword);
router.put("/change-password", adminAuth(), changeAdminPassword);

router.get("/inflow-stats", adminAuth(), getCharityInflowStats);
router.get("/recent-donations", adminAuth(), getRecentDonations);
router.get("/users", adminAuth(), getAllUsersForAdmin);
router.delete("/users/:userId", adminAuth(), adminDeleteUserAccount);
router.post("/users/:userId/notify", adminAuth(), sendManualUserNotification);
router.get("/store-analysis", adminAuth(), getStoreAnalysis);
router.post("/donate-store-charity", adminAuth(), donateStoreCharity);
router.get("/store-analytics", adminAuth(), getStoreAnalytics);

router.put(
  "/update-profile",
  adminAuth(),
  upload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "cover_image", maxCount: 1 },
  ]),
  updateAdminProfile
);

export default router;
