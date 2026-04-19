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

const verifyPaymentAndUpdateOrder = async (pidx) => {
  const [orders] = await db.execute(
    "SELECT id, user_id, status FROM orders WHERE pidx = ? LIMIT 1",
    [pidx]
  );

  if (orders.length === 0) {
    return {
      httpStatus: 404,
      body: {
        success: false,
        message: "Order not found for this payment",
      },
    };
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

      const [lockedOrders] = await connection.execute(
        "SELECT id, user_id, status FROM orders WHERE id = ? FOR UPDATE",
        [order.id]
      );

      if (lockedOrders.length === 0) {
        throw new Error("Order disappeared during verification");
      }

      const lockedOrder = lockedOrders[0];

      await connection.execute(
        "UPDATE orders SET status = ?, transaction_id = COALESCE(?, transaction_id) WHERE id = ?",
        [nextStatus, data.transaction_id || data.transactionId || null, lockedOrder.id]
      );

      await connection.execute(
        "DELETE FROM cart_items WHERE user_id = ?",
        [lockedOrder.user_id]
      );

      await connection.commit();
    } catch (dbError) {
      await connection.rollback();
      throw dbError;
    } finally {
      connection.release();
    }

    return {
      httpStatus: 200,
      body: {
        success: true,
        message: "Payment verified successfully",
        cartCleared: true,
        orderStatus: nextStatus,
      },
    };
  }

  if (
    order.status === "pending" &&
    (nextStatus === "failed" || nextStatus === "refunded")
  ) {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const [lockedOrders] = await connection.execute(
        "SELECT id, status FROM orders WHERE id = ? FOR UPDATE",
        [order.id]
      );

      if (lockedOrders.length === 0) {
        throw new Error("Order disappeared during verification");
      }

      const lockedOrder = lockedOrders[0];

      if (lockedOrder.status === "pending") {
        const [orderItems] = await connection.execute(
          "SELECT product_id, quantity FROM order_items WHERE order_id = ?",
          [lockedOrder.id]
        );

        for (const item of orderItems) {
          await connection.execute(
            "UPDATE products SET stock = stock + ? WHERE id = ?",
            [Number(item.quantity), item.product_id]
          );
        }
      }

      await connection.execute(
        "UPDATE orders SET status = ?, transaction_id = COALESCE(?, transaction_id) WHERE id = ?",
        [nextStatus, data.transaction_id || data.transactionId || null, lockedOrder.id]
      );

      await connection.commit();
    } catch (dbError) {
      await connection.rollback();
      throw dbError;
    } finally {
      connection.release();
    }

    return {
      httpStatus: 200,
      body: {
        success: false,
        pending: false,
        orderStatus: nextStatus,
        message: `Payment not completed. Status: ${data.status}`,
      },
    };
  }

  if (nextStatus !== order.status) {
    await db.execute(
      "UPDATE orders SET status = ?, transaction_id = COALESCE(?, transaction_id) WHERE id = ?",
      [nextStatus, data.transaction_id || data.transactionId || null, order.id]
    );
  }

  return {
    httpStatus: 200,
    body: {
      success: false,
      pending: nextStatus === "pending",
      orderStatus: nextStatus,
      message:
        nextStatus === "pending"
          ? `Payment is still processing. Current status: ${data.status}`
          : `Payment not completed. Status: ${data.status}`,
    },
  };
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
    const result = await verifyPaymentAndUpdateOrder(pidx);
    return res.status(result.httpStatus).json(result.body);
  } catch (error) {
    console.error("Verify Error:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
};

export const verifyPaymentReturn = async (req, res) => {
  const pidx = req.query.pidx;
  const frontendUrl =
    req.query.frontend_url ||
    process.env.FRONTEND_URL ||
    "http://localhost:5173";

  if (!pidx) {
    return res.redirect(`${frontendUrl}/payment/verify?status=error`);
  }

  try {
    const result = await verifyPaymentAndUpdateOrder(pidx);
    const status = result.body.success
      ? "success"
      : result.body.pending
        ? "pending"
        : "error";

    return res.redirect(
      `${frontendUrl}/payment/verify?pidx=${encodeURIComponent(pidx)}&status=${status}`
    );
  } catch (error) {
    console.error("Verify Return Error:", error.response?.data || error.message);
    return res.redirect(
      `${frontendUrl}/payment/verify?pidx=${encodeURIComponent(pidx)}&status=error`
    );
  }
};
