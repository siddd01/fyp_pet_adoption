import axios from "axios";
import db from "../config/db.js";

const mapKhaltiStatusToOrderStatus = (status) => {
  const normalized = String(status || "").trim().toLowerCase();

  if (normalized === "completed") return "completed";
  if (normalized === "refunded") return "refunded";

  if (
    normalized.includes("expired") ||
    normalized.includes("cancel") ||
    normalized.includes("failed") ||
    normalized.includes("rejected")
  ) {
    return "failed";
  }

  return "pending";
};

export const verifyPayment = async (req, res) => {
  const { pidx } = req.body;

  if (!pidx) {
    return res.status(400).json({
      success: false,
      message: "Missing pidx",
    });
  }

  try {
    const [orders] = await db.execute(
      "SELECT id, user_id, status FROM orders WHERE pidx = ? LIMIT 1",
      [pidx]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found for this payment",
      });
    }

    const order = orders[0];

    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;
    console.log("Khalti Verify Response:", data);
    const nextStatus = mapKhaltiStatusToOrderStatus(data.status);

    if (nextStatus === "completed") {
      const connection = await db.getConnection();

      try {
        await connection.beginTransaction();

        await connection.execute(
          "UPDATE orders SET status = ?, transaction_id = COALESCE(?, transaction_id) WHERE id = ?",
          [nextStatus, data.transaction_id || data.transactionId || null, order.id]
        );

        await connection.execute(
          "DELETE FROM cart_items WHERE user_id = ?",
          [order.user_id]
        );

        await connection.commit();
      } catch (dbError) {
        await connection.rollback();
        throw dbError;
      } finally {
        connection.release();
      }

      return res.json({
        success: true,
        message: "Payment verified successfully",
        cartCleared: true,
        orderStatus: nextStatus,
      });
    }

    if (nextStatus !== order.status) {
      await db.execute(
        "UPDATE orders SET status = ?, transaction_id = COALESCE(?, transaction_id) WHERE id = ?",
        [nextStatus, data.transaction_id || data.transactionId || null, order.id]
      );
    }

    return res.json({
      success: false,
      pending: nextStatus === "pending",
      orderStatus: nextStatus,
      message:
        nextStatus === "pending"
          ? `Payment is still processing. Current status: ${data.status}`
          : `Payment not completed. Status: ${data.status}`,
    });
  } catch (error) {
    console.error("Verify Error:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
};
