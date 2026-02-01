import { useContext, useEffect, useState } from "react";
import api from "../../../api/axios"; // your axios instance
import { AdminAuthContext } from "../../../Context/AdminAuthContext";

const AdminHandleAdoption = () => {
  const { admin } = useContext(AdminAuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all adoption applications
  const fetchApplications = async () => {
    setLoading(true);
    try {
      // Use token from localStorage (or you can also store it in context)
      const token = localStorage.getItem("adminToken");

      const res = await api.get("/adoptions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setApplications(res.data.applications);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      alert("Failed to fetch adoption applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Approve or Reject a single adoption application
  const handleStatusUpdate = async (id, status) => {
    if (!window.confirm(`Are you sure you want to mark this application as ${status}?`)) return;

    try {
      const token = localStorage.getItem("adminToken");
      await api.patch(
        `/adoptions/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Application ${status} successfully`);
      fetchApplications(); // refresh after update
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update application status");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Adoption Applications</h2>

      {loading ? (
        <p>Loading...</p>
      ) : applications.length === 0 ? (
        <p>No adoption applications found.</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Pet</th>
              <th className="px-4 py-2 border">User</th>
              <th className="px-4 py-2 border">Age</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-t">
                <td className="px-4 py-2 border">{app.id}</td>
                <td className="px-4 py-2 border">{app.pet_name} (ID: {app.pet_id})</td>
                <td className="px-4 py-2 border">{app.full_name}</td>
                <td className="px-4 py-2 border">{app.age}</td>
                <td className="px-4 py-2 border capitalize">{app.status}</td>
                <td className="px-4 py-2 border">
                  {app.status === "pending" ? (
                    <div className="flex gap-2">
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded"
                        onClick={() => handleStatusUpdate(app.id, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => handleStatusUpdate(app.id, "rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-500">No actions</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminHandleAdoption;
