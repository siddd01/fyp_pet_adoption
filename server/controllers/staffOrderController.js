import db from "../config/db.js";
import sendEmail from "../utils/sendEmail.js";
import { ensureOrderFulfillmentColumns } from "../utils/orderFulfillment.js";

let userNotificationsReady = false;

const ensureUserNotificationsTable = async () => {
  if (userNotificationsReady) return;

  await db.query(`
    CREATE TABLE IF NOT EXISTS user_notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      type ENUM('adoption', 'report', 'general') NOT NULL,
      message TEXT NOT NULL,
      related_id INT DEFAULT NULL,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  userNotificationsReady = true;
};

const formatDisplayName = (firstName, lastName, fallback = "Not assigned") => {
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  return fullName || fallback;
};

const formatDeliveryDate = (value) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(value);

const buildOrderAcceptedEmailTemplate = ({ customerName, orderId, deliveryDate }) => `
  <div style="margin:0;padding:32px 16px;background:#f4efe6;font-family:Arial,Helvetica,sans-serif;color:#1c1917;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;">
      <tr>
        <td style="padding:0;">
          <div style="background:linear-gradient(135deg,#111827 0%,#1f2937 60%,#14532d 100%);border-radius:28px 28px 0 0;padding:28px 32px;">
            <div style="display:inline-block;padding:8px 14px;border-radius:999px;background:rgba(255,255,255,0.12);color:#dcfce7;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">
              Sano Ghar Store
            </div>
            <h1 style="margin:20px 0 8px;font-size:30px;line-height:1.15;color:#ffffff;font-family:Georgia,'Times New Roman',serif;">
              Your order has been accepted
            </h1>
            <p style="margin:0;color:#d6d3d1;font-size:15px;line-height:1.7;">
              Hi ${customerName}, our staff has confirmed Order #${orderId} and prepared it for delivery.
            </p>
          </div>

          <div style="background:#ffffff;border:1px solid #e7e5e4;border-top:none;border-radius:0 0 28px 28px;padding:32px;">
            <div style="margin:0 0 22px;padding:20px;border-radius:24px;background:linear-gradient(135deg,#ecfdf5 0%,#f5f5f4 100%);border:1px solid #d6d3d1;">
              <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#166534;">
                Estimated delivery
              </p>
              <p style="margin:0;font-size:26px;line-height:1.2;font-weight:700;color:#111827;">
                By ${deliveryDate}
              </p>
            </div>

            <p style="margin:0 0 18px;font-size:14px;color:#57534e;line-height:1.7;">
              You can expect your order within 3 days. If we need anything else before dispatch, our team will contact you using the details on your order.
            </p>

            <p style="margin:0;font-size:12px;line-height:1.7;color:#a8a29e;text-align:center;">
              Thank you for supporting Sano Ghar.
            </p>
          </div>
        </td>
      </tr>
    </table>
  </div>
`;

const mapOrderRows = (rows = []) => {
  const orderMap = new Map();

  for (const row of rows) {
    if (!orderMap.has(row.order_id)) {
      orderMap.set(row.order_id, {
        order_id: row.order_id,
        user_id: row.user_id,
        total_amount: Number(row.total_amount || 0),
        charity_amount: Number(row.charity_amount || 0),
        payment_status: row.payment_status,
        fulfillment_status: row.fulfillment_status,
        full_name: row.full_name,
        email: row.email,
        phone: row.phone,
        shipping_address: row.shipping_address,
        created_at: row.created_at,
        handled_at: row.handled_at,
        estimated_delivery_date: row.estimated_delivery_date,
        staff_note: row.staff_note,
        user_name: formatDisplayName(row.user_first_name, row.user_last_name, row.full_name || "Customer"),
        handled_by_staff_id: row.handled_by_staff_id,
        staff_name: row.handled_by_staff_id
          ? formatDisplayName(row.staff_first_name, row.staff_last_name)
          : null,
        staff_email: row.staff_email || null,
        items: [],
      });
    }

    if (row.product_id) {
      orderMap.get(row.order_id).items.push({
        product_id: row.product_id,
        product_name: row.product_name,
        category: row.category,
        image_url: row.image_url,
        quantity: Number(row.quantity || 0),
        price_at_purchase: Number(row.price_at_purchase || 0),
      });
    }
  }

  return Array.from(orderMap.values());
};

const fetchOrders = async (whereClause = "WHERE o.status = 'completed'", params = []) => {
  await ensureOrderFulfillmentColumns();

  const [rows] = await db.query(
    `
      SELECT
        o.id AS order_id,
        o.user_id,
        o.total_amount,
        o.charity_amount,
        o.status AS payment_status,
        o.fulfillment_status,
        o.full_name,
        o.email,
        o.phone,
        o.shipping_address,
        o.created_at,
        o.handled_at,
        o.estimated_delivery_date,
        o.staff_note,
        u.first_name AS user_first_name,
        u.last_name AS user_last_name,
        o.handled_by_staff_id,
        s.first_name AS staff_first_name,
        s.last_name AS staff_last_name,
        s.email AS staff_email,
        oi.product_id,
        oi.quantity,
        oi.price_at_purchase,
        p.name AS product_name,
        p.category,
        p.image_url
      FROM orders o
      INNER JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN users u ON u.id = o.user_id
      LEFT JOIN staff s ON s.staff_id = o.handled_by_staff_id
      LEFT JOIN products p ON p.id = oi.product_id
      ${whereClause}
      ORDER BY
        CASE
          WHEN o.fulfillment_status = 'new' THEN 0
          WHEN o.fulfillment_status = 'accepted' THEN 1
          WHEN o.fulfillment_status = 'delivering' THEN 2
          ELSE 3
        END,
        o.created_at DESC,
        oi.id ASC
    `,
    params
  );

  return mapOrderRows(rows);
};

export const getStaffOrders = async (_req, res) => {
  try {
    const orders = await fetchOrders();

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Failed to fetch staff orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load orders",
    });
  }
};

export const acceptStaffOrder = async (req, res) => {
  const orderId = Number(req.params.orderId);
  const staffId = req.staff?.staff_id;

  if (!Number.isInteger(orderId)) {
    return res.status(400).json({ success: false, message: "Invalid order id" });
  }

  if (!staffId) {
    return res.status(401).json({ success: false, message: "Staff authentication required" });
  }

  const connection = await db.getConnection();
  let emailSent = false;
  let emailWarning = "";
  let alreadyAccepted = false;
  let notificationMessage = "";
  let deliveryEta = null;
  let customerEmail = "";
  let customerName = "";

  try {
    await ensureOrderFulfillmentColumns();
    await ensureUserNotificationsTable();
    await connection.beginTransaction();

    const [orders] = await connection.query(
      `
        SELECT
          o.id,
          o.user_id,
          o.status,
          o.fulfillment_status,
          o.handled_by_staff_id,
          o.full_name,
          o.email,
          u.first_name,
          u.last_name,
          u.email AS user_email
        FROM orders o
        LEFT JOIN users u ON u.id = o.user_id
        WHERE o.id = ?
        FOR UPDATE
      `,
      [orderId]
    );

    if (orders.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const order = orders[0];

    if (order.status !== "completed") {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "Only paid orders can be accepted by staff",
      });
    }

    if (
      order.fulfillment_status === "accepted" &&
      Number(order.handled_by_staff_id) !== Number(staffId)
    ) {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        message: "This order has already been accepted by another staff member",
      });
    }

    customerEmail = order.email || order.user_email || "";
    customerName =
      order.full_name ||
      formatDisplayName(order.first_name, order.last_name, "there");

    if (
      order.fulfillment_status === "accepted" &&
      Number(order.handled_by_staff_id) === Number(staffId)
    ) {
      alreadyAccepted = true;
    } else {
      deliveryEta = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      notificationMessage = `Your order #${orderId} has been accepted by our staff and is expected to be delivered by ${formatDeliveryDate(deliveryEta)}.`;

      await connection.query(
        `
          UPDATE orders
          SET fulfillment_status = 'accepted',
              handled_by_staff_id = ?,
              handled_at = NOW(),
              estimated_delivery_date = ?,
              staff_note = COALESCE(staff_note, '')
          WHERE id = ?
        `,
        [staffId, deliveryEta, orderId]
      );

      await connection.query(
        `
          INSERT INTO user_notifications (user_id, type, message, related_id)
          VALUES (?, 'general', ?, ?)
        `,
        [order.user_id, notificationMessage, orderId]
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.error("Failed to accept order:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to accept order",
    });
  } finally {
    connection.release();
  }

  const [updatedOrder] = await fetchOrders("WHERE o.id = ?", [orderId]);

  if (!alreadyAccepted && customerEmail && deliveryEta) {
    try {
      await sendEmail({
        to: customerEmail,
        subject: `Order #${orderId} accepted`,
        text: `Hi ${customerName}, your order #${orderId} has been accepted and is expected to be delivered by ${formatDeliveryDate(deliveryEta)}.`,
        html: buildOrderAcceptedEmailTemplate({
          customerName,
          orderId,
          deliveryDate: formatDeliveryDate(deliveryEta),
        }),
      });
      emailSent = true;
    } catch (error) {
      emailWarning = "Order accepted, but the confirmation email could not be sent.";
      console.error("Failed to send order acceptance email:", error);
    }
  }

  return res.json({
    success: true,
    message: alreadyAccepted
      ? "Order was already accepted by you."
      : emailWarning || "Order accepted successfully.",
    emailSent,
    order: updatedOrder || null,
  });
};
