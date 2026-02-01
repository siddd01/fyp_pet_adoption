import db from "../config/db.js";
export const createAdoptionApplication = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      pet_id,
      full_name,
      age,
      job,
      phone,
      experience_with_pets,
      reason_for_adoption
    } = req.body;

    if (!pet_id || !full_name || !age) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const petId = Number(pet_id);
    if (!Number.isInteger(petId)) {
      return res.status(400).json({ message: "Invalid pet ID" });
    }

    // 🔍 Ensure pet exists
    const [pet] = await db.query(
      "SELECT id FROM pets WHERE id = ?",
      [petId]
    );

    if (pet.length === 0) {
      return res.status(400).json({ message: "Pet does not exist" });
    }

    await db.execute(
      `INSERT INTO adoption_applications
      (user_id, pet_id, full_name, age, job, phone, experience_with_pets, reason_for_adoption)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        petId,
        full_name,
        age,
        job,
        phone,
        experience_with_pets,
        reason_for_adoption
      ]
    );

    res.status(201).json({
      success: true,
      message: "Adoption application submitted"
    });

  } catch (error) {
    console.error("Adoption error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// GET all adoption applications
export const getAllAdoptionApplications = async (req, res) => {
  try {
    console.log("in server application")
    const [applications] = await db.query(
      `SELECT a.id, a.user_id, a.pet_id, a.full_name, a.age, a.job, a.phone,
              a.experience_with_pets, a.reason_for_adoption, a.status, a.created_at,
              p.name AS pet_name
       FROM adoption_applications a
       JOIN pets p ON a.pet_id = p.id
       ORDER BY a.created_at DESC`
    );

    res.json({ success: true, applications });
  } catch (error) {
    console.error("Error fetching adoption applications:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE adoption application status (approve/reject)
export const updateAdoptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const [result] = await db.query(
      `UPDATE adoption_applications SET status = ? WHERE id = ?`,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ success: true, message: `Application ${status}` });
  } catch (error) {
    console.error("Error updating adoption status:", error);
    res.status(500).json({ message: "Server error" });
  }
};
