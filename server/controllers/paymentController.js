import db from "../config/db.js";
// Your database connection
import axios from "axios";

export const handleCheckout = async (req, res) => {
    const { cartItems, totalAmount, shippingInfo } = req.body;
    const userId = req.user.id;

    const donationAmount = (Number(totalAmount) * 0.02).toFixed(2);

    try {
        // 1. Start a Transaction in your DB
        // 2. Insert into 'orders' table (Status: pending)
        const [orderResult] = await db.execute(
            `INSERT INTO orders (user_id, total_amount, charity_amount, full_name, email, phone, shipping_address) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [userId, totalAmount, donationAmount, shippingInfo.full_name, shippingInfo.email, shippingInfo.phone, shippingInfo.address]
        );
        
        const orderId = orderResult.insertId;

        // 3. Insert items into 'order_items'
        for (const item of cartItems) {
            await db.execute(
                `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) 
                 VALUES (?, ?, ?, ?)`,
                [orderId, item.product_id, item.quantity, item.price]
            );
        }

        // 4. Initiate Khalti Payment
        const khaltiResponse = await axios.post('https://a.khalti.com/api/v2/epayment/initiate/', {
            "return_url": "http://localhost:3000/payment/verify",
            "website_url": "http://localhost:3000",
            "amount": Math.round(Number(totalAmount) * 100), // Rs to Paisa
            "purchase_order_id": orderId.toString(),
            "purchase_order_name": "Sano Ghar Order"
        }, {
            headers: { 'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}` }
        });

        // 5. Save the pidx to the order
        await db.execute('UPDATE orders SET pidx = ? WHERE id = ?', [khaltiResponse.data.pidx, orderId]);

        res.status(200).json({ payment_url: khaltiResponse.data.payment_url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Checkout failed" });
    }
};