import { createContext, useEffect, useState } from "react";
import api from "../api/axios"; // Adjust path

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [AdminProfileLoading, setAdminProfileLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
  const token = localStorage.getItem("adminToken");
  const storedAdmin = localStorage.getItem("admin");
  
  if (token && token !== "null" && storedAdmin) {
    setAdmin(JSON.parse(storedAdmin));
    setIsAuthenticated(true);
    setAdminProfileLoading(false); // Add this!
  } else {
    setAdminProfileLoading(false); // Stop loading even if no admin
  }
  setLoading(false);
}, []);

  const adminLogin = async (email, password) => {
    try {
      const response = await api.post("/admin/auth/login", {
        email, 
        password 
      });

      const { token, admin } = response.data;

      // IMPORTANT: Save the token to localStorage
      localStorage.setItem("adminToken", token);
      localStorage.setItem("admin", JSON.stringify(admin));

      setAdmin(admin);
      setIsAuthenticated(true);

      console.log("✅ Login successful, token saved:", token.substring(0, 20) + "...");

      return response.data;
    } catch (error) {
      console.error("❌ Login failed:", error.response?.data);

      throw error.response?.data?.message || "Login failed";
    }
  };

  const adminLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    setAdmin(null);
    setIsAuthenticated(false);
  };

  const fetchAdminProfile = async () => {
  setAdminProfileLoading(true);
  console.log("📡 API Call Started..."); // Log 1
  try {
    const token = localStorage.getItem("adminToken");
    const res = await api.get("/admin/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ API Data Received:", res.data); // Log 2
    setAdmin(res.data);
  } catch (error) {
    console.error("❌ API Error:", error);
  } finally {
    console.log("🏁 Loading set to FALSE"); // Log 3
    setAdminProfileLoading(false);
  }
};

// Add pet (Admin)
const addPet = async (formData) => {
  try {
    const token = localStorage.getItem("adminToken");

    const res = await api.post("/pets", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    console.error("Failed to add pet", error);
    throw error.response?.data?.message || "Failed to add pet";
  }
};

// Delete pet by ID (Admin)
const deletePet = async (id) => {
  try {
    const token = localStorage.getItem("adminToken");

    const res = await api.delete(`/pets/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Failed to delete pet", error);
    throw error.response?.data?.message || "Failed to delete pet";
  }
};
// Update Profile (Name & Images)
const updateAdminProfile = async (formData) => {
  const token = localStorage.getItem("adminToken");
  const res = await api.put("/admin/update-profile", formData, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
  });
  setAdmin(res.data.admin);
  localStorage.setItem("admin", JSON.stringify(res.data.admin));
};

const changeAdminPassword = async (data) => {
  const token = localStorage.getItem("adminToken");
  return await api.put("/admin/change-password", data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Change Password

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isAuthenticated,
        loading,
        adminLogin,
        adminLogout,
        fetchAdminProfile,
        AdminProfileLoading,
        addPet,
        deletePet,
        updateAdminProfile,
        changeAdminPassword,
        
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};