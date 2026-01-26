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
      console.log(res.data)
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
    if (!token) throw new Error("No token found");

    const res = await api.put("/user/profile", updatedData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUser(res.data);
    return res.data;
  };

  useEffect(() => {
    fetchUser();
  }, []);

    const logout = () => {
    localStorage.removeItem("token"); // remove JWT
    setUser(null);                     // clear user state
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        fetchUser,
        updateUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
