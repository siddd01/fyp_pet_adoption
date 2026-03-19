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
    const [rows] = await db.execute(`
      SELECT * FROM adoption_applications ORDER BY created_at DESC
    `);

    res.status(200).json({
      success: true,
      applications: rows,
    });
  } catch (error) {
    console.error("❌ Fetch error:", error);
    res.status(500).json({
      message: "Server error",
    });
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