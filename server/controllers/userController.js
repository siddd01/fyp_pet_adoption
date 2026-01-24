import db from "../config/db.js";

// Get currently logged-in user's profile
export const getLoggedInUser = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Use profile_image instead of image
    const [rows] = await db.execute(
      `SELECT 
        u.id, 
        u.first_name, 
        u.last_name, 
        u.email, 
        u.role_id,
        r.name as role,
        u.date_of_birth, 
        u.gender, 
        u.profile_image as image,
        u.is_verified, 
        u.created_at 
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching logged-in user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { first_name, last_name, date_of_birth, gender, image } = req.body;

    // Validate input
    if (!first_name || !last_name) {
      return res.status(400).json({ message: "First name and last name are required" });
    }

    // Update using profile_image column
    await db.execute(
      `UPDATE users 
       SET first_name = ?, last_name = ?, date_of_birth = ?, gender = ?, profile_image = ?
       WHERE id = ?`,
      [first_name, last_name, date_of_birth || null, gender || null, image || null, userId]
    );

    // Fetch updated user data
    const [rows] = await db.execute(
      `SELECT 
        u.id, 
        u.first_name, 
        u.last_name, 
        u.email, 
        u.role_id,
        r.name as role,
        u.date_of_birth, 
        u.gender, 
        u.profile_image as image,
        u.is_verified, 
        u.created_at 
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};