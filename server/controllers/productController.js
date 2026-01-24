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

export const getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM products ORDER BY created_at DESC");
    res.json(rows);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute("SELECT * FROM products WHERE id = ?", [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};
