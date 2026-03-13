import { Edit2, Mail, Save, User, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { StaffContext } from "../../../Context/StaffContext";

const StaffProfile = () => {
  const { staff, fetchStaffProfile, updateStaffProfile } = useContext(StaffContext);

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

  // Convert date to yyyy-mm-dd format for input
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
    
    return dateString;
  };

  // Convert date to dd/mm/yyyy for display
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
    const loadProfile = async () => {
      try {
        await fetchStaffProfile();
      } catch (err) {
        setError(err.message || err.toString() || "Failed to load profile");
        console.error("Profile load error:", err);
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
    setError("");

    try {
      const data = new FormData();
      data.append("first_name", formData.first_name);
      data.append("last_name", formData.last_name);
      if (formData.phone_number) {
        data.append("phone_number", formData.phone_number);
      }
      if (formData.date_of_birth) {
        data.append("date_of_birth", formData.date_of_birth);
      }
      
      if (formData.image instanceof File) {
        data.append("image", formData.image);
        console.log("Image file added:", formData.image.name, formData.image.size);
      }

      console.log("Submitting profile update...");
      const result = await updateStaffProfile(data);
      console.log("Profile update successful:", result);
      
      setIsEditing(false);
      setError("");
      alert("✅ Profile updated successfully");
      
      // Reload profile to get updated data
      await fetchStaffProfile();
    } catch (err) {
      console.error("Update error details:", err);
      console.error("Error response:", err.response);
      const errorMessage = err.response?.data?.message || err.message || err.toString() || "Failed to update profile";
      setError(errorMessage);
      alert(`❌ Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 px-10 py-12">
      <div className="max-w-6xl mx-auto">

        {/* Page Header */}
        <div className="mb-9">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-1.5">
            Staff Account
          </p>
          <h1 className="text-4xl font-serif text-stone-900 leading-tight">
            Profile & Account Details
          </h1>
        </div>

        {/* Three-column layout (2 + 1) */}
        <div className="grid grid-cols-3 gap-7 items-start">

          {/* LEFT — Main profile card (2/3) */}
          <div className="col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Accent bar */}
            <div className="h-1 bg-gradient-to-r from-blue-700 to-blue-500" />

            <div className="p-9">
              {/* Top: Avatar + basic info + edit button */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border border-gray-200 overflow-hidden bg-stone-100 flex items-center justify-center">
                      <img
                        src={
                          formData.image instanceof File
                            ? URL.createObjectURL(formData.image)
                            : formData.image || "https://via.placeholder.com/150"
                        }
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-1.5">
                      Signed in as
                    </p>
                    <h2 className="text-2xl font-semibold text-stone-900 leading-snug">
                      {staff.first_name} {staff.last_name}
                    </h2>
                    <p className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Mail className="w-3.5 h-3.5" />
                      {staff.email}
                    </p>
                    <p className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                      <User className="w-3.5 h-3.5" />
                      {staff.role}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="self-start inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-stone-800 bg-white hover:bg-stone-50 hover:border-stone-300 transition"
                >
                  {isEditing ? (
                    <>
                      <X className="w-3.5 h-3.5" />
                      Cancel editing
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit profile
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-700">
                  {error}
                </div>
              )}

              {/* Form sections */}
              <form onSubmit={handleSubmit} className="space-y-8">

                {/* Section: Basic Details */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-xs font-bold tracking-widest text-gray-400 uppercase whitespace-nowrap">
                      Basic Details
                    </span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* First Name */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        First Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          required
                          className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-stone-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition"
                        />
                      ) : (
                        <div className="w-full px-3.5 py-2.5 text-sm border border-gray-100 rounded-lg bg-stone-50 text-gray-600">
                          {staff.first_name}
                        </div>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Last Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          required
                          className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-stone-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition"
                        />
                      ) : (
                        <div className="w-full px-3.5 py-2.5 text-sm border border-gray-100 rounded-lg bg-stone-50 text-gray-600">
                          {staff.last_name}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Email (read-only) */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Email
                      </label>
                      <div className="w-full px-3.5 py-2.5 text-sm border border-gray-100 rounded-lg bg-stone-50 text-gray-500 cursor-default">
                        {staff.email}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">
                        Email cannot be changed from this screen.
                      </p>
                    </div>

                    {/* Role (read-only) */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Role
                      </label>
                      <div className="w-full px-3.5 py-2.5 text-sm border border-gray-100 rounded-lg bg-stone-50 text-gray-600 cursor-default">
                        {staff.role}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Contact & Personal */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-xs font-bold tracking-widest text-gray-400 uppercase whitespace-nowrap">
                      Contact & Personal
                    </span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleChange}
                          placeholder="+1 (555) 000-0000"
                          className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-stone-800 placeholder-gray-300 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition"
                        />
                      ) : (
                        <div className="w-full px-3.5 py-2.5 text-sm border border-gray-100 rounded-lg bg-stone-50 text-gray-600">
                          {staff.phone_number || "Not provided"}
                        </div>
                      )}
                    </div>

                    {/* DOB */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Date of Birth
                      </label>
                      {isEditing ? (
                        <input
                          type="date"
                          name="date_of_birth"
                          value={formData.date_of_birth}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-stone-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition"
                        />
                      ) : (
                        <div className="w-full px-3.5 py-2.5 text-sm border border-gray-100 rounded-lg bg-stone-50 text-gray-600">
                          {formatDateForDisplay(staff.date_of_birth) || "Not provided"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section: Profile Image */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-xs font-bold tracking-widest text-gray-400 uppercase whitespace-nowrap">
                      Profile Image
                    </span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>

                  {isEditing ? (
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Upload New Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-stone-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
                      />
                      <p className="text-[11px] text-gray-400 mt-1.5">
                        JPG or PNG, up to 2MB. Your image is stored securely using Cloudinary.
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">
                      Use “Edit profile” to upload a new profile picture.
                    </p>
                  )}
                </div>

                {/* Submit row */}
                {isEditing && (
                  <div className="flex justify-end pt-3 border-t border-gray-100">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center gap-2 px-7 py-2.5 bg-stone-900 hover:bg-stone-700 disabled:bg-gray-300 text-white text-xs font-semibold rounded-xl transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          Save changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* RIGHT — Sidebar (1/3) */}
          <div className="col-span-1 flex flex-col gap-4">
            {/* Intro card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-700 to-blue-500" />
              <div className="p-6">
                <div className="text-3xl mb-3">👤</div>
                <h3 className="font-serif text-xl text-stone-900 mb-2">
                  Keep your details current
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Accurate profile information helps the admin team contact you
                  quickly about pet updates, adoption requests, and store
                  management tasks.
                </p>
              </div>
            </div>

            {/* Info about edits */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-4">
              <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1.5">
                ℹ️ Profile edits
              </p>
              <p className="text-xs text-blue-900 leading-relaxed">
                Your <strong>name</strong>, <strong>phone number</strong>, and{" "}
                <strong>date of birth</strong> can be updated here. Your{" "}
                <strong>email</strong> and <strong>role</strong> are managed by
                the admin.
              </p>
            </div>

            {/* What to keep in mind */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">
                Good to know
              </p>
              <div className="space-y-4">
                <div className="flex gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-xs font-bold text-blue-700 shrink-0">
                    01
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-800 mb-0.5">
                      Cloud-based images
                    </p>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Profile photos are stored securely via Cloudinary, so they
                      load fast across the dashboard.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-xs font-bold text-blue-700 shrink-0">
                    02
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-800 mb-0.5">
                      Contact visibility
                    </p>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Only authorized admin users can see your full contact
                      details inside the management tools.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-xs font-bold text-blue-700 shrink-0">
                    03
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-800 mb-0.5">
                      Need changes to role?
                    </p>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Contact an admin if your responsibilities change and you
                      need your role updated.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-8">
          Changes to your profile are effective immediately across the staff
          dashboard.
        </p>

      </div>
    </div>
  );
};

export default StaffProfile;
