import db from "../config/db.js";

/**
 * ADD TO CART
 * POST /api/cart
 */
export const addToCart = async (req, res) => {
  try {
    const user_id = req.user.id; // ✅ from JWT middleware
    const { product_id, quantity = 1, price } = req.body;

    const query = `
      INSERT INTO cart_items (user_id, product_id, quantity, price)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        quantity = quantity + VALUES(quantity),
        price = VALUES(price)
    `;

    await db.execute(query, [
      user_id,
      product_id,
      quantity,
      price,
    ]);

    res.status(201).json({ message: "Item added to cart" });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
};

/**
 * GET USER CART
 * GET /api/cart
 */
export const getCartByUser = async (req, res) => {
  try {
    const user_id = req.user.id; // ✅ from JWT

    const [rows] = await db.execute(
      `
      SELECT 
        c.id,
        c.product_id,
        p.name,
        p.image_url,
        c.quantity,
        c.price,
        (c.quantity * c.price) AS total_price
      FROM cart_items c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
      `,
      [user_id]
    );

    res.json(rows);
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

/**
 * UPDATE CART ITEM QUANTITY
 * PUT /api/cart/:id
 */
export const updateCartItem = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    await db.execute(
      "UPDATE cart_items SET quantity = ? WHERE id = ?",
      [quantity, id]
    );

    res.json({ message: "Cart updated" });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({ error: "Failed to update cart" });
  }
};

/**
 * REMOVE ITEM FROM CART
 * DELETE /api/cart/:id
 */
export const removeFromCart = async (req, res) => {
  const { id } = req.params;

  try {
    await db.execute("DELETE FROM cart_items WHERE id = ?", [id]);
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Remove cart error:", error);
    res.status(500).json({ error: "Failed to remove item" });
  }
};
