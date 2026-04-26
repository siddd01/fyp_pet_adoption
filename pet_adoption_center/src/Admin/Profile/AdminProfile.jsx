import { Camera, KeyRound, Mail, Save, Shield, User } from "lucide-react";
import { useContext, useEffect, useMemo, useState } from "react";
import PetLoader from "../../Components/PetLoader";
import { AdminAuthContext } from "../../Context/AdminAuthContext";
import { DEFAULT_SITE_IMAGE } from "../../constants/defaultImages";
import { getOptionalImageSrc, getProfileImageSrc } from "../../utils/imageHelpers";
import { PASSWORD_REQUIREMENTS, validatePassword } from "../../utils/passwordPolicy";

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

  useEffect(() => {
    fetchAdminProfile().catch((error) => {
      setProfileMessage(error);
    });
  }, [fetchAdminProfile]);

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

    const passwordValidation = validatePassword(passwords.newPassword);
    if (!passwordValidation.valid) {
      setPasswordMessage(passwordValidation.message);
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

  const profilePreview = useMemo(() => {
    if (files.profile instanceof File) {
      return URL.createObjectURL(files.profile);
    }
    return getProfileImageSrc(admin?.profile_image);
  }, [admin?.profile_image, files.profile]);

  const coverPreview = useMemo(() => {
    if (files.cover instanceof File) {
      return URL.createObjectURL(files.cover);
    }
    return getOptionalImageSrc(admin?.cover_image) || DEFAULT_SITE_IMAGE;
  }, [admin?.cover_image, files.cover]);

  if (AdminProfileLoading && !admin) return <PetLoader />;

  return (
    <div className="min-h-screen bg-[#fbfaf8] p-6 lg:p-10">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="h-px w-8 bg-stone-300"></span>
              <p className="text-[10px] font-bold tracking-[0.3em] text-stone-400 uppercase">
                Admin Settings
              </p>
            </div>
            <h1 className="text-4xl md:text-5xl font-medium text-stone-900 tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
              Admin <span className="italic text-stone-500">Profile</span>
            </h1>
          </div>

          <button
            onClick={() => setIsEditing((prev) => !prev)}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              isEditing
                ? "bg-stone-100 text-stone-600 hover:bg-stone-200"
                : "bg-stone-900 text-white shadow-lg shadow-stone-200 hover:bg-stone-800"
            }`}
          >
            {isEditing ? "Discard Changes" : "Edit Profile"}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-4xl border border-stone-100 overflow-hidden shadow-sm">
              <div className="relative h-40">
                <img src={coverPreview} alt="Cover" className="h-full w-full object-cover" />
                {isEditing && (
                  <label className="absolute right-4 top-4 rounded-2xl bg-white/90 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-700 shadow-sm cursor-pointer">
                    Change Cover
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => setFiles((prev) => ({ ...prev, cover: e.target.files?.[0] || null }))}
                    />
                  </label>
                )}
              </div>

              <div className="px-8 pb-8">
                <div className="-mt-16 relative inline-block mb-5">
                  <img
                    src={profilePreview}
                    alt={admin?.full_name || "Admin"}
                    className="w-32 h-32 rounded-4xl object-cover border-4 border-white shadow-lg bg-stone-100"
                  />
                  {isEditing && (
                    <label className="absolute bottom-2 right-2 p-2.5 bg-stone-900 text-white rounded-2xl cursor-pointer hover:scale-110 transition-transform shadow-xl">
                      <Camera size={18} />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => setFiles((prev) => ({ ...prev, profile: e.target.files?.[0] || null }))}
                      />
                    </label>
                  )}
                </div>

                <h2 className="text-2xl font-serif text-stone-900 mb-1">{admin?.full_name || "Admin"}</h2>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-4">
                  {admin?.role || "Administrator"}
                </p>

                <div className="pt-5 border-t border-stone-50 space-y-3">
                  <div className="flex items-center gap-3 text-stone-500 text-sm italic">
                    <Mail size={14} className="shrink-0" />
                    <span className="truncate">{admin?.email}</span>
                  </div>
                </div>
              </div>
            </div>

          
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-stone-100 p-8 lg:p-12 shadow-sm">
              {profileMessage && (
                <div className="mb-8 bg-rose-50 border-l-2 border-rose-500 p-4 text-rose-700 text-xs font-semibold uppercase tracking-wider">
                  {profileMessage}
                </div>
              )}

              <form onSubmit={handleUpdate} className="space-y-8">
                <div className="flex items-center gap-3">
                  <User size={18} className="text-stone-400" />
                  <h3 className="text-xl font-serif text-stone-900">Profile Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { label: "Full Name", value: fullName, setValue: setFullName, type: "text", required: true, icon: <User size={16} /> },
                    { label: "Email Address", value: email, setValue: setEmail, type: "email", required: true, icon: <Mail size={16} /> },
                  ].map((field) => (
                    <div key={field.label} className="space-y-2">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] ml-1">
                        {field.label}
                      </label>
                      {isEditing ? (
                        <div className="relative group">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-stone-800 transition-colors">
                            {field.icon}
                          </span>
                          <input
                            type={field.type}
                            value={field.value}
                            onChange={(e) => field.setValue(e.target.value)}
                            required={field.required}
                            className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-100 rounded-2xl focus:bg-white focus:border-stone-800 outline-none transition-all text-sm text-stone-800 font-medium"
                          />
                        </div>
                      ) : (
                        <div className="px-5 py-3.5 bg-stone-50/50 rounded-2xl border border-stone-50 text-sm text-stone-700 font-medium">
                          {field.value || "—"}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {isEditing && (
                  <div className="pt-8 border-t border-stone-50 flex justify-end">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="flex items-center gap-3 px-10 py-4 bg-stone-900 text-white rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-stone-800 transition-all disabled:opacity-50"
                    >
                      {savingProfile ? (
                        <div className="w-4 h-4 border-2 border-stone-400 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Save size={16} />
                      )}
                      Save Profile
                    </button>
                  </div>
                )}
              </form>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-stone-100 p-8 lg:p-12 shadow-sm">
              {passwordMessage && (
                <div className="mb-8 bg-stone-100 border-l-2 border-stone-700 p-4 text-stone-700 text-xs font-semibold uppercase tracking-wider">
                  {passwordMessage}
                </div>
              )}

              <form onSubmit={handlePasswordUpdate} className="space-y-8">
                <div className="flex items-center gap-3">
                  <KeyRound size={18} className="text-stone-400" />
                  <h3 className="text-xl font-serif text-stone-900">Security</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { label: "Current Password", name: "oldPassword", type: "password" },
                    { label: "New Password", name: "newPassword", type: "password" },
                    { label: "Confirm Password", name: "confirmPassword", type: "password" },
                  ].map((field) => (
                    <div key={field.name} className={`space-y-2 ${field.name === "confirmPassword" ? "md:col-span-2" : ""}`}>
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] ml-1">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        value={passwords[field.name]}
                        onChange={(e) => setPasswords((prev) => ({ ...prev, [field.name]: e.target.value }))}
                        autoComplete={field.name === "oldPassword" ? "current-password" : "new-password"}
                        className="w-full px-5 py-3 bg-stone-50 border border-stone-100 rounded-2xl focus:bg-white focus:border-stone-800 outline-none transition-all text-sm text-stone-800 font-medium"
                        required
                      />
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-500">
                  {PASSWORD_REQUIREMENTS}
                </div>

                <div className="pt-8 border-t border-stone-50 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="flex items-center gap-3 px-10 py-4 bg-stone-900 text-white rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-stone-800 transition-all disabled:opacity-50"
                  >
                    {savingPassword ? (
                      <div className="w-4 h-4 border-2 border-stone-400 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Shield size={16} />
                    )}
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
