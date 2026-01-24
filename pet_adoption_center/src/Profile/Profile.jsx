import { Calendar, Check, Edit2, Mail, Shield, User, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  
  // Initialize with default empty values to avoid undefined
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    date_of_birth: "",
    gender: "",
    image: "",
    role: "",
    is_verified: 0,
    created_at: ""
  });
  
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        date_of_birth: user.date_of_birth || "",
        gender: user.gender || "",
        image: user.image || "",
        role: user.role || "",
        is_verified: user.is_verified || 0,
        created_at: user.created_at || ""
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(formData);
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Update error:", err);
      alert(`Failed to update profile: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      date_of_birth: user.date_of_birth || "",
      gender: user.gender || "",
      image: user.image || "",
      role: user.role || "",
      is_verified: user.is_verified || 0,
      created_at: user.created_at || ""
    });
    setIsEditing(false);
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-4">
                <div className="relative">
                  <img
                    src={formData.image || "https://via.placeholder.com/150"}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                  />
                  {user.is_verified === 1 && (
                    <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-2 border-4 border-white">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
                <div className="text-center md:text-left mb-4 md:mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {user.first_name} {user.last_name}
                  </h1>
                  <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2 mt-1">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4" /> Cancel
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4" /> Edit Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Info Cards */}
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
            <div className="bg-blue-100 rounded-full p-3">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Role</p>
              <p className="font-semibold text-gray-900">{user.role}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
            <div className="bg-purple-100 rounded-full p-3">
              <User className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Gender</p>
              <p className="font-semibold text-gray-900">{user.gender || "Not set"}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
            <div className="bg-green-100 rounded-full p-3">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Member Since</p>
              <p className="font-semibold text-gray-900">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div className="mt-6 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Edit Profile Information
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Last Name"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;