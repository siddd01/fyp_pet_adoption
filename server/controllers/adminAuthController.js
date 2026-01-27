import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";


export const adminRegister = async (req, res) => {
  const { full_name, email, password } = req.body;

  try {
    // Check if any admin exists
 const [admins] = await db.query("SELECT admin_id FROM admins LIMIT 1");
console.log("Admins count:", admins.length);
console.log("Authorization header:", req.headers.authorization);


    const isFirstAdmin = admins.length === 0;

    let requestingAdmin = null;

    // If NOT first admin → token REQUIRED
    if (!isFirstAdmin) {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const token = authHeader.split(" ")[1];

      try {
        requestingAdmin = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
      }
    }

    // Prevent duplicate email
    const [existing] = await db.query(
      "SELECT admin_id FROM admins WHERE email = ?",
      [email]
    );

    if (existing.length) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO admins (full_name, email, password, role)
       VALUES (?, ?, ?, 'ADMIN')`,
      [full_name, email, hashedPassword]
    );

    res.status(201).json({
      message: isFirstAdmin
        ? "First admin created"
        : "Admin created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Admin registration failed" });
  }
};

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT * FROM admins WHERE email = ? AND status = 'ACTIVE'",
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        admin_id: admin.admin_id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      admin: {
        admin_id: admin.admin_id,
        full_name: admin.full_name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};
