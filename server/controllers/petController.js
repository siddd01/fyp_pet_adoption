import db from "../config/db.js";

// Get all pets
export const getAllPets = async (req, res) => {
  try {
    const [pets] = await db.query(
      "SELECT * FROM pets ORDER BY created_at DESC"
    );
    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pets" });
  }
};

// Add pet
export const addPet = async (req, res) => {
  try {
    const {
      name,
      age,
      breed,
      species,
      gender,
      health_status,
      behaviour,
      description,
      previous_owner_status,
    } = req.body;

    const image_url = req.file ? req.file.path : null;

    const sql = `
      INSERT INTO pets
      (name, age, breed, species, gender, health_status, behaviour, description, previous_owner_status, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(sql, [
      name,
      age,
      breed,
      species,
      gender,
      health_status,
      behaviour,
      description,
      previous_owner_status || "No",
      image_url
    ]);

    res.status(201).json({ message: "Pet added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add pet" });
  }
};

export const deletePet = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM pets WHERE id = ?", [id]);
    return res.json({ message: "🗑️ Pet deleted successfully." });

  } catch (error) {
    // 🔥 FK BLOCK — CUSTOM MESSAGE
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(400).json({
        message: "❌ This pet already has an adoption application and cannot be deleted."
      });
    }

    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
};
