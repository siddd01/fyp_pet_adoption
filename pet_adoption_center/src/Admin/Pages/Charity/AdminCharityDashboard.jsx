import { Loader2, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from "../../../api/axios";

const AdminCharityDashboard = () => {
  const [data, setData] = useState({ total: 0, fromStore: 0, fromDirect: 0, chart: [] });
  const [recentDonations, setRecentDonations] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchStats = async () => {
    setLoading(true); // Ensure loading starts
    try {
      // 1. Check if 'api' (axios instance) is working
      console.log(object)
      const statsRes = await api.get('/admin/inflow-stats');
      console.log("Stats Received:", statsRes.data);
      setData(statsRes.data);

      const listRes = await api.get('/admin/recent-donations');
      console.log("Donations Received:", listRes.data);
      setRecentDonations(listRes.data || []);

    } catch (err) {
      // This is crucial: if an error happens, we MUST stop the loading
      console.error("Dashboard Fetch Error:", err.response?.data || err.message);
      
      // Optional: Set default empty data so the page can still render
      setData({ total: 0, fromStore: 0, fromDirect: 0, chart: [] });
      setRecentDonations([]);
    } finally {
      setLoading(false); // This stops the "loadingggg" state
    }
  };
  fetchStats();
}, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-stone-300" /></div>;

  return (
    <div className="space-y-8 p-6">
      {/* ... Keep your existing Metric Cards here ... */}

      <div className="bg-white rounded-3xl border border-stone-100 overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-stone-50">
          <h3 className="font-serif text-xl text-stone-900">Donor Community</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-stone-50 text-[10px] uppercase tracking-widest text-stone-400 font-bold">
              <tr>
                <th className="px-8 py-4">Donor</th>
                <th className="px-8 py-4">Amount</th>
                <th className="px-8 py-4">Message</th>
                <th className="px-8 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {recentDonations.map((don) => (
                <tr key={don.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-8 py-4 flex items-center gap-4">
                    {/* PHOTO LOGIC */}
                    <div className="w-10 h-10 rounded-full bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                      {don.profile_image ? (
                        <img src={don.profile_image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-full h-full p-2 text-stone-300" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-900">{don.donor_name}</p>
                      <p className="text-xs text-stone-400">{don.donor_email}</p>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="text-sm font-bold text-emerald-600">
                      NPR {Number(don.amount).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-sm text-stone-500 italic max-w-xs">
                    <p className="truncate">
                      {don.message ? `"${don.message}"` : "—"}
                    </p>
                  </td>
                  <td className="px-8 py-4 text-xs text-stone-400">
                    {new Date(don.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentDonations.length === 0 && (
            <div className="py-20 text-center text-stone-400 text-sm">No donations found yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCharityDashboard;