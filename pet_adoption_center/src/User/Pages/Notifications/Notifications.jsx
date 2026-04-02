import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Assuming you use this for navigation
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
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  
  // Modal State
  const [selectedApp, setSelectedApp] = useState(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      setError("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (app) => {
  // Navigate to the edit path and pass the whole application object
  navigate(`/adopt-form/edit/${app.id}`, { 
    state: { application: app } 
  });
};

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const counts = {
    all: notifications.length,
    approved: notifications.filter((n) => n.status === "approved").length,
    pending: notifications.filter((n) => n.status === "pending").length,
    rejected: notifications.filter((n) => n.status === "rejected").length,
  };

  const filtered = filter === "all" 
    ? notifications 
    : notifications.filter((n) => n.status === filter);

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
      {/* ── Header ── */}
      <div className="bg-gradient-to-b from-stone-100 to-white pt-24 pb-12 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-[1px] w-10 bg-stone-400"></span>
                <p className="text-stone-500 text-[10px] font-bold tracking-[0.4em] uppercase">Status Tracker</p>
              </div>
              <h1 className="text-stone-900 text-5xl md:text-7xl font-medium tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
                My <span className="italic text-stone-500">Applications</span>
              </h1>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {["all", "pending", "approved", "rejected"].map((key) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${
                    filter === key ? "bg-stone-900 text-white border-stone-900" : "bg-white text-stone-500 border-stone-200"
                  }`}
                >
                  {key} ({counts[key]})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item) => {
            const cfg = statusConfig[item.status] || statusConfig.pending;
            const isPending = item.status === "pending";

            return (
              <div key={item.id} className="group bg-white rounded-3xl border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col overflow-hidden">
                <div className={`h-1.5 w-full ${cfg.dot}`} />
                <div className="p-7 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <img src={item.image_url || "/default-pet.png"} alt="" className="w-14 h-14 rounded-2xl object-cover" />
                      <h3 className="text-stone-900 font-semibold text-lg" style={{ fontFamily: "Georgia, serif" }}>{item.pet_name}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                      {cfg.label}
                    </span>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="bg-stone-50 p-4 rounded-2xl">
                      <p className="text-[9px] text-stone-400 uppercase tracking-widest font-bold mb-1">Reason for adoption</p>
                      <p className="text-xs text-stone-600 italic line-clamp-2">"{item.reason_for_adoption}"</p>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-[10px] text-stone-400">{new Date(item.created_at).toLocaleDateString()}</span>
                    
                    {/* ── CONDITIONAL BUTTON ── */}
                    {isPending ? (
                      <button 
                        onClick={() => handleEdit(item)}
                        className="bg-stone-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-stone-700 transition-colors"
                      >
                        Edit Application
                      </button>
                    ) : (
                      <button 
                        onClick={() => setSelectedApp(item)}
                        className="text-stone-900 text-[10px] font-bold uppercase tracking-widest border-b border-stone-200 hover:border-stone-900 transition-all"
                      >
                        View Details
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── VIEW DETAILS MODAL ── */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setSelectedApp(null)} />
          <div className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-medium text-stone-900" style={{ fontFamily: "Georgia, serif" }}>Application Record</h2>
                <button onClick={() => setSelectedApp(null)} className="text-stone-400 hover:text-stone-900 text-2xl">&times;</button>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4 p-4 bg-stone-50 rounded-2xl">
                  <img src={selectedApp.image_url} className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <p className="text-xs text-stone-400 uppercase font-bold tracking-widest">Applying for</p>
                    <p className="text-xl font-semibold text-stone-900">{selectedApp.pet_name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <DetailItem label="Applicant" value={selectedApp.full_name} />
                  <DetailItem label="Phone" value={selectedApp.phone} />
                  <DetailItem label="Occupation" value={selectedApp.job} />
                  <DetailItem label="Status" value={selectedApp.status.toUpperCase()} />
                </div>

                <DetailItem label="Experience with Pets" value={selectedApp.experience_with_pets} />
                <DetailItem label="Reason" value={selectedApp.reason_for_adoption} />
              </div>
              
              <button 
                onClick={() => setSelectedApp(null)}
                className="w-full mt-8 bg-stone-100 text-stone-600 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-stone-200 transition-all"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Component for Modal
const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-[9px] text-stone-400 uppercase tracking-widest font-bold mb-1">{label}</p>
    <p className="text-sm text-stone-800 font-light leading-relaxed">{value}</p>
  </div>
);

export default Notifications;