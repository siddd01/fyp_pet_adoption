import { createContext, useEffect, useState } from "react";
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

  return (
    <StaffContext.Provider
      value={{
        staff,
        isAuthenticated,
        staffLoginLoading,
        setStaffLoginLoading,
        staffLogin,
        staffLogout,
      }}
    >
      {children}
    </StaffContext.Provider>
  );
};
