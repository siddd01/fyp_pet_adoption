import { Calendar, Edit2, Mail, Phone, Save, User, X } from "lucide-react";
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

  if (!staff) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <p className="text-red-600 text-lg">Failed to load profile</p>
          {error && <p className="text-gray-600 mt-2">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 transition-all hover:shadow-2xl">
          <div className="h-36 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 relative">
            <div className="absolute inset-0 bg-black opacity-10"></div>
          </div>

          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-20">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                <div className="relative group">
                  <img
                    src={
                      formData.image instanceof File
                        ? URL.createObjectURL(formData.image)
                        : formData.image || "https://via.placeholder.com/150"
                    }
                    alt="Profile"
                    className="w-36 h-36 rounded-full border-4 border-white shadow-2xl object-cover transition-transform group-hover:scale-105"
                  />
                </div>

                <div className="text-center md:text-left mb-4 md:mb-0">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {staff.first_name} {staff.last_name}
                  </h1>
                  <p className="flex items-center justify-center md:justify-start gap-2 text-gray-600 mt-2">
                    <Mail className="w-4 h-4" />
                    {staff.email}
                  </p>
                  <p className="flex items-center justify-center md:justify-start gap-2 text-gray-500 mt-1 text-sm">
                    <User className="w-4 h-4" />
                    {staff.role}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="mt-4 md:mt-0 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium shadow-md"
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                ) : (
                  <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                    {staff.first_name}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                ) : (
                  <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                    {staff.last_name}
                  </p>
                )}
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email
                </label>
                <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-600">
                  {staff.email}
                </p>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                ) : (
                  <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                    {staff.phone_number || "Not provided"}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date of Birth
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                ) : (
                  <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                    {formatDateForDisplay(staff.date_of_birth) || "Not provided"}
                  </p>
                )}
              </div>

              {/* Role (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Role
                </label>
                <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                  {staff.role}
                </p>
              </div>
            </div>

            {/* Profile Image Upload */}
            {isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload a new profile image (JPG, PNG, max 2MB)
                </p>
              </div>
            )}

            {/* Submit Button */}
            {isEditing && (
              <div className="flex justify-end gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      first_name: staff.first_name || "",
                      last_name: staff.last_name || "",
                      phone_number: staff.phone_number || "",
                      date_of_birth: formatDateForInput(staff.date_of_birth) || "",
                      image: staff.profile_image || "",
                    });
                    setError("");
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
