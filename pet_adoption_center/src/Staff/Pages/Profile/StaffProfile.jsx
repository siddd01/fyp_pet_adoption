import { Calendar, Camera, Mail, Phone, Save, User } from "lucide-react";
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
      } catch (err) {
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
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
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
                      : formData.image || "https://via.placeholder.com/150"
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

            {isEditing && (
              <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Save size={12} /> Note
                </p>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Profile photos are used for the staff directory. Ensure your photo is professional.
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Form Fields */}
          <div className="lg:col-span-2">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;