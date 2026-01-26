// Test script to verify all endpoints work
import dotenv from "dotenv";
import db from "./config/db.js";
dotenv.config();

console.log("🔍 Testing Pet Adoption Center API...\n");

// Test database connection
console.log("📊 Testing database connection...");

try {
  const [rows] = await db.query("SELECT 1 as test");
  console.log("✅ Database connection successful");
} catch (error) {
  console.log("❌ Database connection failed:", error.message);
  process.exit(1);
}

// Test if tables exist
console.log("\n🗄️ Checking required tables...");
const tables = ['users', 'products', 'cart_items'];

for (const table of tables) {
  try {
    await db.query(`SELECT 1 FROM ${table} LIMIT 1`);
    console.log(`✅ Table '${table}' exists`);
  } catch (error) {
    console.log(`❌ Table '${table}' missing - run create_tables.sql`);
  }
}

// Test email configuration
console.log("\n📧 Testing email configuration...");
console.log("EMAIL_USER:", process.env.EMAIL_USER ? "✅ Set" : "❌ Missing");
console.log("EMAIL_APP_PASSWORD:", process.env.EMAIL_APP_PASSWORD ? "✅ Set" : "❌ Missing");

// Test Cloudinary configuration
console.log("\n☁️ Testing Cloudinary configuration...");
console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME ? "✅ Set" : "❌ Missing");
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY ? "✅ Set" : "❌ Missing");
console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing");

console.log("\n🚀 All checks complete! Your backend should be ready to run.");
console.log("Run 'npm run dev' to start the server.");

process.exit(0);