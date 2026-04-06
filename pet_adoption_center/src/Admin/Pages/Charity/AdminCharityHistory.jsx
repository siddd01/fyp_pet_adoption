import axios from 'axios';
import { AlertCircle, ExternalLink, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const AdminCharityHistory = () => {
  // 1. Initialize with an empty array to prevent .map() errors
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('/api/admin/charity/history');
        // 2. Ensure we are setting an array even if res.data is null
        setLogs(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("History fetch failed:", err);
        setError("Could not load history. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="animate-spin text-stone-300" /></div>;

  if (error) return (
    <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100 flex items-center gap-3 text-stone-500 text-sm">
      <AlertCircle size={18} /> {error}
    </div>
  );

  return (
    <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-stone-50">
        <h3 className="font-serif text-lg text-stone-900">Spending Audit Log</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-stone-50">
            <tr>
              <th className="px-8 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Event Date</th>
              <th className="px-8 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Purpose</th>
              <th className="px-8 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Amount Spent</th>
              <th className="px-8 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {/* 3. Safe mapping with a fallback empty state UI */}
            {logs.length > 0 ? logs.map(log => (
              <tr key={log.id} className="hover:bg-stone-50/50 transition-colors">
                <td className="px-8 py-5 text-sm text-stone-500">
                  {log.created_at ? new Date(log.created_at).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-8 py-5 text-sm font-medium text-stone-800">{log.title || 'Untitled Expense'}</td>
                <td className="px-8 py-5 text-sm font-bold text-rose-500">
                  {/* 4. The same .toLocaleString() fix */}
                  - NPR {(log.amount_spent || 0).toLocaleString()}
                </td>
                <td className="px-8 py-5">
                  <a href={log.image_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-stone-400 hover:text-stone-900 uppercase tracking-wider">
                    View Proof <ExternalLink size={12} />
                  </a>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="px-8 py-10 text-center text-sm text-stone-400 italic">
                  No expenditure history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCharityHistory;