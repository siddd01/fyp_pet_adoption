import db from "../config/db.js";

export const addProduct = async (req, res) => {
  try {
    const { name, description, category, price, stock, quantity } = req.body;

    const imageUrl = req.file ? req.file.path : null;

    const sql = `
      INSERT INTO products 
      (name, description, category, price, stock, quantity, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await db.execute(sql, [
      name,
      description,
      category,
      price,
      stock || 0,
      quantity || 0,
      imageUrl,
    ]);

    res.status(201).json({
      message: "Product added successfully",
      image_url: imageUrl,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
