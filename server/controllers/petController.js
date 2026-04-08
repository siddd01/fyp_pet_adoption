import db from "../config/db.js";

// Get all pets
export const getAllPets = async (req, res) => {
  try {
    const [pets] = await db.query(`
      SELECT *
      FROM pets p
      WHERE NOT EXISTS (
        SELECT 1
        FROM adoption_applications a
        WHERE a.pet_id = p.id
        AND a.status = 'approved'
      )
      ORDER BY p.created_at DESC
    `);

    res.status(200).json(pets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch pets" });
  }
};
export const addPet = async (req, res) => {
  try {
    // 1. Log the body to see what arrived
    console.log("Request Body:", req.body);
    console.log("File:", req.file);

    const {
      name, age, breed, species, gender,
      health_status, behaviour, description, previous_owner_status
    } = req.body;

    // Use a fallback for the image_url
    const image_url = req.file ? req.file.path : null;

    const sql = `
      INSERT INTO pets 
      (name, age, breed, species, gender, health_status, behaviour, description, previous_owner_status, image_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Ensure all variables match the SQL placeholders (10 total)
    const values = [
      name || "Unknown",
      age || 0,
      breed || "Unknown",
      species || "Unknown", // If this is missing in the DB schema, it will 500
      gender || "Male",
      health_status || "Healthy",
      behaviour || "Friendly",
      description || "",
      previous_owner_status || "No",
      image_url
    ];

    const [result] = await db.query(sql, values);
    res.status(201).json({ message: "Pet added successfully", id: result.insertId });
    
  } catch (error) {
    // 2. This log will tell you EXACTLY why it failed (SQL syntax, column name, etc.)
    console.error("DATABASE ERROR:", error);
    res.status(500).json({ 
      message: "Backend error", 
      details: error.message // Sending the error message helps debugging
    });
  }
};
// controllers/petController.js

// Update Pet
export const updatePet = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, breed, species, gender, health_status, behaviour, description, previous_owner_status } = req.body;
    
    // If a new image is uploaded, use it, otherwise keep the old one (logic usually handled by frontend or hidden input)
    let sql = `
      UPDATE pets 
      SET name=?, age=?, breed=?, species=?, gender=?, health_status=?, behaviour=?, description=?, previous_owner_status=?
    `;
    const params = [name, age, breed, species, gender, health_status, behaviour, description, previous_owner_status];

    if (req.file) {
      sql += `, image_url=?`;
      params.push(req.file.path);
    }

    sql += ` WHERE id=?`;
    params.push(id);

    await db.query(sql, params);
    res.status(200).json({ message: "Pet updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update pet" });
  }
};

// Delete Pet
export const deletePet = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM pets WHERE id = ?", [id]);
    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete pet" });
  }
};