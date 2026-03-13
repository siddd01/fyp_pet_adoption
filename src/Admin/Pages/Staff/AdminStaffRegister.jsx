import { useContext, useState } from "react";
import { AdminAuthContext } from "../../../Context/AdminAuthContext";
import api from "../../../api/axios";

const AdminStaffRegister = () => {
  const { admin } = useContext(AdminAuthContext);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
    date_of_birth: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const token = localStorage.getItem("adminToken");
      const res = await api.post("/staff/admin-create", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ text: res.data.message, type: "success" });
      setFormData({ first_name: "", last_name: "", email: "", password: "", phone_number: "", date_of_birth: "" });
    } catch (error) {
      setMessage({ text: error.response?.data?.message || "Failed to create staff.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl bg-white text-stone-800 placeholder-stone-300 outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-900/10 transition";
  const labelClass = "block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">

        {/* ── Header ── */}
        <div className="mb-7">
          <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-1.5">
            Admin Panel
          </p>
          <h1 className="text-3xl font-serif text-stone-900 leading-tight">
            Create Staff Account
          </h1>
        </div>

        {/* ── Card ── */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-yellow-700 to-yellow-500" />

          <div className="p-8">

            {/* Status message */}
            {message.text && (
              <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium border ${
                message.type === "success"
                  ? "bg-teal-50 border-teal-100 text-teal-700"
                  : "bg-red-50 border-red-100 text-red-600"
              }`}>
                {message.type === "success" ? "✅ " : "❌ "}{message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-7">

              {/* ── Personal Info ── */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-xs font-bold tracking-widest text-stone-400 uppercase whitespace-nowrap">
                    Personal Information
                  </span>
                  <div className="flex-1 h-px bg-stone-100" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>First Name</label>
                    <input
                      type="text" name="first_name"
                      placeholder="John"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Last Name</label>
                    <input
                      type="text" name="last_name"
                      placeholder="Doe"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <input
                      type="text" name="phone_number"
                      placeholder="+977 98XXXXXXXX"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Date of Birth</label>
                    <input
                      type="date" name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* ── Account Credentials ── */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-xs font-bold tracking-widest text-stone-400 uppercase whitespace-nowrap">
                    Account Credentials
                  </span>
                  <div className="flex-1 h-px bg-stone-100" />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input
                      type="email" name="email"
                      placeholder="staff@sanoghar.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Password</label>
                    <input
                      type="password" name="password"
                      placeholder="Set a strong password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* ── Submit ── */}
              <div className="pt-2 border-t border-stone-100 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-stone-900 hover:bg-stone-700 disabled:bg-stone-300 text-white text-sm font-semibold rounded-xl transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Creating...
                    </>
                  ) : (
                    "Create Staff →"
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminStaffRegister;