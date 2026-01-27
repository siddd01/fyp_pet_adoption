import cors from "cors";
import express from "express";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adoptionRoutes from "./routes/adoptionRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import petRoutes from "./routes/petRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import userRoutes from "./routes/userRoutes.js";
const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Parse JSON body

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/user", userRoutes);
app.use("/api/adoptions", adoptionRoutes);




app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/staff", staffRoutes);
// Health Check
app.get("/", (req, res) => {
  res.json({ message: "Pet Adoption Center API is running!" });
});

export default app;
