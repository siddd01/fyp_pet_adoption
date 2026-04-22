import { useContext, useEffect, useState } from "react";
import { AdminAuthContext } from "../../Context/AdminAuthContext";
import PetLoader from "../../Components/PetLoader";

const AdminProfile = () => {
  const {
    admin,
    fetchAdminProfile,
    AdminProfileLoading,
    updateAdminProfile,
    changeAdminPassword,
  } = useContext(AdminAuthContext);

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [files, setFiles] = useState({ profile: null, cover: null });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const getImageSrc = (value) => {
    if (!value) return "";
    if (value.startsWith("http://") || value.startsWith("https://")) return value;
    return `http://localhost:5000/uploads/${value}`;
  };

  useEffect(() => {
    fetchAdminProfile().catch((error) => {
      setProfileMessage(error);
    });
  }, []);

  useEffect(() => {
    if (admin) {
      setFullName(admin.full_name || "");
      setEmail(admin.email || "");
    }
  }, [admin]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage("");

    const formData = new FormData();
    formData.append("full_name", fullName.trim());
    formData.append("email", email.trim());

    if (files.profile) formData.append("profile_image", files.profile);
    if (files.cover) formData.append("cover_image", files.cover);

    try {
      await updateAdminProfile(formData);
      setProfileMessage("Profile updated successfully.");
      setFiles({ profile: null, cover: null });
      setIsEditing(false);
    } catch (err) {
      setProfileMessage(err);
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setSavingPassword(true);
    setPasswordMessage("");

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMessage("New passwords do not match.");
      setSavingPassword(false);
      return;
    }

    try {
      await changeAdminPassword(passwords);
      setPasswordMessage("Password updated successfully.");
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPasswordMessage(err);
    } finally {
      setSavingPassword(false);
    }
  };

  if (AdminProfileLoading && !admin) return <PetLoader />;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="h-32 bg-gray-200 relative">
          {admin?.cover_image && (
            <img src={getImageSrc(admin.cover_image)} alt="Cover" className="w-full h-full object-cover" />
          )}
          <div className="absolute -bottom-10 left-6 w-24 h-24 rounded-full border-4 border-white bg-gray-300 overflow-hidden">
            {admin?.profile_image && (
              <img src={getImageSrc(admin.profile_image)} alt="Profile" className="w-full h-full object-cover" />
            )}
          </div>
        </div>
        <div className="pt-12 p-6">
          <h2 className="text-2xl font-bold">{admin?.full_name}</h2>
          <p className="text-gray-600">
            {admin?.email} {"•"} <span className="text-blue-600 font-semibold">{admin?.role}</span>
          </p>
          <button onClick={() => setIsEditing(!isEditing)} className="mt-4 text-sm text-blue-600 hover:underline">
            {isEditing ? "Cancel Editing" : "Edit Profile & Settings"}
          </button>
          {profileMessage && <p className="mt-3 text-sm text-stone-600">{profileMessage}</p>}
        </div>
      </div>

      {isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form onSubmit={handleUpdate} className="bg-white p-6 shadow rounded-lg space-y-4">
            <h3 className="font-bold border-b pb-2">Update Information</h3>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Full Name"
              required
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Email"
              required
            />
            <label className="block text-xs text-gray-500">Profile Image</label>
            <input type="file" onChange={(e) => setFiles({ ...files, profile: e.target.files[0] })} className="text-sm" />
            <label className="block text-xs text-gray-500">Cover Image</label>
            <input type="file" onChange={(e) => setFiles({ ...files, cover: e.target.files[0] })} className="text-sm" />
            <button type="submit" disabled={savingProfile} className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60">
              {savingProfile ? "Saving..." : "Save Profile"}
            </button>
          </form>

          <form onSubmit={handlePasswordUpdate} className="bg-white p-6 shadow rounded-lg space-y-4">
            <h3 className="font-bold border-b pb-2">Security</h3>
            <input
              type="password"
              placeholder="Current Password"
              value={passwords.oldPassword}
              onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="password"
              placeholder="Re-type New Password"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
            {passwordMessage && <p className="text-sm text-stone-600">{passwordMessage}</p>}
            <button type="submit" disabled={savingPassword} className="w-full bg-gray-800 text-white py-2 rounded disabled:opacity-60">
              {savingPassword ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
