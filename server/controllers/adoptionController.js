import db from "../config/db.js";

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

    // ✅ Validate ALL required fields (matching frontend)
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