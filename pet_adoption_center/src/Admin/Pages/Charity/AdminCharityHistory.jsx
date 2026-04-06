import axios from 'axios';
import { ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';

const AdminCharityHistory = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get('/api/admin/charity/history').then(res => setLogs(res.data));
  }, []);

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
            {logs.map(log => (
              <tr key={log.id} className="hover:bg-stone-50/50 transition-colors">
                <td className="px-8 py-5 text-sm text-stone-500">{new Date(log.created_at).toLocaleDateString()}</td>
                <td className="px-8 py-5 text-sm font-medium text-stone-800">{log.title}</td>
                <td className="px-8 py-5 text-sm font-bold text-rose-500">- NPR {log.amount_spent.toLocaleString()}</td>
                <td className="px-8 py-5">
                  <a href={log.image_url} target="_blank" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-stone-400 hover:text-stone-900 uppercase tracking-wider">
                    View Proof <ExternalLink size={12} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCharityHistory;