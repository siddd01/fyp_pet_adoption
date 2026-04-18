import cors from "cors";
import express from "express";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adoptionRoutes from "./routes/adoptionRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import charityRoutes from "./routes/charityRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import petRoutes from "./routes/petRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import staffPetRoutes from "./routes/staffPetRoutes.js"; // Added import statement
import userRoutes from "./routes/userRoutes.js";
const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Parse JSON body
// application submit garyo pachi (by user) admin le tyo adoption lai delete garyo vani user lai notification jani banauna peryo
// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/user", userRoutes);
app.use("/api/adoptions", adoptionRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/charity", charityRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/payment", paymentRoutes);
app.use('/uploads', express.static('uploads'));

// Health Check
app.get("/", (req, res) => {
  res.json({ message: "Pet Adoption Center API is running!" });
});

export default app;