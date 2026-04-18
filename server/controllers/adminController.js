import bcrypt from "bcryptjs";
import db from "../config/db.js";
export const getAdminProfile = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT admin_id, full_name, email, role, profile_image, cover_image
       FROM admins WHERE admin_id = ?`,
      [req.admin.admin_id]
    );

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

export const confirmAdminPassword = async (req, res) => {
  console.log("🔥 CONFIRM PASSWORD API HIT");
  try {
    const { password } = req.body;
    
    // DEBUG: See what the middleware is actually giving you
    console.log("Admin Data from Middleware:", req.admin || req.staff || req.user);

    // Use whichever key your middleware is using (likely req.admin based on your profile code)
    const admin_id = req.admin?.admin_id ;

    if (!admin_id) {
      return res.status(401).json({ message: "Admin ID missing from request" });
    }

    const [rows] = await db.query(
      "SELECT password FROM admins WHERE admin_id = ?",
      [admin_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Admin not found in database" });
    }

    const isValid = await bcrypt.compare(password, rows[0].password);
    
    // Always return a response!
    return res.json({ valid: isValid });
    
  } catch (error) {
    console.error("Controller Error:", error);
    return res.status(500).json({ message: "Internal server error during verification" });
  }
};

// Change Admin Password
export const changeAdminPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const admin_id = req.admin.admin_id;

  try {
    // 1. Get current password from DB
    const [rows] = await db.query("SELECT password FROM admins WHERE admin_id = ?", [admin_id]);
    
    // 2. Verify old password
    const isMatch = await bcrypt.compare(oldPassword, rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // 3. Hash new password and update
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    await db.query("UPDATE admins SET password = ? WHERE admin_id = ?", [hashedNewPassword, admin_id]);

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error during password update" });
  }
};
export const updateAdminProfile = async (req, res) => {
  const admin_id = req.admin.admin_id;
  const { full_name } = req.body;

  try {
    console.log("in process of update profile")
    // 1. Capture the Cloudinary URLs if files were uploaded
    const profile_image = req.files?.profile_image ? req.files.profile_image[0].path : null;
    const cover_image = req.files?.cover_image ? req.files.cover_image[0].path : null;

    // 2. Build the dynamic SQL query
    let updates = ["full_name = ?"];
    let params = [full_name];

    if (profile_image) {
      updates.push("profile_image = ?");
      params.push(profile_image);
    }
    if (cover_image) {
      updates.push("cover_image = ?");
      params.push(cover_image);
    }

    params.push(admin_id);
    const sql = `UPDATE admins SET ${updates.join(", ")} WHERE admin_id = ?`;

    await db.query(sql, params);

    // 3. Return the fresh data so the frontend updates instantly
    const [rows] = await db.query(
      "SELECT admin_id, full_name, email, role, profile_image, cover_image FROM admins WHERE admin_id = ?",
      [admin_id]
    );

    res.json({ message: "Profile updated successfully", admin: rows[0] });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};



export const getCharityInflowStats = async (req, res) => {
  try {
    console.log("in get charity flow")
    // 1. Get Direct Donations Total
 const [directRes] = await db.execute(
  "SELECT SUM(amount) as total FROM donations WHERE status IN ('Completed', 'completed')"
);
    const fromDirect = Number(directRes[0].total || 0);

    // 2. Get Store 2% Contributions Total
    const [storeRes] = await db.execute(
      "SELECT SUM(charity_amount) as total FROM orders WHERE status = 'completed'"
    );
    const fromStore = Number(storeRes[0].total || 0);

    // 3. Get monthly data for the Chart (Last 6 months)
    // This query combines both orders and donations by month
 const [chartRes] = await db.execute(`
  SELECT month, SUM(amount) as amount FROM (
    SELECT DATE_FORMAT(created_at, '%b') as month, amount
    FROM donations WHERE status IN ('Completed', 'completed')
    UNION ALL
    SELECT DATE_FORMAT(created_at, '%b') as month, charity_amount as amount 
    FROM orders WHERE status = 'completed'
  ) as combined 
  GROUP BY month 
  ORDER BY FIELD(month, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec')
`);

    res.json({
      total: fromDirect + fromStore,
      fromDirect,
      fromStore,
      chart: chartRes // Array of { month: 'Jan', amount: 500 }
    });
  } catch (error) {
    console.error("Admin Stats Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
};
export const getRecentDonations = async (req, res) => {
  try {
    console.log("in recent")
    const query = `
      SELECT 
        d.id, 
        d.donor_name, 
        d.donor_email, 
        d.amount, 
        d.message, 
        d.created_at,
        d.status,
        d.pidx,
        d.user_id,
        u.profile_image
      FROM donations d
      LEFT JOIN users u ON d.user_id = u.id
      WHERE d.status IN ('Completed', 'completed')
      ORDER BY d.created_at DESC
    `;
    
    const [rows] = await db.execute(query);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching donations" });
  }
};

export const getStoreAnalysis = async (req, res) => {
  try {
    // Get total sales from completed orders
    const [salesRes] = await db.execute(
      "SELECT SUM(total_amount) as total_sales, COUNT(*) as total_orders FROM orders WHERE status = 'completed'"
    );
    
    // Get total charity amount from completed orders
    const [charityRes] = await db.execute(
      "SELECT SUM(charity_amount) as total_charity FROM orders WHERE status = 'completed' AND is_donated = 0"
    );
    
    // Get already donated amount
    const [donatedRes] = await db.execute(
      "SELECT SUM(charity_amount) as total_donated FROM orders WHERE status = 'completed' AND is_donated = 1"
    );
    
    const totalSales = Number(salesRes[0].total_sales || 0);
    const totalOrders = Number(salesRes[0].total_orders || 0);
    const totalCharity = Number(charityRes[0].total_charity || 0);
    const totalDonated = Number(donatedRes[0].total_donated || 0);
    
    // Get direct donations total
    const [directDonationsRes] = await db.execute(
      "SELECT SUM(amount) as total FROM donations WHERE status IN ('Completed', 'completed')"
    );
    const directDonations = Number(directDonationsRes[0].total || 0);
    
    // Calculate total donations (store charity + direct donations)
    const totalDonations = totalCharity + directDonations;
    
    // Get monthly sales data for the last 6 months
    const [monthlySalesRes] = await db.execute(`
      SELECT 
        DATE_FORMAT(created_at, '%b') as month,
        SUM(total_amount) as sales,
        COUNT(*) as orders,
        SUM(charity_amount) as charity
      FROM orders 
      WHERE status = 'completed' 
        AND created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%b')
      ORDER BY FIELD(month, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec')
    `);
    
    // Get monthly donation trends
    const [monthlyDonationsRes] = await db.execute(`
      SELECT 
        DATE_FORMAT(created_at, '%b') as month,
        SUM(amount) as direct_donations
      FROM donations 
      WHERE status IN ('Completed', 'completed')
        AND created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%b')
      ORDER BY FIELD(month, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec')
    `);
    
    // Get daily sales for the last 7 days
    const [dailySalesRes] = await db.execute(`
      SELECT 
        DATE(created_at) as date,
        SUM(total_amount) as sales,
        COUNT(*) as orders
      FROM orders 
      WHERE status = 'completed' 
        AND created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);
    
    res.json({
      total_sales: totalSales,
      total_orders: totalOrders,
      charity_amount: totalCharity,
      donated_amount: totalDonated,
      pending_donation: totalCharity - totalDonated,
      direct_donations: directDonations,
      total_donations: totalDonations,
      monthly_sales: monthlySalesRes,
      monthly_donations: monthlyDonationsRes,
      daily_sales: dailySalesRes
    });
  } catch (err) {
    console.error("Store analysis error:", err);
    res.status(500).json({ message: "Error fetching store analysis" });
  }
};

export const donateStoreCharity = async (req, res) => {
  try {
    // Mark all undonated charity amounts as donated
    const [result] = await db.execute(
      "UPDATE orders SET is_donated = 1 WHERE status = 'completed' AND is_donated = 0"
    );
    
    res.json({ 
      success: true, 
      message: `Marked ${result.affectedRows} orders as donated`,
      affected_orders: result.affectedRows
    });
  } catch (err) {
    console.error("Donate charity error:", err);
    res.status(500).json({ message: "Error processing donation" });
  }
};

export const getStoreAnalytics = async (req, res) => {
  try {
    // Get comprehensive store analytics
    const [salesStats] = await db.execute(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as avg_order_value,
        SUM(charity_amount) as total_charity,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as orders_last_30_days,
        SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN total_amount END) as revenue_last_30_days
      FROM orders
    `);

    // Get monthly revenue trends
    const [monthlyRevenue] = await db.execute(`
      SELECT 
        DATE_FORMAT(created_at, '%b %Y') as month,
        SUM(total_amount) as revenue,
        COUNT(*) as orders,
        SUM(charity_amount) as charity
      FROM orders 
      WHERE status = 'completed' 
        AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%b %Y')
      ORDER BY created_at ASC
    `);

    // Get top selling products
    const [topProducts] = await db.execute(`
      SELECT 
        p.name,
        SUM(oi.quantity) as total_sold,
        SUM(oi.quantity * oi.price_at_purchase) as total_revenue
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      JOIN products p ON oi.product_id = p.id
      WHERE o.status = 'completed'
      GROUP BY oi.product_id, p.name
      ORDER BY total_sold DESC
      LIMIT 10
    `);

    // Get daily sales for last 7 days
    const [dailySales] = await db.execute(`
      SELECT 
        DATE(created_at) as date,
        SUM(total_amount) as revenue,
        COUNT(*) as orders
      FROM orders 
      WHERE status = 'completed' 
        AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    // Get payment status breakdown
    const [paymentStatus] = await db.execute(`
      SELECT 
        status,
        COUNT(*) as count,
        SUM(total_amount) as total_amount
      FROM orders
      GROUP BY status
    `);

    res.json({
      overview: salesStats[0],
      monthly_trends: monthlyRevenue,
      top_products: topProducts,
      daily_sales: dailySales,
      payment_breakdown: paymentStatus
    });
  } catch (error) {
    console.error("Store analytics error:", error);
    res.status(500).json({ message: "Error fetching store analytics" });
  }
};