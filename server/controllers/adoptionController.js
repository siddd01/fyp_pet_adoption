import db from "../config/db.js";
import sendEmail from "../utils/sendEmail.js";

export const updateAdoptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const [applications] = await db.execute(
      `
      SELECT
        aa.id,
        aa.user_id,
        aa.status AS current_status,
        aa.full_name,
        u.email,
        p.name AS pet_name
      FROM adoption_applications aa
      JOIN users u ON u.id = aa.user_id
      JOIN pets p ON p.id = aa.pet_id
      WHERE aa.id = ?
      LIMIT 1
      `,
      [id]
    );

    if (applications.length === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    const application = applications[0];

    const [result] = await db.execute(
      "UPDATE adoption_applications SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    const readableStatus = status === "approved" ? "approved" : "rejected";
    const notificationMessage =
      status === "approved"
        ? `Your adoption request for ${application.pet_name} has been approved.`
        : `Your adoption request for ${application.pet_name} has been rejected.`;

    await db.execute(
      "INSERT INTO user_notifications (user_id, type, message, related_id, created_at) VALUES (?, 'adoption', ?, ?, NOW())",
      [application.user_id, notificationMessage, id]
    );

    if (application.email) {
      const userName = application.full_name || "there";

      await sendEmail({
        to: application.email,
        subject: `Your adoption request has been ${readableStatus}`,
        text:
          status === "approved"
            ? `Hello ${userName}, your adoption request for ${application.pet_name} has been approved by Sano Ghar. Please log in to your account for the next steps.`
            : `Hello ${userName}, your adoption request for ${application.pet_name} has been rejected by Sano Ghar. You can log in to your account to review your application and explore other pets.`,
        html:
          status === "approved"
            ? `
              <div style="font-family: Arial, sans-serif; color: #1c1917; line-height: 1.6;">
                <h2 style="margin-bottom: 12px;">Adoption Request Approved</h2>
                <p>Hello ${userName},</p>
                <p>Your adoption request for <strong>${application.pet_name}</strong> has been approved by Sano Ghar.</p>
                <p>Please log in to your account to review the next steps.</p>
                <p style="margin-top: 20px;">Thank you for supporting pet adoption.</p>
              </div>
            `
            : `
              <div style="font-family: Arial, sans-serif; color: #1c1917; line-height: 1.6;">
                <h2 style="margin-bottom: 12px;">Adoption Request Rejected</h2>
                <p>Hello ${userName},</p>
                <p>Your adoption request for <strong>${application.pet_name}</strong> has been rejected by Sano Ghar.</p>
                <p>You can log in to your account to review your application and explore other pets that may be a good match.</p>
                <p style="margin-top: 20px;">Thank you for caring for rescued animals.</p>
              </div>
            `,
      });
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
    const userId = req.user.id;

    // Check if application exists and belongs to the user
    const [app] = await db.query(
      "SELECT status, user_id FROM adoption_applications WHERE id = ?",
      [id]
    );

    if (!app.length) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if application belongs to the authenticated user
    if (app[0].user_id !== userId) {
      return res.status(403).json({ message: "You can only delete your own applications" });
    }

    // Only allow deletion of pending applications
    if (app[0].status.toLowerCase() !== "pending") {
      return res.status(400).json({
        message: "Only pending applications can be deleted",
      });
    }

    await db.query("DELETE FROM adoption_applications WHERE id = ?", [id]);

    res.status(200).json({ message: "Application deleted successfully" });

  } catch (error) {
    console.error("Delete application error:", error);
    res.status(500).json({ message: "Delete failed" });
  }
};
