import { useContext, useEffect, useState } from "react";
import api from "../../../api/axios";
import { AdminAuthContext } from "../../../Context/AdminAuthContext";
import { PetContext } from "../../../Context/PetContext";

const AdminHandleAdoption = () => {
  const { admin } = useContext(AdminAuthContext);
  const { pets } = useContext(PetContext);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await api.get("/adoptions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data.applications);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    if (!window.confirm(`Mark this application as ${status}?`)) return;
    try {
      const token = localStorage.getItem("adminToken");
      await api.put(
        `/adoptions/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchApplications();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filter === "all") return true;
    return app.status === filter;
  });

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-amber-50 text-amber-700 border border-amber-200",
      approved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      rejected: "bg-rose-50 text-rose-700 border border-rose-200",
    };
    return styles[status] || "";
  };

  const getStatusDot = (status) => {
    const colors = {
      pending: "bg-amber-400",
      approved: "bg-emerald-400",
      rejected: "bg-rose-400",
    };
    return colors[status] || "bg-gray-400";
  };

  const filterConfig = {
    all: { label: "All", count: applications.length },
    pending: { label: "Pending", count: applications.filter((a) => a.status === "pending").length },
    approved: { label: "Approved", count: applications.filter((a) => a.status === "approved").length },
    rejected: { label: "Rejected", count: applications.filter((a) => a.status === "rejected").length },
  };

  return (
    <div className="min-h-screen bg-stone-50 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-1.5">
              Admin Panel
            </p>
            <h1 className="text-4xl font-serif text-stone-900 leading-tight">
              Adoption Applications
            </h1>
          </div>
          <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200">
            {filteredApplications.length}{" "}
            {filter === "all" ? "total" : filter} application
            {filteredApplications.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {Object.entries(filterConfig).map(([key, { label, count }]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition hover:-translate-y-px cursor-pointer ${
                filter === key
                  ? "bg-stone-900 text-white border-stone-900"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              }`}
            >
              {label}
              <span
                className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                  filter === key
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            /* Skeleton */
            <div className="p-10 space-y-5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse shrink-0" />
                  <div className="flex-1 flex gap-3">
                    <div className="h-3.5 flex-1 rounded bg-gray-100 animate-pulse" />
                    <div className="h-3.5 flex-[2] rounded bg-gray-100 animate-pulse" />
                    <div className="h-3.5 flex-1 rounded bg-gray-100 animate-pulse" />
                    <div className="h-3.5 flex-1 rounded bg-gray-100 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredApplications.length === 0 ? (
            /* Empty State */
            <div className="py-16 text-center">
              <div className="text-4xl mb-3">🐾</div>
              <p className="text-sm font-medium text-gray-500">
                No {filter !== "all" ? filter : ""} applications found
              </p>
            </div>
          ) : (
            /* Table */
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  {["App ID", "Pet", "Applicant", "Age", "Phone", "Job", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-left text-xs font-semibold tracking-wider uppercase text-gray-400 bg-stone-50"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app, i) => (
                  <tr
                    key={app.id}
                    className={`hover:bg-stone-50 transition-colors ${
                      i < filteredApplications.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    <td className="px-5 py-4">
                      <span className="text-xs font-semibold text-gray-400 font-mono">
                        #{app.id}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={pets.find((p) => p.id === app.pet_id)?.image_url || "/default-pet.png"}
                          alt={app.pet_name}
                          className="w-9 h-9 rounded-full object-cover border-2 border-gray-100"
                        />
                        <span className="text-sm font-medium text-stone-800">
                          {app.pet_name}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-gray-700">
                        {app.full_name}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-500">{app.age}</span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-500 font-mono">{app.phone}</span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-500">{app.job}</span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize tracking-wide ${getStatusBadge(app.status)}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(app.status)}`} />
                        {app.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:-translate-y-px hover:shadow-md transition cursor-pointer"
                        >
                          View
                        </button>
                        {app.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(app.id, "approved")}
                              className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:-translate-y-px hover:shadow-md transition cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(app.id, "rejected")}
                              className="px-3 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 rounded-lg hover:-translate-y-px hover:shadow-md transition cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedApp && (
        <div
          className="fixed inset-0 bg-black/45 backdrop-blur-sm flex items-center justify-center z-50 p-5 animate-fade-in"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedApp(null); }}
        >
          <div className="bg-white rounded-2xl w-full max-w-[560px] max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">

            {/* Modal Header */}
            <div className="flex items-start justify-between px-7 pt-6 pb-5 border-b border-gray-100">
              <div>
                <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-1">
                  Application #{selectedApp.id}
                </p>
                <h2 className="text-2xl font-serif text-stone-900">
                  {selectedApp.full_name}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${getStatusBadge(selectedApp.status)}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(selectedApp.status)}`} />
                  {selectedApp.status}
                </span>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 transition cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-7 pt-5 pb-7">

              {/* Info Grid */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: "Age", value: selectedApp.age },
                  { label: "Phone", value: selectedApp.phone },
                  { label: "Job", value: selectedApp.job },
                  { label: "User ID", value: `#${selectedApp.user_id}` },
                  { label: "Living Situation", value: selectedApp.living_situation },
                  { label: "Applied On", value: new Date(selectedApp.created_at).toLocaleDateString() },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-stone-50 border border-gray-100 rounded-xl px-3.5 py-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      {label}
                    </p>
                    <p className="text-sm font-medium text-stone-800">{value}</p>
                  </div>
                ))}
              </div>

              {/* Long Text Fields */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Pet Experience
                  </p>
                  <p className="text-sm text-gray-700 bg-stone-50 border border-gray-100 rounded-xl px-4 py-3.5 leading-relaxed">
                    {selectedApp.experience_with_pets}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Reason for Adoption
                  </p>
                  <p className="text-sm text-gray-700 bg-stone-50 border border-gray-100 rounded-xl px-4 py-3.5 leading-relaxed">
                    {selectedApp.reason_for_adoption}
                  </p>
                </div>
              </div>

              {/* Modal Actions */}
              {selectedApp.status === "pending" && (
                <div className="flex gap-2.5 mt-6 pt-5 border-t border-gray-100">
                  <button
                    onClick={() => { handleStatusUpdate(selectedApp.id, "approved"); setSelectedApp(null); }}
                    className="flex-1 py-3 rounded-xl bg-stone-900 hover:bg-stone-700 text-white text-sm font-semibold tracking-wide transition cursor-pointer"
                  >
                    ✓ Approve Application
                  </button>
                  <button
                    onClick={() => { handleStatusUpdate(selectedApp.id, "rejected"); setSelectedApp(null); }}
                    className="flex-1 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-sm font-semibold tracking-wide transition cursor-pointer"
                  >
                    ✕ Reject Application
                  </button>
                </div>
              )}
            </div>
          </div>

          <style>{`
            @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slide-up { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
            .animate-fade-in { animation: fade-in 0.2s ease; }
            .animate-slide-up { animation: slide-up 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default AdminHandleAdoption;