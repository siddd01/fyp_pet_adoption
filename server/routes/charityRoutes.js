import express from "express";
import {
  createCharityPost,
  createPostComment,
  deletePostComment,
  deleteCharityPost,
  getAdminCharityPosts,
  getAdminNotifications,
  getCharityPosts,
  getPostComments,
  initiateDonation,
  markAllNotificationsRead,
  markNotificationRead,
  togglePostLike,
  updatePostComment,
  updateCharityPost,
  verifyDonation,
} from "../controllers/charityController.js";
import adminAuth from "../middleware/adminAuthMiddleware.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyFlexibleToken } from "../middleware/flexibleAuthMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// --- Public/General Donation Routes ---
router.post("/donate", verifyToken, initiateDonation);
router.post("/verify", verifyDonation);

router.post(
  "/spend",
  adminAuth(),
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

router.get("/posts", verifyFlexibleToken, getCharityPosts);
router.get("/admin/posts", adminAuth(), getAdminCharityPosts);
router.post("/posts", adminAuth(), createCharityPost);  // Create post (alternative to /spend)
router.put("/posts/:postId", adminAuth(), updateCharityPost);
router.delete("/posts/:postId", adminAuth(), deleteCharityPost);
router.post("/posts/:postId/like", verifyToken, togglePostLike);
router.get("/posts/:postId/comments", verifyFlexibleToken, getPostComments);
router.post("/posts/:postId/comments", verifyToken, createPostComment);
router.put("/posts/:postId/comments/:commentId", verifyToken, updatePostComment);
router.delete("/posts/:postId/comments/:commentId", verifyToken, deletePostComment);

// --- Admin Notifications ---
router.get("/admin/notifications", adminAuth(), getAdminNotifications);
router.put("/admin/notifications/:notificationId/read", adminAuth(), markNotificationRead);
router.put("/admin/notifications/read-all", adminAuth(), markAllNotificationsRead);

export default router;
