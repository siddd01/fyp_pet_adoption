import { createContext, useEffect, useState } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updatedData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    try {
      console.log("Updating user with data:", updatedData); // Debug log
      const res = await api.put("/user/profile", updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data); // Now setUser is accessible
      return res.data;
    } catch (err) {
      console.error("Error updating user:", err);
      console.error("Error response:", err.response?.data);
      throw err;
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, updateUser, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};