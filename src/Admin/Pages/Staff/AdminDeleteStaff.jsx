import { useContext, useState } from "react";
import { AdminAuthContext } from "../../../Context/AdminAuthContext";
import api from "../../../api/axios";

const AdminDeleteStaff = () => {
  const { admin } = useContext(AdminAuthContext);
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleDelete = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    setLoading(true);

    try {
      const confirmRes = await api.post(
        "/auth/confirm-password",
        { password },
        { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
      );

      if (!confirmRes.data.valid) {
        setMessage({ text: "Incorrect password. Please try again.", type: "error" });
        setLoading(false);
        return;
      }

      const res = await api.delete(`/staff/${staffId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });

      setMessage({ text: res.data.message, type: "success" });
      setStaffId("");
      setPassword("");
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Failed to delete staff.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl bg-white text-stone-800 placeholder-stone-300 outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-900/10 transition";
  const labelClass = "block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* ── Page Header ── */}
        <div className="mb-7">
          <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-1.5">
            Admin Panel
          </p>
          <h1 className="text-3xl font-serif text-stone-900 leading-tight">
            Delete Staff
          </h1>
        </div>

        {/* ── Warning notice ── */}
        <div className="mb-5 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
          <span className="text-lg">⚠️</span>
          <p className="text-xs text-red-700 leading-relaxed">
            This action is <span className="font-semibold">permanent</span> and cannot be undone.
            Please confirm your admin password before proceeding.
          </p>
        </div>

        {/* ── Card ── */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-yellow-700 to-yellow-500" />

          <div className="p-7">

            {/* Status message */}
            {message.text && (
              <div className={`mb-5 px-4 py-3 rounded-xl text-sm font-medium border ${
                message.type === "success"
                  ? "bg-teal-50 border-teal-100 text-teal-700"
                  : "bg-red-50 border-red-100 text-red-600"
              }`}>
                {message.type === "success" ? "✅ " : "❌ "}{message.text}
              </div>
            )}

            <form onSubmit={handleDelete} className="space-y-5">

              <div>
                <label className={labelClass}>Staff ID</label>
                <input
                  type="number"
                  placeholder="Enter staff ID to delete"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Admin Password</label>
                <input
                  type="password"
                  placeholder="Confirm your admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>

              <div className="pt-2 border-t border-stone-100">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 disabled:bg-stone-300 text-white text-sm font-semibold rounded-xl transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    "Delete Staff →"
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

export default AdminDeleteStaff;