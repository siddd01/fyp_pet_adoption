// controllers/adminCharityController.js
import db from "../config/db.js";

export const getCharityStats = async (req, res) => {
    try {
        // 1. Total from Direct Donations
        const [donations] = await db.execute('SELECT SUM(amount) as total FROM donations WHERE status = "completed"');
        
        // 2. Total from 2% Store Commission
        const [commissions] = await db.execute('SELECT SUM(charity_amount) as total FROM orders WHERE status = "completed"');
        
        // 3. Total Spent
        const [spent] = await db.execute('SELECT SUM(amount_spent) as total FROM charity_impact_posts');

        // 4. Monthly Data for Graph
        const [monthlyData] = await db.execute(`
            SELECT MONTHNAME(created_at) as month, SUM(amount) as total 
            FROM donations WHERE status = "completed" 
            GROUP BY MONTH(created_at)
        `);

        res.json({
            totalCollected: (Number(donations[0].total) || 0) + (Number(commissions[0].total) || 0),
            totalSpent: Number(spent[0].total) || 0,
            chartData: monthlyData
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching stats" });
    }
};