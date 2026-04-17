import express from "express";
import {
  createCharityPost,
  createPostComment,
  getCharityPosts,
  getPostComments,
  initiateDonation,
  togglePostLike,
  verifyDonation,
  updateCharityPost,
  deleteCharityPost,
  getAdminNotifications,
  markNotificationRead,
} from "../controllers/charityController.js";
import adminAuth from "../middleware/adminAuthMiddleware.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/donate", verifyToken, initiateDonation);  // POST /api/charity/donate
router.post("/verify", verifyDonation);                  // POST /api/charity/verify
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

router.get("/posts", verifyToken, getCharityPosts);
router.post("/posts", adminAuth(), createCharityPost);  // Create post (alternative to /spend)
router.put("/posts/:postId", adminAuth(), updateCharityPost);
router.delete("/posts/:postId", adminAuth(), deleteCharityPost);
router.post("/posts/:postId/like", verifyToken, togglePostLike);
router.get("/posts/:postId/comments", verifyToken, getPostComments);
router.post("/posts/:postId/comments", verifyToken, createPostComment);

// Admin notification routes
router.get("/admin/notifications", adminAuth(), getAdminNotifications);
router.put("/admin/notifications/:notificationId/read", adminAuth(), markNotificationRead);

export default router;