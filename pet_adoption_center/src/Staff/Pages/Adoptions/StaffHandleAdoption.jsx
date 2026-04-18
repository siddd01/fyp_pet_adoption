import { useContext, useEffect, useState } from "react";
import api from "../../../api/axios";
import { PetContext } from "../../../Context/PetContext";

const StaffHandleAdoption = () => {
  const { pets } = useContext(PetContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("staffToken");
      const res = await api.get("/adoptions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Assuming backend provides pet details. If not, we fallback to PetContext
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
      const token = localStorage.getItem("staffToken");
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
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-1.5">Staff Panel</p>
            <h1 className="text-4xl font-serif text-stone-900 leading-tight">Adoption Applications</h1>
            <p className="text-sm text-stone-500 mt-2">Review and process adoption requests</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-stone-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <span className="text-amber-600 font-semibold">⏳</span>
              </div>
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wider">Pending</p>
                <p className="text-2xl font-bold text-stone-900">{filterConfig.pending.count}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-stone-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-emerald-600 font-semibold">✅</span>
              </div>
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wider">Approved</p>
                <p className="text-2xl font-bold text-stone-900">{filterConfig.approved.count}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-stone-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                <span className="text-rose-600 font-semibold">❌</span>
              </div>
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wider">Rejected</p>
                <p className="text-2xl font-bold text-stone-900">{filterConfig.rejected.count}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-stone-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">📋</span>
              </div>
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wider">Total</p>
                <p className="text-2xl font-bold text-stone-900">{filterConfig.all.count}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {Object.entries(filterConfig).map(([key, { label, count }]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition cursor-pointer ${
                filter === key ? "bg-stone-900 text-white border-stone-900" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              }`}
            >
              {label} <span className="text-xs opacity-60">({count})</span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-gray-400 animate-pulse">Loading applications...</div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-stone-50">
                  {["App ID", "Pet", "Applicant", "Phone", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase text-gray-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="border-b border-gray-100 hover:bg-stone-50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-gray-400">#{app.id}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                            src={app.pet_image || "/default-pet.png"} 
                            className="w-10 h-10 rounded-full object-cover border border-gray-200"
                            alt="" 
                        />
                        <span className="text-sm font-medium text-stone-800">{app.pet_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700">{app.full_name}</td>
                    <td className="px-5 py-4 text-sm text-gray-500 font-mono">{app.phone}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(app.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(app.status)}`} />
                        {app.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="px-3 py-1.5 text-xs font-medium bg-stone-100 rounded-lg hover:bg-stone-200 transition cursor-pointer"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b flex justify-between items-center bg-stone-50">
              <h2 className="text-xl font-serif font-bold">Application Review</h2>
              <button onClick={() => setSelectedApp(null)} className="text-gray-400 hover:text-black text-xl">✕</button>
            </div>

            <div className="overflow-y-auto p-8 space-y-8">
              {/* Pet Summary Section */}
              <div className="flex items-center gap-6 p-4 bg-stone-900 rounded-2xl text-white">
                <img src={selectedApp.pet_image || "/default-pet.png"} className="w-24 h-24 rounded-xl object-cover" alt="" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-stone-400">Pet Requested</p>
                  <h3 className="text-2xl font-serif">{selectedApp.pet_name}</h3>
                  <p className="text-sm text-stone-300">{selectedApp.species} • {selectedApp.breed}</p>
                </div>
              </div>

              {/* Applicant Details Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold uppercase text-gray-400 mb-4 tracking-widest">Applicant Info</h4>
                  <div className="space-y-3">
                    <p className="text-sm"><strong>Name:</strong> {selectedApp.full_name}</p>
                    <p className="text-sm"><strong>Age:</strong> {selectedApp.age}</p>
                    <p className="text-sm"><strong>Phone:</strong> {selectedApp.phone}</p>
                    <p className="text-sm"><strong>Occupation:</strong> {selectedApp.job}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-gray-400 mb-4 tracking-widest">Timestamps</h4>
                  <p className="text-sm"><strong>Applied on:</strong> {new Date(selectedApp.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Essay Sections */}
              <div className="space-y-6">
                <div className="bg-stone-50 p-5 rounded-2xl border border-stone-100">
                  <h4 className="text-xs font-bold uppercase text-stone-500 mb-2">Previous Experience</h4>
                  <p className="text-sm text-stone-700 leading-relaxed italic">"{selectedApp.experience_with_pets}"</p>
                </div>
                <div className="bg-stone-50 p-5 rounded-2xl border border-stone-100">
                  <h4 className="text-xs font-bold uppercase text-stone-500 mb-2">Reason for Adoption</h4>
                  <p className="text-sm text-stone-700 leading-relaxed italic">"{selectedApp.reason_for_adoption}"</p>
                </div>
              </div>
            </div>

            {/* Sticky Actions */}
            {selectedApp.status === "pending" && (
              <div className="p-6 border-t bg-white flex gap-3">
                <button 
                  onClick={() => { handleStatusUpdate(selectedApp.id, 'approved'); setSelectedApp(null); }}
                  className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition cursor-pointer"
                >
                  Approve Application
                </button>
                <button 
                   onClick={() => { handleStatusUpdate(selectedApp.id, 'rejected'); setSelectedApp(null); }}
                  className="flex-1 bg-rose-50 text-rose-600 border border-rose-200 py-3 rounded-xl font-bold hover:bg-rose-100 transition cursor-pointer"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffHandleAdoption;