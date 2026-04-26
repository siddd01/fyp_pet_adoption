import { Loader2, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { PASSWORD_REQUIREMENTS, validatePassword } from "../../../utils/passwordPolicy";

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // NEW: State for Edit Mode
  const [editMode, setEditMode] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState(null);

  const [formData, setFormData] = useState({
    first_name: "", 
    last_name: "", 
    email: "", 
    password: "", 
    phone_number: "", 
    date_of_birth: "",
    status: "ACTIVE"
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      
      const res = await api.get("/staff/get-staff", {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
      });
      console.log(res.data)
      setStaffList(res.data);
    } catch (err) {
      
      console.error("Fetch failed", err);
    }
  };

  const resetForm = () => {
    setEditMode(false);
    setSelectedStaffId(null);
    setFormData({ 
      first_name: "", 
      last_name: "", 
      email: "", 
      password: "", 
      phone_number: "", 
      date_of_birth: "", 
      status: "ACTIVE" 
    });
  };

  const handleEditClick = (staff) => {
    setEditMode(true);
    setSelectedStaffId(staff.staff_id);
    setFormData({
      first_name: staff.first_name,
      last_name: staff.last_name,
      email: staff.email,
      password: "", // Security: don't load the hashed password
      phone_number: staff.phone_number || "",
      date_of_birth: staff.date_of_birth ? staff.date_of_birth.split('T')[0] : "",
      status: staff.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");

    if (!editMode) {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.valid) {
        window.appAlert(passwordValidation.message, { icon: "error" });
        return;
      }
    }

    setLoading(true);

    try {
     // ... inside handleSubmit
if (editMode) {
  // MUST match: router.put("/admin-update/:staff_id", ...) in staffRoutes
  await api.put(`/staff/admin-update/${selectedStaffId}`, formData, {
    headers: { Authorization: `Bearer ${token}` }
  });
} else {
  // MUST match: router.post("/admin-create", ...) in staffRoutes
  await api.post("/staff/admin-create", formData, {
    headers: { Authorization: `Bearer ${token}` }
  });
}
      
      setIsModalOpen(false);
      window.appAlert(editMode ? "Staff details updated successfully." : "Staff created successfully.");
      fetchStaff();
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = await window.appConfirm({
      title: "Delete staff member?",
      text: "This will permanently remove the selected staff account.",
      confirmButtonText: "Continue",
      cancelButtonText: "Cancel",
    });
    if (!isConfirmed) return;

    const adminPassword = await window.appPrompt({
      title: "Admin password required",
      text: "Enter your admin password to authorize this deletion.",
      input: "password",
      inputLabel: "Admin password",
      inputPlaceholder: "Enter your password",
      preserveWhitespace: true,
      confirmButtonText: "Delete Staff",
      cancelButtonText: "Keep Staff",
      validationMessage: "Admin password is required.",
    });
    if (!adminPassword) return;

    try {
      await api.delete(`/staff/${id}`, {
        data: { adminPassword },
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });

      alert("✅ Staff deleted successfully!");
      fetchStaff();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const filteredStaff = staffList.filter(s => 
    `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-10 bg-stone-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-serif text-stone-900 mb-2">Staff Directory</h1>
            <p className="text-stone-500">Manage your team permissions and profiles</p>
          </div>
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-stone-900 text-white px-5 py-3 rounded-xl hover:opacity-90 transition-all shadow-lg"
          >
            <Plus size={20} /> Add New Staff
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-stone-200 outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="p-5 text-xs font-bold text-stone-400 uppercase">Staff Member</th>
                <th className="p-5 text-xs font-bold text-stone-400 uppercase">Contact Info</th>
                <th className="p-5 text-xs font-bold text-stone-400 uppercase">Status</th>
                <th className="p-5 text-xs font-bold text-stone-400 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredStaff.map((staff) => (
                <tr key={staff.staff_id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="p-5">
                    <div className="font-bold text-stone-800">{staff.first_name} {staff.last_name}</div>
                    <div className="text-xs text-stone-400">ID: #{staff.staff_id}</div>
                  </td>
                  <td className="p-5 text-sm">
                    <div className="text-stone-600">{staff.email}</div>
                    <div className="text-stone-400">{staff.phone_number}</div>
                  </td>
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      staff.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {staff.status}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => handleEditClick(staff)}
                        className="p-2 text-stone-400 hover:text-stone-900 transition-colors"
                      >
                        <Pencil size={18}/>
                      </button>
                      <button 
                        onClick={() => handleDelete(staff.staff_id)} 
                        className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL (Handles both Add and Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif text-stone-900">
                  {editMode ? "Edit Staff Details" : "Onboard New Staff"}
                </h2>
                <button 
                  onClick={() => { setIsModalOpen(false); resetForm(); }} 
                  className="text-stone-400 hover:text-stone-900"
                >
                  <X />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="First Name" 
                    required 
                    value={formData.first_name}
                    className="border p-3 rounded-xl w-full" 
                    onChange={e => setFormData({...formData, first_name: e.target.value})} 
                  />
                  <input 
                    type="text" 
                    placeholder="Last Name" 
                    required 
                    value={formData.last_name}
                    className="border p-3 rounded-xl w-full" 
                    onChange={e => setFormData({...formData, last_name: e.target.value})} 
                  />
                </div>
                
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  required 
                  value={formData.email}
                  className="border p-3 rounded-xl w-full" 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                />

                {!editMode && (
                  <input 
                    type="password" 
                    placeholder="Temporary Password" 
                    required 
                    autoComplete="new-password"
                    className="border p-3 rounded-xl w-full" 
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                  />
                )}
                {!editMode && (
                  <p className="text-xs leading-5 text-stone-400">{PASSWORD_REQUIREMENTS}</p>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Phone Number" 
                    value={formData.phone_number}
                    className="border p-3 rounded-xl w-full" 
                    onChange={e => setFormData({...formData, phone_number: e.target.value})} 
                  />
                  <input 
                    type="date" 
                    value={formData.date_of_birth}
                    className="border p-3 rounded-xl w-full text-stone-500" 
                    onChange={e => setFormData({...formData, date_of_birth: e.target.value})} 
                  />
                </div>

                {editMode && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-400 uppercase ml-1">Account Status</label>
                    <select 
                      value={formData.status} 
                      className="border p-3 rounded-xl w-full bg-stone-50"
                      onChange={e => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                )}

                <button 
                  disabled={loading} 
                  type="submit" 
                  className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-2 mt-4"
                >
                  {loading ? <Loader2 className="animate-spin" /> : editMode ? "Save Changes" : "Confirm Registration"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
