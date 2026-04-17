import axios from "axios";
import db from "../config/db.js";

export const handleCheckout = async (req, res) => {
    const { cartItems, totalAmount, shippingInfo } = req.body;
    
    console.log("Starting Checkout for User:", req.user.id);
    // 1. Basic Validation
    if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: "User authentication failed" });
    }

    if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const userId = req.user.id;
    // Calculate 2% charity contribution
    const donationAmount = (Number(totalAmount) * 0.02).toFixed(2);
    
    // Get a single connection from the pool for the Transaction
    const connection = await db.getConnection();

    try {
        // START TRANSACTION: If anything fails after this, nothing is saved to DB
        await connection.beginTransaction();

        // 2. Insert into Orders Table
        const [orderResult] = await connection.execute(
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
                "pending", // Initial status
            ]
        );

        const orderId = orderResult.insertId;

        // 3. Save individual Order Items
        for (const item of cartItems) {
            // Support different naming conventions for IDs
            const productId = item.product_id || item.id || item._id;

            await connection.execute(
                `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) 
                 VALUES (?, ?, ?, ?)`,
                [orderId, productId, item.quantity, item.price]
            );
        }

        // 4. Khalti Payment Initiation
        // Using the Live URL since you have a Live Key
        
        const KHALTI_URL = "https://a.khalti.com/api/v2/epayment/initiate/";
        
       const khaltiPayload = {
  return_url: `${process.env.FRONTEND_URL}/payment/verify`,
  website_url: process.env.FRONTEND_URL,
  amount: Math.round(Number(totalAmount) * 100),
  purchase_order_id: orderId.toString(),
  purchase_order_name: `Order #${orderId}`,
  customer_info: {
    name: shippingInfo?.full_name || "Guest User",
    email: shippingInfo?.email || "test@test.com",
    phone: shippingInfo?.phone || "9800000000",
  },
};
        console.log("Sending Khalti Request:", khaltiPayload);
        const khaltiResponse = await axios.post(KHALTI_URL, khaltiPayload, {
            headers: {
                "Authorization": `Key ${process.env.KHALTI_SECRET_KEY}`, // Ensure this is the FULL key
                "Content-Type": "application/json",
            },
        });
        console.log("Khalti Response:", khaltiResponse.data);

        // 5. Save the pidx from Khalti to our order
        const pidx = khaltiResponse.data.pidx;
        await connection.execute(
            "UPDATE orders SET pidx = ? WHERE id = ?",
            [pidx, orderId]
        );

        // COMMIT: Everything worked, save changes to database permanently
        await connection.commit();

        res.status(200).json({
            success: true,
            payment_url: khaltiResponse.data.payment_url,
        });

    } catch (error) {
        // ROLLBACK: If anything failed, undo all database changes
        await connection.rollback();
        
        console.error("Khalti Checkout Error FULL:", error);
        console.error("Khalti Response:", error.response?.data);

        res.status(500).json({
            success: false,
            message: "Checkout failed",
            // Send back the specific error from Khalti if available
            error: error.response?.data?.detail || error.message,
        });
    } finally {
        // Release the connection back to the pool
        connection.release();
    }
};