import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

const AdminRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "ADMIN"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");
  setLoading(true);

  try {
    const token = localStorage.getItem("adminToken");
    
    // ===== DEBUG START =====
    console.log("1. Token exists:", !!token);
    console.log("2. Token value:", token);
    
    if (token) {
      try {
        const parts = token.split('.');
        console.log("3. Token parts count:", parts.length); // Should be 3
        
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          console.log("4. Decoded payload:", payload);
          console.log("5. Role in token:", payload.role);
          console.log("6. Token issued at:", new Date(payload.iat * 1000));
          console.log("7. Token expires at:", new Date(payload.exp * 1000));
          console.log("8. Is token expired?:", Date.now() > payload.exp * 1000);
        }
      } catch (decodeError) {
        console.error("Failed to decode token:", decodeError);
      }
    } else {
      console.log("NO TOKEN FOUND!");
      setError("You must be logged in to create admins");
      setLoading(false);
      return;
    }
    // ===== DEBUG END =====

    const response = await api.post(
      "/admin/auth/register",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    setSuccess(response.data.message);
    setFormData({
      full_name: "",
      email: "",
      password: "",
      role: "ADMIN"
    });

    setTimeout(() => {
      navigate("/admin/dashboard");
    }, 2000);
  } catch (err) {
    console.error("Error details:", err.response?.data);
    setError(err.response?.data?.message || "Registration failed");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Admin Account
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        {success && (
          <p className="text-green-500 text-sm mb-4 text-center">{success}</p>
        )}

        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          className="w-full mb-4 p-2 border rounded"
          value={formData.full_name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Admin Email"
          className="w-full mb-4 p-2 border rounded"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <select
          name="role"
          className="w-full mb-6 p-2 border rounded"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="ADMIN">ADMIN</option>
          <option value="SUPER_ADMIN">SUPER_ADMIN</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:bg-gray-400"
        >
          {loading ? "Creating Admin..." : "Create Admin"}
        </button>
      </form>
    </div>
  );
};

export default AdminRegister;