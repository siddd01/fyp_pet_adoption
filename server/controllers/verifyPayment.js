import axios from "axios";
import db from "../config/db.js";

export const verifyPayment = async (req, res) => {
  const { pidx } = req.body;

  if (!pidx) {
    return res.status(400).json({
      success: false,
      message: "Missing pidx",
    });
  }

  try {
    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`, // ✅ IMPORTANT
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;
    console.log("Khalti Verify Response:", data);

    // ✅ THIS IS THE MOST IMPORTANT FIX
    if (data.status === "Completed") {
      await db.execute(
        "UPDATE orders SET status = ? WHERE pidx = ?",
        ["paid", pidx]
      );

      return res.json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      return res.json({
        success: false,
        message: `Payment not completed. Status: ${data.status}`,
      });
    }
  } catch (error) {
    console.error(
      "Verify Error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
};