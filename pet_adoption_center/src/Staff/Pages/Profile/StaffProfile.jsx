import { Calendar, Camera, Clock3, KeyRound, Mail, Phone, Save, Shield, ShieldAlert, User } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StaffContext } from "../../../Context/StaffContext";
import { DEFAULT_PROFILE_IMAGE } from "../../../constants/defaultImages";
import { formatDuration, getBlockTimeLeft } from "../../../utils/otpSecurity";
import { PASSWORD_REQUIREMENTS, validatePassword } from "../../../utils/passwordPolicy";

const MAX_PASSWORD_TRIES = 3;

const StaffProfile = () => {
  const { staff, fetchStaffProfile, updateStaffProfile, changeStaffPassword } = useContext(StaffContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    date_of_birth: "",
    image: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState("");
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [remainingTries, setRemainingTries] = useState(MAX_PASSWORD_TRIES);
  const [blockedUntil, setBlockedUntil] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "Not provided";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        await fetchStaffProfile();
      } catch {
        setError("Failed to load profile");
      } finally {
        setProfileLoading(false);
      }
    };
    loadProfile();
  }, [fetchStaffProfile]);

  useEffect(() => {
    if (staff) {
      setFormData({
        first_name: staff.first_name || "",
        last_name: staff.last_name || "",
        phone_number: staff.phone_number || "",
        date_of_birth: formatDateForInput(staff.date_of_birth) || "",
        image: staff.profile_image || "",
      });
    }
  }, [staff]);

  useEffect(() => {
    const nextTime = getBlockTimeLeft(blockedUntil);
    setTimeLeft(nextTime);

    if (!nextTime) return undefined;

    const interval = setInterval(() => {
      const updated = getBlockTimeLeft(blockedUntil);
      setTimeLeft(updated);

      if (!updated) {
        setBlockedUntil(null);
        setRemainingTries(MAX_PASSWORD_TRIES);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [blockedUntil]);

  const isPasswordBlocked = timeLeft > 0;
  const blockedTimerText = formatDuration(timeLeft);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("first_name", formData.first_name);
      data.append("last_name", formData.last_name);
      data.append("phone_number", formData.phone_number);
      data.append("date_of_birth", formData.date_of_birth);
      if (formData.image instanceof File) data.append("image", formData.image);

      await updateStaffProfile(data);
      setIsEditing(false);
      await fetchStaffProfile();
    } catch (err) {
      setError(err.message || err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const applyPasswordResponse = (data = {}, fallbackMessage = "Failed to change password.") => {
    setRemainingTries(
      Number.isFinite(Number(data.remainingTries))
        ? Number(data.remainingTries)
        : MAX_PASSWORD_TRIES
    );
    setBlockedUntil(data.blockedUntil || null);
    setPasswordMessage(data.message || fallbackMessage);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (isPasswordBlocked) return;

    setPasswordLoading(true);
    setPasswordMessage("");

    const passwordValidation = validatePassword(passwords.newPassword);
    if (!passwordValidation.valid) {
      setPasswordMessage(passwordValidation.message);
      setPasswordLoading(false);
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMessage("Passwords do not match.");
      setPasswordLoading(false);
      return;
    }

    try {
      await changeStaffPassword(passwords);
      setPasswordMessage("Password updated successfully.");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setRemainingTries(MAX_PASSWORD_TRIES);
      setBlockedUntil(null);
    } catch (err) {
      applyPasswordResponse(err.response?.data, err.response?.data?.message || err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf8]">
        <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfaf8] p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="h-px w-8 bg-stone-300"></span>
              <p className="text-[10px] font-bold tracking-[0.3em] text-stone-400 uppercase">
                Account Settings
              </p>
            </div>
            <h1 className="text-4xl md:text-5xl font-medium text-stone-900 tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
              My <span className="italic text-stone-500">Profile</span>
            </h1>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
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
          
          {/* Left Column: Avatar & Quick Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[2rem] border border-stone-100 p-8 text-center shadow-sm">
              <div className="relative inline-block mb-6">
                <img
                  src={
                    formData.image instanceof File
                      ? URL.createObjectURL(formData.image)
                      : formData.image || DEFAULT_PROFILE_IMAGE
                  }
                  alt="Profile"
                  className="w-40 h-40 rounded-[2.5rem] object-cover border-4 border-stone-50 shadow-inner"
                />
                {isEditing && (
                  <label className="absolute bottom-2 right-2 p-2.5 bg-stone-900 text-white rounded-2xl cursor-pointer hover:scale-110 transition-transform shadow-xl">
                    <Camera size={18} />
                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                  </label>
                )}
              </div>
              
              <h2 className="text-2xl font-serif text-stone-900 mb-1">
                {staff.first_name} {staff.last_name}
              </h2>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-4">
                {staff.role}
              </p>
              
              <div className="pt-6 border-t border-stone-50 space-y-3">
                <div className="flex items-center gap-3 text-stone-500 text-sm italic">
                  <Mail size={14} className="shrink-0" />
                  <span className="truncate">{staff.email}</span>
                </div>
              </div>
            </div>

           
          </div>

          {/* Right Column: Form Fields */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-stone-100 p-8 lg:p-12 shadow-sm">
              {error && (
                <div className="mb-8 bg-rose-50 border-l-2 border-rose-500 p-4 text-rose-700 text-xs font-semibold uppercase tracking-wider">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Field Wrapper Component */}
                  {[
                    { label: "First Name", name: "first_name", type: "text", icon: <User size={16}/>, required: true },
                    { label: "Last Name", name: "last_name", type: "text", icon: <User size={16}/>, required: true },
                    { label: "Phone Number", name: "phone_number", type: "tel", icon: <Phone size={16}/> },
                    { label: "Date of Birth", name: "date_of_birth", type: "date", icon: <Calendar size={16}/> },
                  ].map((field) => (
                    <div key={field.name} className="space-y-2">
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
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            required={field.required}
                            className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-100 rounded-2xl focus:bg-white focus:border-stone-800 outline-none transition-all text-sm text-stone-800 font-medium"
                          />
                        </div>
                      ) : (
                        <div className="px-5 py-3.5 bg-stone-50/50 rounded-2xl border border-stone-50 text-sm text-stone-700 font-medium">
                          {field.name === 'date_of_birth' 
                            ? formatDateForDisplay(staff[field.name]) 
                            : staff[field.name] || "—"}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Read Only Email */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] ml-1">
                      System Email
                    </label>
                    <div className="px-5 py-3.5 bg-stone-100/50 rounded-2xl text-sm text-stone-400 font-medium cursor-not-allowed">
                      {staff.email}
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="pt-8 border-t border-stone-50 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-3 px-10 py-4 bg-stone-900 text-white rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-stone-800 transition-all disabled:opacity-50"
                    >
                      {loading ? (
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

              <form onSubmit={handlePasswordSubmit} className="space-y-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <KeyRound size={18} className="text-stone-400" />
                    <h3 className="text-xl font-serif text-stone-900">Security</h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate("/staff/forgot-password")}
                    className="rounded-2xl border border-stone-300 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-700 hover:border-stone-900 hover:text-stone-900 transition"
                  >
                    Forgot Password
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400 flex items-center gap-2">
                      <ShieldAlert size={14} />
                      Remaining Tries
                    </p>
                    <p className={`mt-3 text-3xl font-black ${remainingTries === 0 ? "text-red-600" : "text-stone-900"}`}>{remainingTries}</p>
                  </div>
                  <div className={`rounded-2xl border px-4 py-4 ${isPasswordBlocked ? "border-red-200 bg-red-50" : "border-stone-200 bg-stone-50"}`}>
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400 flex items-center gap-2">
                      <Clock3 size={14} />
                      Block Timer
                    </p>
                    <p className={`mt-3 text-2xl font-black ${isPasswordBlocked ? "text-red-600" : "text-stone-500"}`}>
                      {isPasswordBlocked ? blockedTimerText : "Ready"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { label: "Current Password", name: "currentPassword", type: "password" },
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
                        autoComplete={field.name === "currentPassword" ? "current-password" : "new-password"}
                        className="w-full px-5 py-3 bg-stone-50 border border-stone-100 rounded-2xl focus:bg-white focus:border-stone-800 outline-none transition-all text-sm text-stone-800 font-medium"
                        disabled={isPasswordBlocked}
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
                    disabled={passwordLoading || isPasswordBlocked}
                    className="flex items-center gap-3 px-10 py-4 bg-stone-900 text-white rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-stone-800 transition-all disabled:opacity-50"
                  >
                    {passwordLoading ? (
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

export default StaffProfile;
