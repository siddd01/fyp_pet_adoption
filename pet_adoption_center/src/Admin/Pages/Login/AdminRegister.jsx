import { useState } from "react";
import api from "../../../api/axios";
import { PASSWORD_REQUIREMENTS, validatePassword } from "../../../utils/passwordPolicy";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "ADMIN",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      setMessage(passwordValidation.message);
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
     const token = localStorage.getItem("adminToken");

const res = await api.post(
  "/admin/auth/register",
  formData,
  {
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : {},
  }
);
setFormData({
  full_name: "",
  email: "",
  password: "",
});

      setMessage(res.data.message);
      setMessageType("success");

    } catch (error) {
      setMessage(
        error.response?.data?.message || "Admin creation failed"
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Create Admin</h2>

      {message && (
        <p className={`mb-3 text-sm text-center ${messageType === "success" ? "text-emerald-600" : "text-red-600"}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
          required
          className="w-full border p-2 rounded"
        />
        <p className="text-xs text-stone-500">{PASSWORD_REQUIREMENTS}</p>

        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded hover:opacity-90"
        >
          {loading ? "Creating..." : "Create Admin"}
        </button>
      </form>
    </div>
  );
};

export default AdminRegister;
