import db from "../config/db.js";

// Delete Pet for Staff (with adoption request check)
export const deletePet = async (req, res) => {
  try {
    const { id } = req.params;
    const staffId = req.staff?.staff_id;
    
    // First, get pet information
    const [petInfo] = await db.query("SELECT name, breed, age FROM pets WHERE id = ?", [id]);
    
    if (petInfo.length === 0) {
      return res.status(404).json({ message: "Pet not found" });
    }
    
    const pet = petInfo[0];
    
    // Check if there are existing adoption requests for this pet
    const [adoptionRequests] = await db.query(`
      SELECT DISTINCT u.id as user_id, u.email, u.full_name
      FROM users u
      JOIN adoption_applications a ON u.id = a.user_id
      WHERE a.pet_id = ? AND a.status IN ('pending', 'under_review')
    `, [id]);
    
    console.log("🔍 Staff checking pet deletion for pet ID:", id);
    console.log("📊 Found adoption requests:", adoptionRequests.length);
    
    // If there are adoption requests, prevent deletion
    if (adoptionRequests.length > 0) {
      return res.status(400).json({ 
        message: "This pet cannot be deleted because it has pending adoption requests. Please handle the adoption requests first before deleting this pet.",
        hasRequests: true,
        requestCount: adoptionRequests.length
      });
    }
    
    // Delete pet only if no adoption requests exist
    await db.query("DELETE FROM pets WHERE id = ?", [id]);
    
    res.status(200).json({ 
      message: "Pet deleted successfully",
      notificationsSent: 0,
      adminNotificationSent: false
    });
  } catch (error) {
    console.error("Staff delete pet error:", error);
    res.status(500).json({ message: "Failed to delete pet" });
  }
};
