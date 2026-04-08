import { Loader2, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../api/axios";

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: "", last_name: "", email: "", password: "", phone_number: "", date_of_birth: ""
  });

  useEffect(() => { fetchStaff(); }, []);

  const fetchStaff = async () => {
    try {
      // Assuming you have a GET /staff route for admins
      const res = await api.get("/staff/get-staff", {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
      });
      setStaffList(res.data);
    } catch (err) { console.error("Fetch failed"); }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/staff/admin-create", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
      });
      setIsModalOpen(false);
      fetchStaff();
      setFormData({ first_name: "", last_name: "", email: "", password: "", phone_number: "", date_of_birth: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Error creating staff");
    } finally { setLoading(false); }
  };

const handleDelete = async (id) => {
  const isConfirmed = window.confirm("Are you sure?");
  if (!isConfirmed) return;

  const adminPassword = prompt("Enter admin password:");
  if (!adminPassword) return;

  try {
    const res = await api.delete(`/staff/${id}`, {
      data: { adminPassword },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });

    alert("✅ Staff deleted successfully!");
    fetchStaff();
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Delete failed");
  }
};
  return (
    <div className="p-10 bg-stone-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-serif text-stone-900 mb-2">Staff Directory</h1>
            <p className="text-stone-500">Manage your team permissions and profiles</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
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
              {staffList.filter(s => s.first_name.toLowerCase().includes(searchTerm.toLowerCase())).map((staff) => (
                
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
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">Active</span>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-3">
                      <button className="p-2 text-stone-400 hover:text-stone-900 transition-colors"><Pencil size={18}/></button>
                      <button onClick={() => handleDelete(staff.staff_id)} className="p-2 text-stone-400 hover:text-red-600 transition-colors"><Trash2 size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif text-stone-900">Onboard Staff</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-900"><X /></button>
              </div>
              <form onSubmit={handleAddStaff} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="First Name" required className="border p-3 rounded-xl w-full" onChange={e => setFormData({...formData, first_name: e.target.value})} />
                  <input type="text" placeholder="Last Name" required className="border p-3 rounded-xl w-full" onChange={e => setFormData({...formData, last_name: e.target.value})} />
                </div>
                <input type="email" placeholder="Email Address" required className="border p-3 rounded-xl w-full" onChange={e => setFormData({...formData, email: e.target.value})} />
                <input type="password" placeholder="Temporary Password" required className="border p-3 rounded-xl w-full" onChange={e => setFormData({...formData, password: e.target.value})} />
                <button disabled={loading} type="submit" className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin" /> : "Confirm Registration"}
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