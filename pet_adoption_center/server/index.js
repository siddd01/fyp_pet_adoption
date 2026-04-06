import dotenv from "dotenv";
import app from "./app.js";
dotenv.config();


console.log("Starting server...");
const PORT = process.env.PORT || 5000;
console.log(`Port configured as: ${PORT}`);

try {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  server.on('error', (e) => {
    console.error("Server error:", e);
  });
} catch (error) {
  console.error("Startup error:", error);
}
console.log("Listen called.");
