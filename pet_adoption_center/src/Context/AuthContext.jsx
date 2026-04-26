import { createContext, useEffect, useState } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await api.get("/user/profile");
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching user:", err);
      setUser(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updatedData) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const formData = new FormData();
    formData.append("first_name", updatedData.first_name);
    formData.append("last_name", updatedData.last_name);
    formData.append("date_of_birth", updatedData.date_of_birth || "");
    formData.append("gender", updatedData.gender || "");

    if (updatedData.image instanceof File) {
      formData.append("image", updatedData.image);
    }

    const res = await api.put("/user/profile", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    setUser(res.data);
    return res.data;
  };

  const deleteAccount = async (password) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await api.delete("/user/delete-account", {
      headers: { Authorization: `Bearer ${token}` },
      data: { password },
    });

    localStorage.removeItem("token");
    setUser(null);
    return res.data;
  };

  const changeUserPassword = async (payload) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await api.put("/user/change-password", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        fetchUser,
        updateUser,
        changeUserPassword,
        deleteAccount,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
