import db from "../config/db.js";

let orderFulfillmentColumnsReady = false;

export const ensureOrderFulfillmentColumns = async () => {
  if (orderFulfillmentColumnsReady) return;

  await db.query(`
    ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS fulfillment_status ENUM('new', 'accepted', 'delivering', 'delivered') NOT NULL DEFAULT 'new',
    ADD COLUMN IF NOT EXISTS handled_by_staff_id INT NULL,
    ADD COLUMN IF NOT EXISTS handled_at DATETIME NULL,
    ADD COLUMN IF NOT EXISTS estimated_delivery_date DATETIME NULL,
    ADD COLUMN IF NOT EXISTS staff_note TEXT NULL
  `);

  orderFulfillmentColumnsReady = true;
};
