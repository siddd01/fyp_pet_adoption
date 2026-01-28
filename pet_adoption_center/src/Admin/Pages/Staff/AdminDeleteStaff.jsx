import { useContext, useState } from "react";
import { AdminAuthContext } from "../../../Context/AdminAuthContext";
import api from "../../../api/axios";

const AdminDeleteStaff = () => {
  const { admin } = useContext(AdminAuthContext);
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleDelete = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      // Confirm password
      const confirmRes = await api.post(
  "/auth/confirm-password",
  { password },
  { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
);


      if (!confirmRes.data.valid) {
        setMessage("Incorrect password");
        setLoading(false);
        return;
      }

      // Delete staff
      const res = await api.delete(`/staff/${staffId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });

      setMessage(res.data.message);
      setStaffId("");
      setPassword("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to delete staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Delete Staff</h2>

      {message && <p className="mb-3 text-center text-red-600">{message}</p>}

      <form onSubmit={handleDelete} className="space-y-4">
        <input
          type="number"
          placeholder="Staff ID to delete"
          value={staffId}
          onChange={(e) => setStaffId(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="password"
          placeholder="Confirm Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          {loading ? "Deleting..." : "Delete Staff"}
        </button>
      </form>
    </div>
  );
};

export default AdminDeleteStaff;
