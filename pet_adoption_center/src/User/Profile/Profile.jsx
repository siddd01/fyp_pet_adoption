import { Calendar, Check, Edit2, Mail, Shield, User, X, AlertTriangle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { DEFAULT_PROFILE_IMAGE } from "../../constants/defaultImages";

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    image: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: "", text: "" });

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    if (dateString.includes("T") || dateString.includes("Z")) {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }
    }
    if (dateString.includes("-") && dateString.split("-")[0].length === 4) {
      return dateString.split("T")[0];
    }
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    return dateString;
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        date_of_birth: formatDateForInput(user.date_of_birth) || "",
        gender: user.gender || "",
        image: user.image || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormMessage({ type: "", text: "" });
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!localStorage.getItem("token")) return;
    setDisabled(true);
    if (!user) return;
    try {
      await updateUser(formData);
      setFormMessage({ type: "success", text: "Profile updated successfully." });
      setTimeout(() => setDisabled(false), 2000);
    } catch (err) {
      console.error(err);
      setDisabled(false);
      setFormMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update profile.",
      });
    }
  };

  if (!user)
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-stone-200 border-t-stone-600 animate-spin" />
          <p className="text-stone-400 text-xs tracking-widest uppercase">Loading</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-6">

        {/* Top label */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-stone-200" />
          <p className="text-xs tracking-[0.25em] uppercase text-stone-400">My Profile</p>
          <div className="flex-1 h-px bg-stone-200" />
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">

          {/* Subtle top stripe */}
          <div className="h-2 bg-stone-900" />

          <div className="px-8 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            {/* Avatar + Name */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={
                    formData.image instanceof File
                      ? URL.createObjectURL(formData.image)
                      : formData.image || DEFAULT_PROFILE_IMAGE
                  }
                  alt="Profile"
                  className="w-20 h-20 rounded-2xl border border-stone-200 shadow-sm object-cover"
                />
                {user.is_verified === 1 && (
                  <div className="absolute -bottom-1.5 -right-1.5 bg-teal-500 rounded-full p-1 border-2 border-white shadow">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-2xl font-serif text-stone-900 leading-tight">
                  {user.first_name} {user.last_name}
                </h1>
                <p className="flex items-center gap-1.5 text-stone-400 text-sm mt-1">
                  <Mail className="w-3.5 h-3.5" />
                  {user.email}
                </p>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition
                ${isEditing
                  ? "bg-white border-stone-300 text-stone-700 hover:border-stone-500"
                  : "bg-stone-900 border-stone-900 text-white hover:bg-stone-700"
                }`}
            >
              {isEditing ? <X size={15} /> : <Edit2 size={15} />}
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          <InfoCard icon={<Shield className="w-4 h-4" />} label="Role" value={user.role} />
          <InfoCard
            icon={<User className="w-4 h-4" />}
            label="Gender"
            value={user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : "Not set"}
          />
          <InfoCard
            icon={<Calendar className="w-4 h-4" />}
            label="Member Since"
            value={formatDateForDisplay(user.created_at)}
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-stone-100" />
            <p className="text-xs tracking-[0.25em] uppercase text-stone-400">Quick Actions</p>
            <div className="flex-1 h-px bg-stone-100" />
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/notifications")}
              className="flex items-center gap-3 p-4 border border-stone-200 rounded-xl hover:border-stone-400 hover:bg-stone-50 transition-all"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-stone-900">View Notifications</p>
                <p className="text-xs text-stone-500">Check adoption & report updates</p>
              </div>
            </button>
            
            <button
              onClick={() => navigate("/report-issue")}
              className="flex items-center gap-3 p-4 border border-stone-200 rounded-xl hover:border-red-400 hover:bg-red-50 transition-all"
            >
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-stone-900">Report an Issue</p>
                <p className="text-xs text-stone-500">Report technical or other problems</p>
              </div>
            </button>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm px-8 py-8">

            <div className="flex items-center gap-3 mb-8">
              <div className="flex-1 h-px bg-stone-100" />
              <p className="text-xs tracking-[0.25em] uppercase text-stone-400">Edit Details</p>
              <div className="flex-1 h-px bg-stone-100" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {formMessage.text && (
                <div
                  className={`rounded-xl border px-4 py-3 text-sm ${
                    formMessage.type === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {formMessage.text}
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-5">
                <Input
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="First name"
                />
                <Input
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Last name"
                />
              </div>

              <Input
                label="Date of Birth"
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
              />

              <div>
                <label className="block text-xs font-medium tracking-wide uppercase text-stone-500 mb-2">
                  Gender
                </label>
                <select
                  className="w-full border border-stone-200 bg-stone-50 p-3 rounded-xl text-stone-800 text-sm focus:border-stone-500 focus:ring-2 focus:ring-stone-100 transition-all outline-none"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium tracking-wide uppercase text-stone-500 mb-2">
                  Profile Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                  className="w-full border border-stone-200 bg-stone-50 p-3 rounded-xl text-sm text-stone-600
                    file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0
                    file:text-xs file:font-semibold file:bg-stone-900 file:text-white
                    hover:file:bg-stone-700 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={!localStorage.getItem("token") || disabled}
                className={`w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide transition shadow-sm
                  ${disabled
                    ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                    : "bg-stone-900 text-white hover:bg-stone-700"
                  }`}
              >
                {disabled ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

/* Helper components */
const InfoCard = ({ icon, label, value }) => (
  <div className="bg-white rounded-2xl border border-stone-100 shadow-sm px-6 py-5 flex items-center gap-4 hover:shadow-md transition cursor-default">
    <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center text-stone-500">
      {icon}
    </div>
    <div>
      <p className="text-xs text-stone-400 font-medium uppercase tracking-wide">{label}</p>
      <p className="font-semibold text-stone-800 text-sm mt-0.5">{value}</p>
    </div>
  </div>
);

const Input = ({ label, placeholder, ...props }) => (
  <div>
    <label className="block text-xs font-medium tracking-wide uppercase text-stone-500 mb-2">
      {label}
    </label>
    <input
      {...props}
      placeholder={placeholder}
      className="w-full border border-stone-200 bg-stone-50 p-3 rounded-xl text-stone-800 text-sm focus:border-stone-500 focus:ring-2 focus:ring-stone-100 transition-all outline-none"
    />
  </div>
);

export default Profile;
