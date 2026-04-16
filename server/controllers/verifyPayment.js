import axios from "axios";
import db from "../config/db.js";

export const verifyPayment = async (req, res) => {
  const { pidx } = req.body;

  try {
    // 1. Verify with Khalti
    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        },
      }
    );

    const paymentData = response.data;

    if (paymentData.status === "Completed") {
      // 2. Update order
      await db.execute(
        "UPDATE orders SET status = 'paid' WHERE pidx = ?",
        [pidx]
      );

      return res.json({ success: true });
    } else {
      return res.json({ success: false });
    }

  } catch (error) {
    console.error("Verify Error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
};