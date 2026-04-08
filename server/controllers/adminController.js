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
const isMatch = await bcrypt.compare(adminPassword, adminRows[0].password);
console.log("👉 bcrypt result:", isMatch);
    const isValid = await bcrypt.compare(password, rows[0].password);
    
    // Always return a response!
    return res.json({ valid: isValid });
    
  } catch (error) {
    console.error("Controller Error:", error);
    return res.status(500).json({ message: "Internal server error during verification" });
  }
};

