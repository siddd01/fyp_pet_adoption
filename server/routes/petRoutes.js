import express from "express";
import upload from "../middleware/uploadMiddleware.js"; // ES module import

const router = express.Router();

// Add pet
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, age, breed } = req.body;

    const imageUrl = req.file.path; // Cloudinary URL

    // TODO: Save pet data to DB
    res.status(201).json({
      message: "Pet added successfully",
      image_url: imageUrl,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
