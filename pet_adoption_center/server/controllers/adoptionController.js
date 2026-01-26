import db from "../config/db.js";

export const createAdoptionApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("REQ.USER:", req.user);
console.log("REQ.BODY:", req.body);

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

    await db.execute(
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
