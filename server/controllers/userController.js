import db from "../config/db.js";


// controllers/userController.js
export const getUserProfile = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const [rows] = await db.execute(
      `
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.date_of_birth,
        u.gender,
        u.profile_image AS image,
        r.name AS role,
        u.is_verified,
        u.created_at
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
      `,
      [userId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { first_name, last_name, date_of_birth, gender } = req.body;

    if (!first_name || !last_name) {
      return res.status(400).json({
        message: "First name and last name are required",
      });
    }

    const imageUrl = req.file?.path || null;

    let query = `
      UPDATE users
      SET first_name = ?, 
          last_name = ?, 
          date_of_birth = ?, 
          gender = ?
    `;

    const values = [
      first_name,
      last_name,
      date_of_birth || null,
      gender || null,
    ];

    if (imageUrl) {
      query += `, profile_image = ?`;
      values.push(imageUrl);
    }

    query += ` WHERE id = ?`;
    values.push(userId);

    await db.execute(query, values);

    // return UPDATED user (same format as getUserProfile)
    const [rows] = await db.execute(
      `
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.date_of_birth,
        u.gender,
        u.profile_image AS image,
        r.name AS role,
        u.is_verified,
        u.created_at
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
      `,
      [userId]
    );

    res.json(rows[0]);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};



