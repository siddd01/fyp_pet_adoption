import { Calendar, Check, Edit2, Mail, Shield, User, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext.jsx";

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

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        date_of_birth: user.date_of_birth || "",
        gender: user.gender || "",
        image: user.image || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ UPDATED: use FormData
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("first_name", formData.first_name);
      data.append("last_name", formData.last_name);
      data.append("date_of_birth", formData.date_of_birth);
      data.append("gender", formData.gender);

      if (formData.image instanceof File) {
        data.append("image", formData.image);
      }

      await updateUser(data);
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      date_of_birth: user.date_of_birth || "",
      gender: user.gender || "",
      image: user.image || "",
    });
    setIsEditing(false);
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>

          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {/* ✅ UPDATED IMAGE PREVIEW */}
                  <img
                    src={
                      formData.image instanceof File
                        ? URL.createObjectURL(formData.image)
                        : formData.image || "https://via.placeholder.com/150"
                    }
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                  />
                  {user.is_verified === 1 && (
                    <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-2 border-4 border-white">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                <div>
                  <h1 className="text-3xl font-bold">
                    {user.first_name} {user.last_name}
                  </h1>
                  <p className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg"
              >
                {isEditing ? <X size={16} /> : <Edit2 size={16} />}
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <InfoCard icon={<Shield />} label="Role" value={user.role} />
          <InfoCard icon={<User />} label="Gender" value={user.gender || "Not set"} />
          <InfoCard
            icon={<Calendar />}
            label="Member Since"
            value={new Date(user.created_at).toLocaleDateString()}
          />
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div className="mt-6 bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} />
              <Input label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} />

              <Input label="Date of Birth" type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} />

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              {/* ✅ FILE INPUT */}
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.files[0] })
                }
                className="w-full border p-3 rounded-lg"
              />

              <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
                Save Changes
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

/* Small helper components */
const InfoCard = ({ icon, label, value }) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
    <div className="bg-blue-100 p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm mb-2">{label}</label>
    <input {...props} className="w-full border p-3 rounded-lg" />
  </div>
);

export default Profile;
