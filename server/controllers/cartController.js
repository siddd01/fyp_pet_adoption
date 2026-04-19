import db from "../config/db.js";

/**
 * ADD TO CART
 * POST /api/cart
 */
export const addToCart = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { product_id, quantity = 1, price } = req.body;
    const normalizedQuantity = Number(quantity);

    if (!Number.isInteger(normalizedQuantity) || normalizedQuantity < 1) {
      return res.status(400).json({ error: "Invalid quantity" });
    }

    const [products] = await db.execute(
      "SELECT stock FROM products WHERE id = ? LIMIT 1",
      [product_id]
    );

    if (products.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const availableStock = Number(products[0].stock || 0);
    if (normalizedQuantity > availableStock) {
      return res.status(400).json({ error: "Requested quantity exceeds stock" });
    }

    const [existingCartItems] = await db.execute(
      "SELECT quantity FROM cart_items WHERE user_id = ? AND product_id = ? LIMIT 1",
      [user_id, product_id]
    );

    const existingQuantity = Number(existingCartItems[0]?.quantity || 0);
    if (existingQuantity + normalizedQuantity > availableStock) {
      return res.status(400).json({ error: "Cart quantity exceeds stock" });
    }

    const query = `
      INSERT INTO cart_items (user_id, product_id, quantity, price)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        quantity = quantity + VALUES(quantity),
        price = VALUES(price)
    `;

    await db.execute(query, [user_id, product_id, normalizedQuantity, price]);

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
    const user_id = req.user.id;

    const [rows] = await db.execute(
      `
      SELECT 
        c.id,
        c.product_id,
        p.name,
        p.image_url,
        p.stock,
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
  const userId = req.user.id;
  const normalizedQuantity = Number(quantity);

  if (!Number.isInteger(normalizedQuantity) || normalizedQuantity < 1) {
    return res.status(400).json({ error: "Invalid quantity" });
  }

  try {
    const [cartItems] = await db.execute(
      `SELECT c.id, c.product_id, p.stock
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.id = ? AND c.user_id = ?`,
      [id, userId]
    );

    if (cartItems.length === 0) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    if (normalizedQuantity > Number(cartItems[0].stock || 0)) {
      return res.status(400).json({ error: "Requested quantity exceeds stock" });
    }

    await db.execute(
      "UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?",
      [normalizedQuantity, id, userId]
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
  const userId = req.user.id;

  try {
    const [result] = await db.execute(
      "DELETE FROM cart_items WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    res.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Remove cart error:", error);
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Clearing cart for user ID:", userId);

    const [existingItems] = await db.execute(
      "SELECT COUNT(*) as count FROM cart_items WHERE user_id = ?",
      [userId]
    );
    console.log("Items before deletion:", existingItems[0].count);

    const result = await db.execute(
      "DELETE FROM cart_items WHERE user_id = ?",
      [userId]
    );
    console.log("Delete result:", result);

    const [remainingItems] = await db.execute(
      "SELECT COUNT(*) as count FROM cart_items WHERE user_id = ?",
      [userId]
    );
    console.log("Items after deletion:", remainingItems[0].count);

    res.json({ success: true, message: "Cart cleared" });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ success: false });
  }
};
