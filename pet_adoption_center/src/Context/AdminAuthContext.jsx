import { createContext, useCallback, useEffect, useState } from "react";
import api from "../api/axios";

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [AdminProfileLoading, setAdminProfileLoading] = useState(true);

  const adminLogin = async (email, password) => {
    try {
      const response = await api.post("/admin/auth/login", { email, password });
      const { token, admin: adminData } = response.data;

      localStorage.setItem("adminToken", token);
      localStorage.setItem("admin", JSON.stringify(adminData));

      setAdmin(adminData);
      setIsAuthenticated(true);
      setAdminProfileLoading(false);
      setLoading(false);

      return response.data;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error);
      throw error.response?.data?.message || "Login failed";
    }
  };

  const adminLogout = useCallback(() => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    setAdmin(null);
    setIsAuthenticated(false);
    setAdminProfileLoading(false);
  }, []);

  const fetchAdminProfile = useCallback(async () => {
    setAdminProfileLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const res = await api.get("/admin/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAdmin(res.data);
      setIsAuthenticated(true);
      localStorage.setItem("admin", JSON.stringify(res.data));
      return res.data;
    } catch (error) {
      console.error("Failed to fetch admin profile:", error);
      adminLogout();
      throw error.response?.data?.message || "Failed to fetch profile";
    } finally {
      setAdminProfileLoading(false);
    }
  }, [adminLogout]);

  useEffect(() => {
    let active = true;

    const bootstrapAdmin = async () => {
      const token = localStorage.getItem("adminToken");
      const storedAdmin = localStorage.getItem("admin");

      if (token && token !== "null" && storedAdmin) {
        try {
          setAdmin(JSON.parse(storedAdmin));
          setIsAuthenticated(true);
          await fetchAdminProfile();
        } catch (error) {
          console.error("Failed to refresh admin session:", error);
        }
      } else {
        adminLogout();
      }

      if (active) {
        setLoading(false);
      }
    };

    bootstrapAdmin();

    return () => {
      active = false;
    };
  }, [adminLogout, fetchAdminProfile]);

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

  const updateAdminProfile = async (formData) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await api.put("/admin/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setAdmin(res.data.admin);
      localStorage.setItem("admin", JSON.stringify(res.data.admin));
      return res.data;
    } catch (error) {
      console.error("Failed to update admin profile:", error);
      throw error.response?.data?.message || "Failed to update profile";
    }
  };

  const changeAdminPassword = async (data) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await api.put("/admin/change-password", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data;
    } catch (error) {
      console.error("Failed to change admin password:", error);
      throw error;
    }
  };

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
