import { useContext, useState } from "react";
import { AdminAuthContext } from "../../../Context/AdminAuthContext";
import api from "../../../api/axios";

const AdminStaffRegister = () => {
  const { admin } = useContext(AdminAuthContext);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
    date_of_birth: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("adminToken");

      const res = await api.post("/staff/admin-create", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage(res.data.message);

      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        phone_number: "",
        date_of_birth: "",
      });
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Create Staff</h2>

      {message && <p className="mb-3 text-sm text-center text-red-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="text" name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} className="w-full border p-2 rounded" />
        <input type="date" name="date_of_birth" placeholder="Date of Birth" value={formData.date_of_birth} onChange={handleChange} className="w-full border p-2 rounded" />

        <button type="submit" disabled={loading} className="w-full bg-black text-white py-2 rounded hover:opacity-90">
          {loading ? "Creating..." : "Create Staff"}
        </button>
      </form>
    </div>
  );
};

export default AdminStaffRegister;
