import { createContext, useEffect, useState } from "react";
import api from "../api/axios"; // Adjust path

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    // In browser console

    const token = localStorage.getItem("adminToken");
    const storedAdmin = localStorage.getItem("admin");
    
    if (token && storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
      setIsAuthenticated(true);
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

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isAuthenticated,
        loading,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};