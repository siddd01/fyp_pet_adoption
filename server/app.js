import cors from "cors";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import petRoutes from "./routes/petRoutes.js";
import productRoutes from "./routes/productRoutes.js";
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
// Health Check
app.get("/", (req, res) => {
  res.json({ message: "Pet Adoption Center API is running!" });
});

export default app;
