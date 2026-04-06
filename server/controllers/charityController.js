import axios from "axios";
import db from "../config/db.js";

export const initiateDonation = async (req, res) => {
    const { amount, message, donorInfo } = req.body;
    const userId = req.user?.id || null;

    try {
        // 1. Record the pending donation
        const [result] = await db.execute(
            `INSERT INTO donations (user_id, amount, donor_name, donor_email, message, status) 
             VALUES (?, ?, ?, ?, ?, 'pending')`,
            [userId, amount, donorInfo.name, donorInfo.email, message]
        );
        
        const donationId = result.insertId;

        // 2. Initiate Khalti
        const khaltiResponse = await axios.post('https://a.khalti.com/api/v2/epayment/initiate/', {
            "return_url": `${process.env.FRONTEND_URL}/payment/verify`,
            "website_url": process.env.FRONTEND_URL,
            "amount": Math.round(Number(amount) * 100),
            "purchase_order_id": `DONATE_${donationId}`,
            "purchase_order_name": "Sano Ghar Charity Donation"
        }, {
            headers: { 'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}` }
        });

        // 3. Save pidx
        await db.execute('UPDATE donations SET pidx = ? WHERE id = ?', [khaltiResponse.data.pidx, donationId]);

        res.status(200).json({ payment_url: khaltiResponse.data.payment_url });
    } catch (error) {
        res.status(500).json({ message: "Donation initiation failed" });
    }
};