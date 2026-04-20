import db from "../config/db.js";
import sendEmail from "../utils/sendEmail.js";

const sendAdoptionStatusEmail = async ({ to, userName, petName, status }) => {
  if (!to) return;

  const readableStatus = status === "approved" ? "approved" : "rejected";

  await sendEmail({
    to,
    subject: `Your adoption request has been ${readableStatus}`,
    text:
      status === "approved"
        ? `Hello ${userName}, your adoption request for ${petName} has been approved by Sano Ghar. Please log in to your account for the next steps.`
        : `Hello ${userName}, your adoption request for ${petName} has been rejected by Sano Ghar. You can log in to your account to review your application and explore other pets.`,
    html:
      status === "approved"
        ? `
          <div style="font-family: Arial, sans-serif; color: #1c1917; line-height: 1.6;">
            <h2 style="margin-bottom: 12px;">Adoption Request Approved</h2>
            <p>Hello ${userName},</p>
            <p>Your adoption request for <strong>${petName}</strong> has been approved by Sano Ghar.</p>
            <p>Please log in to your account to review the next steps.</p>
            <p style="margin-top: 20px;">Thank you for supporting pet adoption.</p>
          </div>
        `
        : `
          <div style="font-family: Arial, sans-serif; color: #1c1917; line-height: 1.6;">
            <h2 style="margin-bottom: 12px;">Adoption Request Rejected</h2>
            <p>Hello ${userName},</p>
            <p>Your adoption request for <strong>${petName}</strong> has been rejected by Sano Ghar.</p>
            <p>You can log in to your account to review your application and explore other pets that may be a good match.</p>
            <p style="margin-top: 20px;">Thank you for caring for rescued animals.</p>
          </div>
        `,
  });
};

export const updateAdoptionStatus = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    await connection.beginTransaction();

    const [applications] = await connection.execute(
      `
      SELECT
        aa.id,
        aa.user_id,
        aa.pet_id,
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
      await connection.rollback();
      return res.status(404).json({ message: "Application not found" });
    }

    const application = applications[0];

    if (application.current_status === "approved" && status === "approved") {
      await connection.rollback();
      return res.status(400).json({ message: "Application is already approved" });
    }

    if (status === "approved") {
      const [approvedForPet] = await connection.execute(
        `
        SELECT id
        FROM adoption_applications
        WHERE pet_id = ? AND status = 'approved' AND id <> ?
        LIMIT 1
        `,
        [application.pet_id, id]
      );

      if (approvedForPet.length > 0) {
        await connection.rollback();
        return res.status(400).json({ message: "This pet already has an approved adoption application" });
      }
    }

    const [result] = await connection.execute(
      "UPDATE adoption_applications SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Application not found" });
    }

    const notificationMessage =
      status === "approved"
        ? `Your adoption request for ${application.pet_name} has been approved.`
        : `Your adoption request for ${application.pet_name} has been rejected.`;

    await connection.execute(
      "INSERT INTO user_notifications (user_id, type, message, related_id, created_at) VALUES (?, 'adoption', ?, ?, NOW())",
      [application.user_id, notificationMessage, id]
    );

    let autoRejectedCount = 0;
    let autoRejectedApplications = [];

    if (status === "approved") {
      const [pendingOthers] = await connection.execute(
        `
        SELECT
          aa.id,
          aa.user_id,
          aa.full_name,
          aa.status,
          u.email
        FROM adoption_applications aa
        JOIN users u ON u.id = aa.user_id
        WHERE aa.pet_id = ? AND aa.id <> ? AND aa.status NOT IN ('approved', 'rejected')
        `,
        [application.pet_id, id]
      );

      if (pendingOthers.length > 0) {
        autoRejectedApplications = pendingOthers;
        autoRejectedCount = pendingOthers.length;

        await connection.execute(
          `
          UPDATE adoption_applications
          SET status = 'rejected'
          WHERE pet_id = ? AND id <> ? AND status NOT IN ('approved', 'rejected')
          `,
          [application.pet_id, id]
        );

        for (const rejectedApp of pendingOthers) {
          await connection.execute(
            "INSERT INTO user_notifications (user_id, type, message, related_id, created_at) VALUES (?, 'adoption', ?, ?, NOW())",
            [
              rejectedApp.user_id,
              `Your adoption request for ${application.pet_name} has been rejected because another application for this pet was approved.`,
              rejectedApp.id,
            ]
          );
        }
      }
    }

    await connection.commit();

    await Promise.allSettled([
      sendAdoptionStatusEmail({
        to: application.email,
        userName: application.full_name || "there",
        petName: application.pet_name,
        status,
      }),
      ...autoRejectedApplications.map((rejectedApp) =>
        sendAdoptionStatusEmail({
          to: rejectedApp.email,
          userName: rejectedApp.full_name || "there",
          petName: application.pet_name,
          status: "rejected",
        })
      ),
    ]);

    res.json({
      success: true,
      message:
        status === "approved" && autoRejectedCount > 0
          ? `Application approved. ${autoRejectedCount} other pending application(s) for this pet were automatically rejected.`
          : `Application ${status}`,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Status update error:", error);
    res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
};

export const getAllAdoptions = async (req, res) => {
  try {
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
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createAdoptionApplication = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
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
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const [existingApplications] = await db.execute(
      `
      SELECT id, status
      FROM adoption_applications
      WHERE user_id = ? AND pet_id = ?
      LIMIT 1
      `,
      [userId, pet_id]
    );

    if (existingApplications.length > 0) {
      const existingStatus = existingApplications[0].status;
      return res.status(409).json({
        message: `You have already submitted an adoption request for this pet${existingStatus ? ` (${existingStatus})` : ""}.`,
      });
    }

    const [result] = await db.execute(
      `INSERT INTO adoption_applications
      (user_id, pet_id, full_name, age, job, phone, experience_with_pets, reason_for_adoption, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        pet_id,
        full_name,
        age,
        job,
        phone,
        experience_with_pets,
        reason_for_adoption,
        "pending",
      ]
    );

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
    console.error("Adoption error:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "You have already submitted an adoption request for this pet.",
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;

    const [rows] = await db.execute(
      `
      SELECT 
        aa.*,
        p.name AS pet_name,
        p.image_url
      FROM adoption_applications aa
      JOIN pets p ON aa.pet_id = p.id
      WHERE aa.user_id = ?
      ORDER BY aa.created_at DESC
    `,
      [userId]
    );

    res.json({
      success: true,
      notifications: rows,
    });
  } catch (error) {
    console.error("Notification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateAdoptionApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { job, phone, experience_with_pets, reason_for_adoption } = req.body;

    const [rows] = await db.execute(
      "SELECT status FROM adoption_applications WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Application not found" });
    if (rows[0].status !== "pending") return res.status(400).json({ message: "Cannot edit a processed application" });

    await db.execute(
      `UPDATE adoption_applications 
       SET job = ?, phone = ?, experience_with_pets = ?, reason_for_adoption = ? 
       WHERE id = ? AND user_id = ?`,
      [job, phone, experience_with_pets, reason_for_adoption, id, userId]
    );

    const notificationMessage = `Your adoption application for pet ID ${id} has been updated.`;

    await db.execute(
      "INSERT INTO user_notifications (user_id, type, message, related_id, created_at) VALUES (?, 'adoption', ?, ?, NOW())",
      [userId, notificationMessage, id]
    );

    res.json({ success: true, message: "Application updated successfully" });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [app] = await db.query(
      "SELECT status, user_id FROM adoption_applications WHERE id = ?",
      [id]
    );

    if (!app.length) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (app[0].user_id !== userId) {
      return res.status(403).json({ message: "You can only delete your own applications" });
    }

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
