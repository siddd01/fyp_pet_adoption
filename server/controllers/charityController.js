import axios from "axios";
import db from "../config/db.js";

let communityTablesReady = false;
const KHALTI_BASE_URL = process.env.KHALTI_BASE_URL || "https://dev.khalti.com";
const khaltiHeaders = {
  Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
  "Content-Type": "application/json",
};
const ensureCommunityTables = async () => {
  if (communityTablesReady) return;

  await db.query(`
    CREATE TABLE IF NOT EXISTS post_likes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      post_id INT NOT NULL,
      user_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES charity_posts(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY unique_post_user_like (post_id, user_id)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS post_comments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      post_id INT NOT NULL,
      user_id INT NOT NULL,
      comment_text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES charity_posts(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS admin_notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      admin_id INT NOT NULL,
      type ENUM('like', 'comment') NOT NULL,
      message TEXT NOT NULL,
      post_id INT NOT NULL,
      user_id INT NOT NULL,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (admin_id) REFERENCES admins(admin_id) ON DELETE CASCADE,
      FOREIGN KEY (post_id) REFERENCES charity_posts(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  communityTablesReady = true;
};

// Helper function to create admin notifications
const createAdminNotification = async (type, postId, userId) => {
  try {
    // Get post details and admin who created it
    const [postDetails] = await db.query(
      "SELECT admin_id, title FROM charity_posts WHERE id = ?",
      [postId]
    );
    
    if (postDetails.length === 0) return;
    
    // Get user details
    const [userDetails] = await db.query(
      "SELECT first_name, last_name FROM users WHERE id = ?",
      [userId]
    );
    
    if (userDetails.length === 0) return;
    
    const userName = `${userDetails[0].first_name} ${userDetails[0].last_name}`.trim();
    const postTitle = postDetails[0].title;
    
    let message = "";
    if (type === "like") {
      message = `${userName} liked your post "${postTitle}"`;
    } else if (type === "comment") {
      message = `${userName} commented on your post "${postTitle}"`;
    }
    
    // Insert notification for the admin who created the post
    await db.query(
      "INSERT INTO admin_notifications (admin_id, type, message, post_id, user_id) VALUES (?, ?, ?, ?, ?)",
      [postDetails[0].admin_id, type, message, postId, userId]
    );
    
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
};

// POST /api/charity/donate
export const initiateDonation = async (req, res) => {
  const { amount, message } = req.body;

  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ success: false, message: "Invalid donation amount" });
  }

  const userId = req.user?.id;

  try {
    // Fetch name + email from DB using the JWT id
    // Inside initiateDonation
// Ensure your SELECT matches your table columns
const [rows] = await db.execute(
  "SELECT first_name, last_name, email FROM users WHERE id = ?",
  [userId]
);

if (rows.length === 0) {
  return res.status(404).json({ success: false, message: "User not found" });
}

// Check what your DB actually returns
console.log("User data from DB:", rows[0]); 

// Use whatever column name exists in your DB (e.g., rows[0].username or rows[0].full_name)
const donorName = [rows[0]?.first_name, rows[0]?.last_name]
  .filter(Boolean) // Removes undefined or empty strings
  .join(" ") || "Anonymous Donor";
const donorEmail = rows[0].email || null;

    // Insert donation record first (so we always have a DB row even if Khalti fails)
    const [result] = await db.execute(
      `INSERT INTO donations
         (user_id, amount, currency, donor_name, donor_email, message, status)
       VALUES (?, ?, 'NPR', ?, ?, ?, 'pending')`,
      [userId, Number(amount), donorName, donorEmail, message?.trim() || null]
    );

    const donationId = result.insertId;

    // Initiate Khalti payment
    const khaltiRes = await axios.post(
      `${KHALTI_BASE_URL}/api/v2/epayment/initiate/`,
      {
        return_url: `${process.env.FRONTEND_URL}/donation/verify`,
        website_url: process.env.FRONTEND_URL,
        amount: Math.round(Number(amount) * 100),
        purchase_order_id: `DON-${donationId}`,
        purchase_order_name: `Sano Ghar Donation #${donationId}`,
      },
      { headers: khaltiHeaders }
    );

    // Save pidx
    await db.execute(
      "UPDATE donations SET pidx = ? WHERE id = ?",
      [khaltiRes.data.pidx, donationId]
    );

    return res.status(200).json({ success: true, payment_url: khaltiRes.data.payment_url });

  } catch (err) {
    const khaltiError = err.response?.data;
    console.error("Donation initiation error:", khaltiError ?? err.message);
    if (err.response?.status === 401) {
      return res.status(500).json({
        success: false,
        message: "Khalti authentication failed. Please check KHALTI_SECRET_KEY and environment (dev/live).",
        detail: khaltiError?.detail || "Invalid token",
      });
    }
    return res.status(500).json({
      success: false,
      message: khaltiError?.detail || "Donation initiation failed",
    });
  }
};

// POST /api/charity/verify
export const verifyDonation = async (req, res) => {
  const { pidx } = req.body;

  if (!pidx) {
    return res.status(400).json({ success: false, message: "pidx is required" });
  }

  try {
    const khaltiRes = await axios.post(
      `${KHALTI_BASE_URL}/api/v2/epayment/lookup/`,
      { pidx },
      { headers: khaltiHeaders }
    );

    if (khaltiRes.data.status === "Completed") {
      await db.execute("UPDATE donations SET status = 'Completed' WHERE pidx = ?", [pidx]);
      return res.json({ success: true });
    }

    return res.json({ success: false, message: `Payment status: ${khaltiRes.data.status}` });

  } catch (err) {
    const khaltiError = err.response?.data;
    console.error("Donation verify error:", khaltiError ?? err.message);
    return res.status(500).json({
      success: false,
      message: khaltiError?.detail || "Verification failed",
    });
  }
};


export const createCharityPost = async (req, res) => {
  try {
    console.log("🔥 Controller hit");

    const { title, amount, content } = req.body;
    const admin_id = req.admin.admin_id;

    const image_url = req.file?.path || null;

    const sql = `
      INSERT INTO charity_posts (admin_id, title, content, image_url, amount_spent)
      VALUES (?, ?, ?, ?, ?)
    `;

    await db.query(sql, [admin_id, title, content, image_url, amount]);

    res.status(201).json({ success: true, message: "Impact Post Published!" });
  } catch (error) {
    console.error("Post Creation Error:", error);
    res.status(500).json({ message: "Failed to log expenditure" });
  }
};
export const getCharityHistory = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, title, amount_spent, image_url, created_at 
       FROM charity_posts 
       ORDER BY created_at DESC`
    );
    // Ensure you return an object with a success key if your frontend expects it
    res.json({ success: true, posts: rows }); 
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch history" });
  }
};
export const getCharityPosts = async (req, res) => {
  try {
    await ensureCommunityTables();
    const userId = req.user?.id || null;

    const [rows] = await db.query(
      `SELECT
          cp.id,
          cp.title,
          cp.content,
          cp.image_url,
          cp.amount_spent,
          cp.created_at,
          a.full_name AS admin_name,
          (SELECT COUNT(*) FROM post_likes WHERE post_id = cp.id) AS like_count,
          (SELECT COUNT(*) FROM post_comments WHERE post_id = cp.id) AS comment_count,
          IFNULL((SELECT 1 FROM post_likes WHERE post_id = cp.id AND user_id = ? LIMIT 1), 0) AS liked_by_me
       FROM charity_posts cp
       LEFT JOIN admins a ON a.admin_id = cp.admin_id
       ORDER BY cp.created_at DESC`
    );

    res.json({ success: true, posts: rows });
  } catch (error) {
    console.error("Failed to fetch charity posts:", error);
    res.status(500).json({ success: false, message: "Failed to fetch posts" });
  }
};
// POST /api/charity/posts/:postId/like
export const togglePostLike = async (req, res) => {
  try {
    await ensureCommunityTables();
    const userId = req.user?.id;
    const postId = Number(req.params.postId);

    if (!Number.isInteger(postId)) {
      return res.status(400).json({ success: false, message: "Invalid post id" });
    }

    const [existingLike] = await db.query(
      "SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?",
      [postId, userId]
    );

    let liked = false;
    if (existingLike.length > 0) {
      await db.query("DELETE FROM post_likes WHERE post_id = ? AND user_id = ?", [postId, userId]);
      liked = false;
    } else {
      await db.query("INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)", [postId, userId]);
      liked = true;
      // Create notification for admin
      await createAdminNotification("like", postId, userId);
    }

    const [countRows] = await db.query("SELECT COUNT(*) AS like_count FROM post_likes WHERE post_id = ?", [postId]);

    res.json({
      success: true,
      liked,
      like_count: countRows[0].like_count,
    });
  } catch (error) {
    console.error("Failed to toggle like:", error);
    res.status(500).json({ success: false, message: "Failed to toggle like" });
  }
};

// GET /api/charity/posts/:postId/comments
export const getPostComments = async (req, res) => {
  try {
    await ensureCommunityTables();
    const postId = Number(req.params.postId);
    if (!Number.isInteger(postId)) {
      return res.status(400).json({ success: false, message: "Invalid post id" });
    }

    const [comments] = await db.query(
      `SELECT
         pc.id,
         pc.post_id,
         pc.user_id,
         pc.comment_text,
         pc.created_at,
         u.first_name,
         u.last_name,
         u.profile_image
       FROM post_comments pc
       JOIN users u ON u.id = pc.user_id
       WHERE pc.post_id = ?
       ORDER BY pc.created_at DESC`,
      [postId]
    );

    res.json({ success: true, comments });
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    res.status(500).json({ success: false, message: "Failed to fetch comments" });
  }
};

// POST /api/charity/posts/:postId/comments
export const createPostComment = async (req, res) => {
  try {
    await ensureCommunityTables();
    const userId = req.user?.id;
    const postId = Number(req.params.postId);
    const { comment_text } = req.body;

    if (!Number.isInteger(postId)) {
      return res.status(400).json({ success: false, message: "Invalid post id" });
    }

    if (!comment_text || !comment_text.trim()) {
      return res.status(400).json({ success: false, message: "Comment cannot be empty" });
    }

    await db.query(
      "INSERT INTO post_comments (post_id, user_id, comment_text) VALUES (?, ?, ?)",
      [postId, userId, comment_text.trim()]
    );

    // Create notification for admin
    await createAdminNotification("comment", postId, userId);

    res.status(201).json({ success: true, message: "Comment added" });
  } catch (error) {
    console.error("Failed to create comment:", error);
    res.status(500).json({ success: false, message: "Failed to add comment" });
  }
};

// PUT /api/charity/posts/:postId - Update post
export const updateCharityPost = async (req, res) => {
  try {
    const postId = Number(req.params.postId);
    const { title, content, amount_spent, image_url } = req.body;

    if (!Number.isInteger(postId)) {
      return res.status(400).json({ success: false, message: "Invalid post id" });
    }

    // Check if post exists
    const [existingPost] = await db.query(
      "SELECT id FROM charity_posts WHERE id = ?",
      [postId]
    );

    if (existingPost.length === 0) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    await db.query(
      "UPDATE charity_posts SET title = ?, content = ?, amount_spent = ?, image_url = ? WHERE id = ?",
      [title, content, amount_spent, image_url || null, postId]
    );

    res.json({ success: true, message: "Post updated successfully" });
  } catch (error) {
    console.error("Failed to update post:", error);
    res.status(500).json({ success: false, message: "Failed to update post" });
  }
};

// DELETE /api/charity/posts/:postId - Delete post
export const deleteCharityPost = async (req, res) => {
try {
const postId = Number(req.params.postId);

if (!Number.isInteger(postId)) {
  return res.status(400).json({ success: false, message: "Invalid post id" });
}

// Check if post exists
const [existingPost] = await db.query(
  "SELECT id FROM charity_posts WHERE id = ?",
  [postId]
);

if (existingPost.length === 0) {
  return res.status(404).json({ success: false, message: "Post not found" });
}

await db.query("DELETE FROM charity_posts WHERE id = ?", [postId]);
res.json({ success: true, message: "Post deleted successfully" });
} catch (error) {
console.error("Failed to delete post:", error);
res.status(500).json({ success: false, message: "Failed to delete post" });
}
};

// GET /api/admin/notifications - Get admin notifications
export const getAdminNotifications = async (req, res) => {
  try {
    await ensureCommunityTables();
    const adminId = req.admin.admin_id;

    const [notifications] = await db.query(
      `SELECT 
         an.id,
         an.type,
         an.message,
         an.post_id,
         an.is_read,
         an.created_at,
         cp.title as post_title,
         u.first_name,
         u.last_name
       FROM admin_notifications an
       LEFT JOIN charity_posts cp ON cp.id = an.post_id
       LEFT JOIN users u ON u.id = an.user_id
       WHERE an.admin_id = ?
       ORDER BY an.created_at DESC
       LIMIT 50`,
      [adminId]
    );

    res.json({ success: true, notifications });
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    res.status(500).json({ success: false, message: "Failed to fetch notifications" });
  }
};

// PUT /api/admin/notifications/:notificationId/read - Mark notification as read
export const markNotificationRead = async (req, res) => {
  try {
    await ensureCommunityTables();
    const notificationId = Number(req.params.notificationId);
    const adminId = req.admin.admin_id;

    if (!Number.isInteger(notificationId)) {
      return res.status(400).json({ success: false, message: "Invalid notification id" });
    }

    await db.query(
      "UPDATE admin_notifications SET is_read = TRUE WHERE id = ? AND admin_id = ?",
      [notificationId, adminId]
    );

    res.json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    res.status(500).json({ success: false, message: "Failed to update notification" });
  }
};