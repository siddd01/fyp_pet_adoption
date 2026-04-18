import db from "../config/db.js";

export const updateAdoptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const [result] = await db.execute(
      "UPDATE adoption_applications SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({
      success: true,
      message: `Application ${status}`,
    });
  } catch (error) {
    console.error("❌ Status update error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllAdoptions = async (req, res) => {
  try {
    // Join with pets table to get pet details
    const [rows] = await db.execute(`
      SELECT 
        aa.*, 
        p.name AS pet_name, 
        p.image_url AS pet_image,
        p.species,
        p.breed
      FROM adoption_applications aa
      JOIN pets p ON aa.pet_id = p.id
      ORDER BY aa.created_at DESC
    `);

    res.status(200).json({
      success: true,
      applications: rows,
    });
  } catch (error) {
    console.error("❌ Fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createAdoptionApplication = async (req, res) => {
  try {
    // ✅ Check user from middleware
    if (!req.user) {
      console.log("❌ No user found in request");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;

    console.log("👤 REQ.USER:", req.user);
    console.log("📦 REQ.BODY:", req.body);

    const {
      pet_id,
      full_name,
      age,
      job,
      phone,
      experience_with_pets,
      reason_for_adoption,
    } = req.body;

  
    if (
      !pet_id ||
      !full_name ||
      !age ||
      !job ||
      !phone ||
      !experience_with_pets ||
      !reason_for_adoption
    ) {
      console.log("❌ Missing fields:", {
        pet_id,
        full_name,
        age,
        job,
        phone,
        experience_with_pets,
        reason_for_adoption,
      });

      return res.status(400).json({
        message: "All fields are required",
      });
    }

    console.log("🚀 Inserting into database...");

    const [result] = await db.execute(
      `INSERT INTO adoption_applications
      (user_id, pet_id, full_name, age, job, phone, experience_with_pets, reason_for_adoption)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        pet_id,
        full_name,
        age,
        job,
        phone,
        experience_with_pets,
        reason_for_adoption,
      ]
    );

    console.log("✅ Insert Success:", result);

    res.status(201).json({
      success: true,
      message: "Adoption application submitted",
      data: {
        id: result.insertId,
        user_id: userId,
        pet_id,
      },
    });
  } catch (error) {
    console.error("❌ Adoption error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message, // helpful for debugging
    });
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;

    const [rows] = await db.execute(`
      SELECT 
        aa.*,
        p.name AS pet_name,
        p.image_url
      FROM adoption_applications aa
      JOIN pets p ON aa.pet_id = p.id
      WHERE aa.user_id = ?
      ORDER BY aa.created_at DESC
    `, [userId]);

    res.json({
      success: true,
      notifications: rows,
    });

  } catch (error) {
    console.error("❌ Notification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const updateAdoptionApplication = async (req, res) => {
  try {
    const { id } = req.params; // Application ID
    const userId = req.user.id;
    const { job, phone, experience_with_pets, reason_for_adoption } = req.body;

    // Check if application exists and belongs to user and is still PENDING
    const [rows] = await db.execute(
      "SELECT status FROM adoption_applications WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Application not found" });
    if (rows[0].status !== 'pending') return res.status(400).json({ message: "Cannot edit a processed application" });

    await db.execute(
      `UPDATE adoption_applications 
       SET job = ?, phone = ?, experience_with_pets = ?, reason_for_adoption = ? 
       WHERE id = ? AND user_id = ?`,
      [job, phone, experience_with_pets, reason_for_adoption, id, userId]
    );

    // Create notification for user about status change
    const notificationMessage = `Your adoption application for pet ID ${id} has been updated.`;
    
    await db.execute(
      "INSERT INTO user_notifications (user_id, type, message, related_id, created_at) VALUES (?, 'adoption', ?, ?, NOW())",
      [userId, notificationMessage, id]
    );

    res.json({ success: true, message: "Application updated successfully" });
  } catch (error) {
    console.error("❌ Update error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const [app] = await db.query(
      "SELECT status FROM adoption_applications WHERE id = ?",
      [id]
    );

    if (!app.length) {
      return res.status(404).json({ message: "Application not found" });
    }

    // 🔴 ONLY allow if rejected
    if (app[0].status !== "rejected") {
      return res.status(400).json({
        message: "Only rejected applications can be deleted",
      });
    }

    await db.query("DELETE FROM adoption_applications WHERE id = ?", [id]);

    res.status(200).json({ message: "Application deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};