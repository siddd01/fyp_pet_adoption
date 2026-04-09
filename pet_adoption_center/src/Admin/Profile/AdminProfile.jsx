import { useContext, useEffect, useState } from "react";
import { AdminAuthContext } from "../../Context/AdminAuthContext";

const AdminProfile = () => {
  const { admin, fetchAdminProfile, AdminProfileLoading, updateAdminProfile, changeAdminPassword } = useContext(AdminAuthContext);
  
  // State for forms
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
  const [files, setFiles] = useState({ profile: null, cover: null });

  useEffect(() => {
    fetchAdminProfile();
    if (admin) setFullName(admin.full_name);
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log("🚀 SAVE BUTTON CLICKED!");
    const formData = new FormData();
    formData.append("full_name", fullName);
    if (files.profile) formData.append("profile_image", files.profile);
    if (files.cover) formData.append("cover_image", files.cover);

    try {
      await updateAdminProfile(formData);
      alert("Profile Updated!");
      setIsEditing(false);
    } catch (err) { alert(err); }
  };

  if (AdminProfileLoading && !admin) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* PROFILE DISPLAY CARD */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="h-32 bg-gray-200 relative">
          {admin?.cover_image && <img src={`http://localhost:5000/uploads/${admin.cover_image}`} className="w-full h-full object-cover" />}
          <div className="absolute -bottom-10 left-6 w-24 h-24 rounded-full border-4 border-white bg-gray-300 overflow-hidden">
            {admin?.profile_image && <img src={`http://localhost:5000/uploads/${admin.profile_image}`} className="w-full h-full object-cover" />}
          </div>
        </div>
        <div className="pt-12 p-6">
          <h2 className="text-2xl font-bold">{admin?.full_name}</h2>
          <p className="text-gray-600">{admin?.email} • <span className="text-blue-600 font-semibold">{admin?.role}</span></p>
          <button onClick={() => setIsEditing(!isEditing)} className="mt-4 text-sm text-blue-600 hover:underline">
            {isEditing ? "Cancel Editing" : "Edit Profile & Settings"}
          </button>
        </div>
      </div>

      {/* EDIT SECTION (Only shows if isEditing is true) */}
      {isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Update Info & Images */}
          <form onSubmit={handleUpdate} className="bg-white p-6 shadow rounded-lg space-y-4">
            <h3 className="font-bold border-b pb-2">Update Information</h3>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border p-2 rounded" placeholder="Full Name" />
            <label className="block text-xs text-gray-500">Profile Image</label>
            <input type="file" onChange={(e) => setFiles({...files, profile: e.target.files[0]})} className="text-sm" />
            <label className="block text-xs text-gray-500">Cover Image</label>
            <input type="file" onChange={(e) => setFiles({...files, cover: e.target.files[0]})} className="text-sm" />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Save Profile</button>
          </form>

          {/* Change Password */}
          <form onSubmit={async (e) => {
            e.preventDefault();
            try {
              await changeAdminPassword(passwords);
              alert("Password Changed!");
              setPasswords({ oldPassword: "", newPassword: "" });
            } catch (err) { alert(err); }
          }} className="bg-white p-6 shadow rounded-lg space-y-4">
            <h3 className="font-bold border-b pb-2">Security</h3>
            <input type="password" placeholder="Current Password" value={passwords.oldPassword} onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})} className="w-full border p-2 rounded" />
            <input type="password" placeholder="New Password" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} className="w-full border p-2 rounded" />
            <button type="submit" className="w-full bg-gray-800 text-white py-2 rounded">Update Password</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;