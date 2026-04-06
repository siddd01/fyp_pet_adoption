import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

const AdminCharityDashboard = () => {
  const [data, setData] = useState({ total: 0, fromStore: 0, fromDirect: 0, chart: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInflow = async () => {
      try {
        const res = await axios.get('/api/admin/charity/inflow-stats');
        setData(res.data);
      } finally { setLoading(false); }
    };
    fetchInflow();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-stone-300" /></div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-1">Total Collection</p>
          <h2 className="text-4xl font-serif text-stone-900">NPR {data.total.toLocaleString()}</h2>
          <div className="mt-4 flex gap-4">
            <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg font-medium">Store (2%): NPR {data.fromStore}</span>
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-lg font-medium">Direct: NPR {data.fromDirect}</span>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm h-[200px]">
           <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.chart}>
                <XAxis dataKey="month" hide />
                <Tooltip />
                <Bar dataKey="amount" fill="#1c1917" radius={[4, 4, 0, 0]} />
              </BarChart>
           </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminCharityDashboard;