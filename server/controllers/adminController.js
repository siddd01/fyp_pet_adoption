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
