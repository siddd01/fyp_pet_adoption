import cors from "cors";
import express from "express";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Parse JSON body

// API Routes
app.use("/auth", authRoutes);

// Health Check
app.get("/", (req, res) => {
  res.json({ message: "Pet Adoption Center API is running!" });
});

export default app;
