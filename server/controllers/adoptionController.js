import db from "../config/db.js";
import sendEmail from "../utils/sendEmail.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character] || character;
  });

const buildAdoptionEmailTemplate = ({ userName, petName, status }) => {
  const approved = status === "approved";
  const palette = approved
    ? {
        heroFrom: "#0f766e",
        heroTo: "#111827",
        chipBg: "rgba(255,255,255,0.14)",
        chipText: "#ccfbf1",
        cardBg: "#ecfdf5",
        cardBorder: "#a7f3d0",
        accent: "#047857",
        buttonBg: "#047857",
      }
    : {
        heroFrom: "#991b1b",
        heroTo: "#111827",
        chipBg: "rgba(255,255,255,0.14)",
        chipText: "#ffe4e6",
        cardBg: "#fff1f2",
        cardBorder: "#fecdd3",
        accent: "#be123c",
        buttonBg: "#111827",
      };

  const safeUserName = escapeHtml(userName || "there");
  const safePetName = escapeHtml(petName || "your chosen pet");
  const title = approved ? "Your adoption request is approved" : "Your adoption request was not approved this time";
  const subtitle = approved
    ? "A lovely next step is waiting for you. We have reviewed your request and the shelter team has moved it forward."
    : "Thank you for opening your home to a rescue pet. We wanted to update you clearly and kindly as soon as a decision was made.";
  const body = approved
    ? `Your request for <strong>${safePetName}</strong> has been approved by the Sano Ghar team. We are excited to help you move toward the final handoff steps.`
    : `Your request for <strong>${safePetName}</strong> was not approved for this round. That can happen for a few reasons, including fit, timing, or another application being completed first.`;
  const steps = approved
    ? [
        "Log in to your Sano Ghar account to review the latest adoption update.",
        "Keep your phone and email nearby in case the shelter team reaches out for final coordination.",
        "Bring any requested documents or information to the next step of the process.",
      ]
    : [
        "Log in to your Sano Ghar account to review the latest application update.",
        "Double-check your contact details and profile information before you apply again.",
        "Explore other pets in Sano Ghar that may be a beautiful fit for your home.",
      ];
  const ctaText = approved ? "Log In For Next Steps" : "Log In And Explore Pets";

  return `
    <div style="margin:0;padding:32px 16px;background:#f4efe6;font-family:Arial,Helvetica,sans-serif;color:#1c1917;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;">
        <tr>
          <td style="padding:0;">
            <div style="background:linear-gradient(135deg,${palette.heroFrom} 0%,${palette.heroTo} 100%);border-radius:28px 28px 0 0;padding:30px 32px;">
              <div style="display:inline-block;padding:8px 14px;border-radius:999px;background:${palette.chipBg};color:${palette.chipText};font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">
                Sano Ghar Adoption Desk
              </div>
              <h1 style="margin:20px 0 10px;font-size:30px;line-height:1.15;color:#ffffff;font-family:Georgia,'Times New Roman',serif;">
                ${title}
              </h1>
              <p style="margin:0;color:#e7e5e4;font-size:15px;line-height:1.7;">
                ${subtitle}
              </p>
            </div>

            <div style="background:#ffffff;border:1px solid #e7e5e4;border-top:none;border-radius:0 0 28px 28px;padding:32px;">
              <div style="margin:0 0 24px;padding:22px;border-radius:24px;background:${palette.cardBg};border:1px solid ${palette.cardBorder};">
                <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:${palette.accent};">
                  Pet Update
                </p>
                <p style="margin:0;font-size:30px;line-height:1.15;font-weight:700;color:#111827;font-family:Georgia,'Times New Roman',serif;">
                  ${safePetName}
                </p>
                <p style="margin:16px 0 0;font-size:14px;line-height:1.8;color:#57534e;">
                  Hello ${safeUserName}, ${body}
                </p>
              </div>

              <div style="margin:0 0 24px;padding:20px;border-radius:22px;background:#fafaf9;border:1px solid #e7e5e4;">
                <p style="margin:0 0 14px;font-size:12px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#57534e;">
                  What Happens Next
                </p>
                ${steps
                  .map(
                    (step, index) => `
                      <div style="margin:${index === 0 ? "0" : "12px"} 0 0;display:flex;gap:12px;align-items:flex-start;">
                        <div style="min-width:28px;height:28px;border-radius:999px;background:#f5f5f4;color:#111827;font-size:12px;font-weight:700;line-height:28px;text-align:center;">
                          ${index + 1}
                        </div>
                        <p style="margin:0;font-size:14px;line-height:1.7;color:#57534e;">
                          ${step}
                        </p>
                      </div>
                    `
                  )
                  .join("")}
              </div>

              <div style="text-align:center;margin:0 0 20px;">
                <a href="${FRONTEND_URL}/login" style="display:inline-block;padding:14px 24px;border-radius:999px;background:${palette.buttonBg};color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;">
                  ${ctaText}
                </a>
              </div>

              <p style="margin:0;font-size:12px;line-height:1.7;color:#a8a29e;text-align:center;">
                This update was sent by Sano Ghar so your adoption journey stays clear, timely, and easy to follow.
              </p>
            </div>
          </td>
        </tr>
      </table>
    </div>
  `;
};

const sendAdoptionStatusEmail = async ({ to, userName, petName, status }) => {
  if (!to) return;

  const readableStatus = status === "approved" ? "approved" : "rejected";
  const safePetName = petName || "your chosen pet";

  await sendEmail({
    to,
    subject: `Your adoption request has been ${readableStatus}`,
    text:
      status === "approved"
        ? `Hello ${userName}, your adoption request for ${safePetName} has been approved by Sano Ghar. Please log in to your account to review the next steps.`
        : `Hello ${userName}, your adoption request for ${safePetName} was not approved this time. Please log in to your account to review the update and explore other pets.`,
    html: buildAdoptionEmailTemplate({ userName, petName: safePetName, status }),
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
