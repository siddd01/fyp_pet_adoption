import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

// Signup Staff
// controllers/staffController.js

export const staffSignup = async (req, res) => {
  const { first_name, last_name, email, password, phone_number, date_of_birth } = req.body;

  try {
    console.log("Requesting staff role:", req.staff.role);
    const [existing] = await db.query("SELECT staff_id FROM staff WHERE email = ?", [email]);
    if (existing.length) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `INSERT INTO staff (first_name, last_name, email, password, phone_number, role, date_of_birth)
       VALUES (?, ?, ?, ?, ?, 'STAFF', ?)`,
      [first_name, last_name, email, hashedPassword, phone_number, date_of_birth]
    );

    res.status(201).json({ message: "Staff created successfully", staff_id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Staff signup failed" });
  }
};


// Staff Login
export const staffLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM staff WHERE email = ? AND status = 'ACTIVE'", [email]);

    if (!rows.length) return res.status(401).json({ message: "Invalid credentials" });

    const staff = rows[0];
    const isMatch = await bcrypt.compare(password, staff.password);

    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { staff_id: staff.staff_id, role: staff.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      staff: {
        staff_id: staff.staff_id,
        first_name: staff.first_name,
        last_name: staff.last_name,
        email: staff.email,
        role: staff.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
};

// Delete Staff (only MANAGER can delete)
export const deleteStaff = async (req, res) => {
  const { staff_id } = req.params;

  try {
    // Only MANAGER can delete
    if (req.staff.role !== "MANAGER") {
      return res.status(403).json({ message: "Access denied" });
    }

    const [result] = await db.query("DELETE FROM staff WHERE staff_id = ?", [staff_id]);

    if (result.affectedRows === 0) return res.status(404).json({ message: "Staff not found" });

    res.json({ message: "Staff deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete staff" });
  }
};
