import { createContext, useCallback, useEffect, useState } from "react";
import api from "../api/axios"; // Adjust path

export const StaffContext = createContext();

export const StaffProvider = ({ children }) => {
  const [staff, setStaff] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [staffLoginLoading, setStaffLoginLoading] = useState(true);

  // Restore staff session from localStorage
  useEffect(() => {
    const token = localStorage.getItem("staffToken");
    const storedStaff = localStorage.getItem("staff");
    if (token && storedStaff) {
      setStaff(JSON.parse(storedStaff));
      setIsAuthenticated(true);
    }
    setStaffLoginLoading(false);
  }, []);

  // Staff login function
  const staffLogin = async (email, password) => {
    try {
      const res = await api.post("/staff/login", { email, password });
      const { token, staff } = res.data;

      // Save token and staff info
      localStorage.setItem("staffToken", token);
      localStorage.setItem("staff", JSON.stringify(staff));

      setStaff(staff);
      setIsAuthenticated(true);

      return res.data;
    } catch (error) {
      console.error("Staff login failed:", error.response?.data);
      throw error.response?.data?.message || "Login failed";
    }
  };

  // Staff logout
  const staffLogout = () => {
    localStorage.removeItem("staffToken");
    localStorage.removeItem("staff");
    setStaff(null);
    setIsAuthenticated(false);
  };

  // Add pet (Staff)
  const addPet = async (formData) => {
    try {
      const token = localStorage.getItem("staffToken");

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

  // Delete pet (Staff) - Updated to use new controller
  const deletePet = async (id) => {
    try {
      const token = localStorage.getItem("staffToken");

      const res = await api.delete(`/staff/pets/${id}`, {
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

  // Fetch Staff Profile
  const fetchStaffProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("staffToken");

      if (!token) {
        throw new Error("Not authenticated");
      }

      const res = await api.get("/staff/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStaff(res.data);
      localStorage.setItem("staff", JSON.stringify(res.data));

      return res.data;
    } catch (error) {
      console.error("Failed to fetch staff profile", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to load profile";
      throw new Error(errorMessage);
    }
  }, []);

  // Update Staff Profile
  const updateStaffProfile = useCallback(async (formData) => {
    try {
      const token = localStorage.getItem("staffToken");

      if (!token) {
        throw new Error("Not authenticated");
      }

      const res = await api.put("/staff/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setStaff(res.data);
      localStorage.setItem("staff", JSON.stringify(res.data));

      return res.data;
    } catch (error) {
      console.error("Failed to update staff profile", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to update profile";
      throw new Error(errorMessage);
    }
  }, []);

  const changeStaffPassword = useCallback(async (payload) => {
    const token = localStorage.getItem("staffToken");

    if (!token) {
      throw new Error("Not authenticated");
    }

    const res = await api.put("/staff/change-password", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  }, []);
  // Add this inside your StaffProvider
const adminUpdateAnyStaff = async (staffId, updatedData) => {
  try {
    const adminToken = localStorage.getItem("adminToken");
    const res = await api.put(`/staff/admin-update/${staffId}`, updatedData, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update staff member";
  }
};

  return (
    <StaffContext.Provider
      value={{
        staff,
        isAuthenticated,
        staffLoginLoading,
        setStaffLoginLoading,
        staffLogin,
        staffLogout,
        addPet,
        deletePet,
        fetchStaffProfile,
        updateStaffProfile,
        changeStaffPassword,
        adminUpdateAnyStaff,
      }}
    >
      {children}
    </StaffContext.Provider>
  );
};
