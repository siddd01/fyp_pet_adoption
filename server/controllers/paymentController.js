import axios from "axios";
import db from "../config/db.js";

export const handleCheckout = async (req, res) => {
  const { cartItems, totalAmount, shippingInfo } = req.body;

  if (!req.user || !req.user.id) {
    return res.status(401).json({
      success: false,
      message: "User authentication failed",
    });
  }

  const userId = req.user.id;
  const donationAmount = (Number(totalAmount) * 0.02).toFixed(2);

  try {
    // 1. Create Order
    const [orderResult] = await db.execute(
      `INSERT INTO orders
      (user_id, total_amount, charity_amount, full_name, email, phone, shipping_address, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        totalAmount,
        donationAmount,
        shippingInfo?.full_name || "Guest",
        shippingInfo?.email || null,
        shippingInfo?.phone || null,
        shippingInfo?.address || null,
        "pending",
      ]
    );

    const orderId = orderResult.insertId;

    // 2. Save order items
    for (const item of cartItems) {
      const productId = Number(item.product_id || item._id || item.pet_id);

      const [product] = await db.execute(
        "SELECT id FROM products WHERE id = ?",
        [productId]
      );

      if (product.length === 0) {
        throw new Error(`Product not found in DB: ${productId}`);
      }

      await db.execute(
        `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) 
         VALUES (?, ?, ?, ?)`,
        [orderId, productId, item.quantity, item.price]
      );
    }

    // 3. Khalti Payment Initiate
    const khaltiResponse = await axios.post(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      {
        return_url: `${process.env.FRONTEND_URL}/payment/verify`, // ✅ FIXED
        website_url: process.env.FRONTEND_URL,
        amount: Math.round(Number(totalAmount) * 100),
        purchase_order_id: orderId.toString(),
        purchase_order_name: `Order #${orderId}`,
      },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // 4. Save pidx
    await db.execute(
      "UPDATE orders SET pidx = ? WHERE id = ?",
      [khaltiResponse.data.pidx, orderId]
    );

    res.status(200).json({
      payment_url: khaltiResponse.data.payment_url,
    });

  } catch (error) {
    console.error("Checkout Error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Checkout failed",
      error: error.message,
    });
  }
};