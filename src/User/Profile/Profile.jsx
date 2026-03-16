import { Calendar, Check, Edit2, Mail, Shield, User, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext.jsx";

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    image: "", // can be URL or File
  });

  const [isEditing, setIsEditing] = useState(false);
  const [disabled, setDisabled] = useState(false);

  // Convert dd/mm/yyyy to yyyy-mm-dd for input
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    
    // Handle ISO date string (2026-01-02T18:15:00.000Z)
    if (dateString.includes("T") || dateString.includes("Z")) {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }
    }
    
    // If already in yyyy-mm-dd format, return as is
    if (dateString.includes("-") && dateString.split("-")[0].length === 4) {
      return dateString.split("T")[0]; // Remove time part if exists
    }
    
    // Convert dd/mm/yyyy to yyyy-mm-dd
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    
    return dateString;
  };

  // Convert yyyy-mm-dd to dd/mm/yyyy for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    
    // Parse the date (handles both ISO and yyyy-mm-dd formats)
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    console.log("profile dayta", user);
    if (user) {
      console.log("User data loaded:", user);
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!localStorage.getItem("token")) return;

    setDisabled(true);

    if (!user) {
      console.error("User not loaded yet");
      return;
    }

    try {
      await updateUser(formData);
      setTimeout(() => {
        setDisabled(false);
      }, 2000);
      alert("Profile updated");
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading your profile...</p>
      </div>
    </div>
  );

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
                  {user.is_verified === 1 && (
                    <div className="absolute bottom-2 right-2 bg-green-500 rounded-full p-2.5 border-4 border-white shadow-lg">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                <div className="text-center md:text-left mb-4 md:mb-0">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {user.first_name} {user.last_name}
                  </h1>
                  <p className="flex items-center justify-center md:justify-start gap-2 text-gray-600 mt-2">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="mt-4 md:mt-0 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 font-medium"
              >
                {isEditing ? <X size={18} /> : <Edit2 size={18} />}
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <InfoCard 
            icon={<Shield className="w-6 h-6" />} 
            label="Role" 
            value={user.role} 
            color="blue"
          />
          <InfoCard
            icon={<User className="w-6 h-6" />}
            label="Gender"
            value={user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : "Not set"}
            color="purple"
          />
          <InfoCard
            icon={<Calendar className="w-6 h-6" />}
            label="Member Since"
            value={formatDateForDisplay(user.created_at)}
            color="pink"
          />
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div className="mt-6 bg-white rounded-2xl shadow-xl p-8 transition-all">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Your Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Input 
                  label="First Name" 
                  name="first_name" 
                  value={formData.first_name} 
                  onChange={handleChange}
                  placeholder="Enter your first name"
                />
                <Input 
                  label="Last Name" 
                  name="last_name" 
                  value={formData.last_name} 
                  onChange={handleChange}
                  placeholder="Enter your last name"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.files[0] })
                  }
                  className="w-full border-2 border-gray-200 p-3 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={!localStorage.getItem("token")}
                className={`w-full py-4 rounded-lg text-white font-semibold text-lg transition-all shadow-lg
                  ${disabled 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:scale-[1.02]"
                  }
                `}
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

/* Small helper components */
const InfoCard = ({ icon, label, value, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    pink: "bg-pink-50 text-pink-600"
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-gray-100">
      <div className="flex items-center gap-4">
        <div className={`${colorClasses[color]} p-4 rounded-xl`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="font-bold text-gray-800 text-lg">{value}</p>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, placeholder, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input 
      {...props} 
      placeholder={placeholder}
      className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" 
    />
  </div>
);

export default Profile;