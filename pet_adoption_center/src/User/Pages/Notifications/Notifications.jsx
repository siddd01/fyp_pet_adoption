import { AlertTriangle, Bell, Calendar, Clock, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { getNotifications } from "../../Services/notificationService";

const statusConfig = {
  approved: {
    label: "Approved",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    text: "text-emerald-700",
    dot: "bg-emerald-400",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-red-50",
    border: "border-red-100",
    text: "text-red-700",
    dot: "bg-red-400",
  },
  pending: {
    label: "Pending",
    bg: "bg-amber-50",
    border: "border-amber-100",
    text: "text-amber-700",
    dot: "bg-amber-400",
  },
};

const Notifications = () => {
  const [adoptionNotifications, setAdoptionNotifications] = useState([]);
  const [reportNotifications, setReportNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("adoptions");
  
  const [selectedApp, setSelectedApp] = useState(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const adoptionData = await getNotifications();
      setAdoptionNotifications(adoptionData || []);
      
      const reportRes = await api.get("/reports/user/notifications");
      const reportNotifications = reportRes.data.notifications || [];
      setReportNotifications(reportNotifications);
      
    } catch (err) {
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markNotificationRead = async (notificationId) => {
    try {
      await api.put(`/reports/user/notifications/${notificationId}/read`);
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleEdit = (app) => {
    navigate(`/adopt-form/edit/${app.id}`, { 
      state: { application: app } 
    });
  };

  const handleDelete = async (appId) => {
    if (!window.confirm("Are you sure you want to delete this adoption request? This action cannot be undone.")) return;
    
    try {
      await api.delete(`/adoptions/${appId}`);
      setSelectedApp(null);
      
      fetchNotifications(); // Refresh notifications after deletion
    } catch (error) {
      console.error("Failed to delete application:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const counts = activeTab === "adoptions" ? {
    all: adoptionNotifications.length,
    approved: adoptionNotifications.filter((n) => n.status === "approved").length,
    pending: adoptionNotifications.filter((n) => n.status === "pending").length,
    rejected: adoptionNotifications.filter((n) => n.status === "rejected").length,
  } : {
    all: reportNotifications.length,
    unread: reportNotifications.filter((n) => !n.is_read).length,
    read: reportNotifications.filter((n) => n.is_read).length,
  };

  const filtered = activeTab === "adoptions" 
    ? (filter === "all" ? adoptionNotifications : adoptionNotifications.filter((n) => n.status === filter))
    : (filter === "all" ? reportNotifications : 
       filter === "unread" ? reportNotifications.filter((n) => !n.is_read) :
       reportNotifications.filter((n) => n.is_read));

  if (loading) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-stone-400 italic">
        <span className="text-5xl animate-bounce">🐾</span>
        <p>Fetching your records...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* ── HEADER SECTION ── */}
      <div className="bg-gradient-to-b from-stone-100 to-white pt-24 pb-12 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-[1px] w-10 bg-stone-400"></span>
                <p className="text-stone-500 text-[10px] font-bold tracking-[0.4em] uppercase">Status Board</p>
              </div>
              <h1 className="text-stone-900 text-5xl md:text-7xl font-medium tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
                My <span className="italic text-stone-500">Updates</span>
              </h1>
            </div>

            {/* Main Tabs */}
            <div className="flex gap-4">
              <button
                onClick={() => { setActiveTab("adoptions"); setFilter("all"); }}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTab === "adoptions" 
                    ? "bg-stone-900 text-white shadow-xl shadow-stone-200" 
                    : "bg-white text-stone-500 border border-stone-200 hover:border-stone-400"
                }`}
              >
                <FileText className="w-4 h-4" />
                Adoptions
              </button>
              <button
                onClick={() => { setActiveTab("reports"); setFilter("all"); }}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTab === "reports" 
                    ? "bg-stone-900 text-white shadow-xl shadow-stone-200" 
                    : "bg-white text-stone-500 border border-stone-200 hover:border-stone-400"
                }`}
              >
                <Bell className="w-4 h-4" />
                Reports ({counts.unread})
              </button>
            </div>

            {/* Sub-Filters */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
              {(activeTab === "adoptions" ? ["all", "pending", "approved", "rejected"] : ["all", "unread", "read"]).map((key) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-5 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${
                    filter === key ? "bg-stone-100 text-stone-900 border-stone-300" : "bg-transparent text-stone-400 border-transparent hover:text-stone-600"
                  }`}
                >
                  {key} <span className="ml-1 opacity-50">({counts[key]})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTENT GRID ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        {activeTab === "adoptions" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item) => {
              const cfg = statusConfig[item.status] || statusConfig.pending;
              return (
                <div key={item.id} className="group bg-white rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col overflow-hidden">
                  <div className={`h-1.5 w-full ${cfg.dot}`} />
                  <div className="p-8 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <img src={item.image_url || "/default-pet.png"} alt="" className="w-16 h-16 rounded-2xl object-cover ring-4 ring-stone-50" />
                        <div>
                          <h3 className="text-stone-900 font-semibold text-xl" style={{ fontFamily: "Georgia, serif" }}>{item.pet_name}</h3>
                          <p className="text-[10px] text-stone-400 uppercase tracking-tighter">Application ID: #{item.id.toString().slice(-4)}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                        {cfg.label}
                      </span>
                    </div>

                    <div className="bg-stone-50 p-5 rounded-2xl mb-8">
                      <p className="text-[9px] text-stone-400 uppercase tracking-widest font-bold mb-2">Message from Applicant</p>
                      <p className="text-xs text-stone-600 italic leading-relaxed line-clamp-2">"{item.reason_for_adoption}"</p>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-stone-50">
                      <div className="flex items-center gap-2 text-stone-400">
                        <Calendar size={12} />
                        <span className="text-[10px]">{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-2">
                        {item.status === "pending" ? (
                          <>
                            <button onClick={() => handleEdit(item)} className="bg-stone-900 text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-stone-700 transition-colors shadow-lg shadow-stone-200">
                              Edit
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="bg-red-600 text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-700 transition-colors shadow-lg shadow-red-200">
                              Delete
                            </button>
                          </>
                        ) : (
                          <button onClick={() => setSelectedApp(item)} className="text-stone-900 text-[10px] font-bold uppercase tracking-widest border-b border-stone-900/20 hover:border-stone-900 transition-all py-1">
                            View Details
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ── REPORTS SECTION (CLEANED UP) ── */
          <div className="max-w-4xl mx-auto space-y-4">
            {filtered.map((notification) => (
              <div 
                key={notification.id} 
                onClick={() => !notification.is_read && markNotificationRead(notification.id)}
                className={`group relative bg-white rounded-2xl border transition-all duration-300 cursor-pointer p-6 ${
                  !notification.is_read 
                    ? "border-stone-900 shadow-md ring-1 ring-stone-900" 
                    : "border-stone-100 hover:border-stone-300"
                }`}
              >
                <div className="flex items-start gap-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                    !notification.is_read ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-400"
                  }`}>
                    <AlertTriangle size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-stone-900 text-lg" style={{ fontFamily: "Georgia, serif" }}>Report Update</h3>
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                        !notification.is_read ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-400"
                      }`}>
                        {notification.is_read ? "Archived" : "New Update"}
                      </span>
                    </div>
                    <p className="text-stone-600 text-sm leading-relaxed mb-4 max-w-2xl">{notification.message}</p>
                    <div className="flex items-center gap-4 text-[10px] font-medium text-stone-400 uppercase tracking-tighter">
                      <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(notification.created_at).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Clock size={12}/> {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── MODAL ── */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-md" onClick={() => setSelectedApp(null)} />
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="p-10">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-medium text-stone-900" style={{ fontFamily: "Georgia, serif" }}>Application <span className="italic text-stone-400">Log</span></h2>
                <button onClick={() => setSelectedApp(null)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-100 text-stone-400 transition-colors text-2xl">&times;</button>
              </div>

              <div className="space-y-8">
                <div className="flex gap-6 p-6 bg-stone-50 rounded-3xl border border-stone-100">
                  <img src={selectedApp.image_url} className="w-20 h-20 rounded-2xl object-cover shadow-sm" />
                  <div>
                    <p className="text-[10px] text-stone-400 uppercase font-bold tracking-[0.2em] mb-1">Subject</p>
                    <p className="text-2xl font-semibold text-stone-900">{selectedApp.pet_name}</p>
                    <p className="text-xs text-stone-500 mt-1">Status: {selectedApp.status}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                  <DetailItem label="Full Legal Name" value={selectedApp.full_name} />
                  <DetailItem label="Contact Number" value={selectedApp.phone} />
                  <DetailItem label="Professional Role" value={selectedApp.job} />
                  <DetailItem label="Submission Date" value={new Date(selectedApp.created_at).toLocaleDateString()} />
                </div>

                <div className="pt-4 border-t border-stone-100 space-y-6">
                  <DetailItem label="Prior Experience" value={selectedApp.experience_with_pets || "No previous experience listed."} />
                  <DetailItem label="Personal Statement" value={selectedApp.reason_for_adoption} />
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedApp(null)}
                className="w-full mt-10 bg-stone-900 text-white py-5 rounded-2xl text-xs font-bold uppercase tracking-[0.3em] hover:bg-stone-800 transition-all shadow-xl shadow-stone-200"
              >
                Dismiss View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-[9px] text-stone-400 uppercase tracking-widest font-bold">{label}</p>
    <p className="text-sm text-stone-800 font-medium leading-relaxed">{value}</p>
  </div>
);

export default Notifications;