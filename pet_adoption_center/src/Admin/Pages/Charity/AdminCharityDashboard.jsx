import { Loader2, User, TrendingUp, Heart, DollarSign, BarChart3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from "../../../api/axios";
import AnalyticsCharts from "../../Components/AnalyticsCharts.jsx";

const AdminCharityDashboard = () => {
  const [data, setData] = useState({ total: 0, fromStore: 0, fromDirect: 0, chart: [] });
  const [recentDonations, setRecentDonations] = useState([]);
  const [storeAnalysis, setStoreAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donating, setDonating] = useState(false);

useEffect(() => {
  const fetchStats = async () => {
    setLoading(true); // Ensure loading starts
    try {
      // 1. Check if 'api' (axios instance) is working
      console.log("Fetching charity stats...");
      const statsRes = await api.get('/admin/inflow-stats');
      console.log("Stats Received:", statsRes.data);
      setData(statsRes.data);

      const listRes = await api.get('/admin/recent-donations');
      console.log("Donations Received:", listRes.data);
      setRecentDonations(listRes.data || []);

      // Fetch store analysis
      const storeRes = await api.get('/admin/store-analysis');
      console.log("Store Analysis:", storeRes.data);
      setStoreAnalysis(storeRes.data);

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

const handleDonateStoreCharity = async () => {
  try {
    setDonating(true);
    const res = await api.post('/admin/donate-store-charity');
    alert(res.data.message || 'Store charity donated successfully!');
    // Refresh store analysis
    const storeRes = await api.get('/admin/store-analysis');
    setStoreAnalysis(storeRes.data);
  } catch (error) {
    console.error("Donate error:", error);
    alert(error.response?.data?.message || "Failed to donate store charity");
  } finally {
    setDonating(false);
  }
};

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-stone-300" /></div>;

  return (
    <div className="space-y-8 p-6">
      {/* Store Analysis Section */}
      {storeAnalysis && (
        <>
          {/* Summary Cards */}
          <div className="bg-white rounded-3xl border border-stone-100 overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-stone-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-serif text-xl text-stone-900">Store Analysis Overview</h3>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="grid md:grid-cols-5 gap-4">
                {/* Total Sales */}
                <div className="bg-stone-50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="w-5 h-5 text-stone-600" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Total Sales</span>
                  </div>
                  <p className="text-2xl font-bold text-stone-900">
                    {storeAnalysis.total_sales.toLocaleString()} {storeAnalysis.total_sales > 0 ? 'NPR' : ''}
                  </p>
                  <p className="text-sm text-stone-400 mt-1">
                    {storeAnalysis.total_orders} orders
                  </p>
                </div>

              {/* Charity Amount */}
                <div className="bg-emerald-50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Heart className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">2% Charity</span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-700">
                    {storeAnalysis.charity_amount.toLocaleString()} {storeAnalysis.charity_amount > 0 ? 'NPR' : ''}
                  </p>
                  <p className="text-sm text-emerald-500 mt-1">
                    Pending donation
                  </p>
                </div>

                {/* Donated Amount */}
                <div className="bg-blue-50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Heart className="w-5 h-5 text-blue-600" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">Already Donated</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">
                    {storeAnalysis.donated_amount.toLocaleString()} {storeAnalysis.donated_amount > 0 ? 'NPR' : ''}
                  </p>
                  <p className="text-sm text-blue-500 mt-1">
                    Contributed to charity
                  </p>
                </div>

                {/* Total Donations */}
                <div className="bg-purple-50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Heart className="w-5 h-5 text-purple-600" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-purple-600">Total Donations</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-700">
                    {storeAnalysis.total_donations.toLocaleString()} {storeAnalysis.total_donations > 0 ? 'NPR' : ''}
                  </p>
                  <p className="text-sm text-purple-500 mt-1">
                    2% + Direct charity
                  </p>
                </div>

                {/* Donate Button */}
                <div className="bg-stone-100 rounded-2xl p-6 flex flex-col justify-center">
                  <button
                    onClick={handleDonateStoreCharity}
                    disabled={donating || storeAnalysis.pending_donation === 0}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {donating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Heart className="w-4 h-4" />
                    )}
                    {donating ? 'Processing...' : 'Donate Now'}
                  </button>
                  {storeAnalysis.pending_donation === 0 && (
                    <p className="text-xs text-stone-400 mt-2 text-center">No pending donations</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Charts Section */}
          <div className="bg-white rounded-3xl border border-stone-100 overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-stone-50">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-serif text-xl text-stone-900">Analytics & Visualizations</h3>
              </div>
            </div>
            <div className="p-8">
              <AnalyticsCharts storeAnalysis={storeAnalysis} />
            </div>
          </div>
        </>
      )}

      {/* Donor Community Section */}
      <div className="bg-white rounded-3xl border border-stone-100 overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-stone-50">
          <h3 className="font-serif text-xl text-stone-900">Donor Community</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-stone-50 text-[10px] uppercase tracking-widest text-stone-400 font-bold">
              <tr>
                <th className="px-8 py-4">Donor Info</th>
                <th className="px-8 py-4">Amount</th>
                <th className="px-8 py-4">Message</th>
                <th className="px-8 py-4">Contact</th>
                <th className="px-8 py-4">Date</th>
                <th className="px-8 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {recentDonations.map((don) => (
                <tr key={don.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-8 py-4 flex items-center gap-4">
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
                      <p className="text-xs text-stone-300">ID: {don.user_id || 'Guest'}</p>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="text-sm font-bold text-emerald-600">
                      {Number(don.amount).toLocaleString()} {don.amount > 0 ? 'NPR' : ''}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-sm text-stone-500 italic max-w-xs">
                    <p className="truncate">
                      {don.message ? `"${don.message}"` : "No message"}
                    </p>
                  </td>
                  <td className="px-8 py-4">
                    <div className="text-xs">
                      <p className="text-stone-400">{don.donor_email}</p>
                      <p className="text-stone-300">User ID: {don.user_id || 'Guest'}</p>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-xs text-stone-400">
                    <div>
                      <p>{new Date(don.created_at).toLocaleDateString()}</p>
                      <p className="text-stone-300">{new Date(don.created_at).toLocaleTimeString()}</p>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      don.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {don.status}
                    </span>
                    {don.pidx && (
                      <p className="text-xs text-stone-400 mt-1">PIDX: {don.pidx.slice(0, 8)}...</p>
                    )}
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