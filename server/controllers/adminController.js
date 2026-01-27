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
  try {
    const { password } = req.body;
    const admin_id = req.admin.admin_id;

    // Get admin's hashed password
   // adminController.js
const [rows] = await db.query(
  "SELECT password FROM admins WHERE admin_id = ?",
  [admin_id]
);

const adminPasswordObj = rows[0]; // Make sure this is an object

if (!adminPasswordObj) return res.status(404).json({ message: "Admin not found" });

const isValid = await bcrypt.compare(password, adminPasswordObj.password);


    res.json({ valid: isValid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Password verification failed" });
  }
};
