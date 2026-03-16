import { useContext, useEffect, useState } from "react";
import { AdminAuthContext } from "../../Context/AdminAuthContext";

const AdminProfile = () => {
  const { admin, fetchAdminProfile, AdminProfileLoading } = useContext(AdminAuthContext);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        await fetchAdminProfile();
      } catch (err) {
        setError(err);
      }
    };

    loadProfile();
  }, []);

  if (AdminProfileLoading) return <p className="text-center">Loading...</p>;

  if (error)
    return <p className="text-center text-red-500">{error}</p>;

  if (!admin) return null;

  return (
    <div className="max-w-xl mx-auto bg-white shadow rounded p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Profile</h2>

      <div className="space-y-2">
        <p>
          <strong>Name:</strong> {admin.full_name}
        </p>
        <p>
          <strong>Email:</strong> {admin.email}
        </p>
        <p>
          <strong>Role:</strong> {admin.role}
        </p>
      </div>

      {/* Placeholder for images */}
      <div className="mt-4 flex gap-4">
        <div className="w-24 h-24 bg-gray-200 rounded">
          {admin.profile_image && (
            <img
              src={admin.profile_image}
              alt="Profile"
              className="w-full h-full object-cover rounded"
            />
          )}
        </div>

        <div className="flex-1 h-24 bg-gray-100 rounded">
          {admin.cover_image && (
            <img
              src={admin.cover_image}
              alt="Cover"
              className="w-full h-full object-cover rounded"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
