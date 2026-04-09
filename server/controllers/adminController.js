import bcrypt from "bcryptjs";
import db from "../config/db.js";
export const getAdminProfile = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT admin_id, full_name, email, role, profile_image, cover_image
       FROM admins WHERE admin_id = ?`,
      [req.admin.admin_id]
    );

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

export const confirmAdminPassword = async (req, res) => {
  console.log("🔥 CONFIRM PASSWORD API HIT");
  try {
    const { password } = req.body;
    
    // DEBUG: See what the middleware is actually giving you
    console.log("Admin Data from Middleware:", req.admin || req.staff || req.user);

    // Use whichever key your middleware is using (likely req.admin based on your profile code)
    const admin_id = req.admin?.admin_id ;

    if (!admin_id) {
      return res.status(401).json({ message: "Admin ID missing from request" });
    }

    const [rows] = await db.query(
      "SELECT password FROM admins WHERE admin_id = ?",
      [admin_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Admin not found in database" });
    }

    const isValid = await bcrypt.compare(password, rows[0].password);
    
    // Always return a response!
    return res.json({ valid: isValid });
    
  } catch (error) {
    console.error("Controller Error:", error);
    return res.status(500).json({ message: "Internal server error during verification" });
  }
};

// Change Admin Password
export const changeAdminPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const admin_id = req.admin.admin_id;

  try {
    // 1. Get current password from DB
    const [rows] = await db.query("SELECT password FROM admins WHERE admin_id = ?", [admin_id]);
    
    // 2. Verify old password
    const isMatch = await bcrypt.compare(oldPassword, rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // 3. Hash new password and update
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    await db.query("UPDATE admins SET password = ? WHERE admin_id = ?", [hashedNewPassword, admin_id]);

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error during password update" });
  }
};
export const updateAdminProfile = async (req, res) => {
  const admin_id = req.admin.admin_id;
  const { full_name } = req.body;

  try {
    console.log("in process of update profile")
    // 1. Capture the Cloudinary URLs if files were uploaded
    const profile_image = req.files?.profile_image ? req.files.profile_image[0].path : null;
    const cover_image = req.files?.cover_image ? req.files.cover_image[0].path : null;

    // 2. Build the dynamic SQL query
    let updates = ["full_name = ?"];
    let params = [full_name];

    if (profile_image) {
      updates.push("profile_image = ?");
      params.push(profile_image);
    }
    if (cover_image) {
      updates.push("cover_image = ?");
      params.push(cover_image);
    }

    params.push(admin_id);
    const sql = `UPDATE admins SET ${updates.join(", ")} WHERE admin_id = ?`;

    await db.query(sql, params);

    // 3. Return the fresh data so the frontend updates instantly
    const [rows] = await db.query(
      "SELECT admin_id, full_name, email, role, profile_image, cover_image FROM admins WHERE admin_id = ?",
      [admin_id]
    );

    res.json({ message: "Profile updated successfully", admin: rows[0] });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};