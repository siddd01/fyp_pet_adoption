import { ShoppingBag } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export const StoreAnalytics = () => {
  // Mock data - replace with api.get("/store/analytics") later
  const salesData = [
    { day: 'Mon', revenue: 4000 },
    { day: 'Tue', revenue: 3000 },
    { day: 'Wed', revenue: 2000 },
    { day: 'Thu', revenue: 2780 },
    { day: 'Fri', revenue: 1890 },
    { day: 'Sat', revenue: 2390 },
    { day: 'Sun', revenue: 3490 },
  ];

  return (
    <div className="p-10 bg-stone-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-serif mb-8">Store Performance</h1>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
            <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center mb-4">
              <ShoppingBag size={24}/>
            </div>
            <p className="text-stone-400 text-sm font-bold uppercase tracking-wider">Total Orders</p>
            <h3 className="text-3xl font-bold text-stone-900">1,284</h3>
          </div>
          {/* Add more stats cards here */}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
            <h3 className="font-bold text-stone-800 mb-6">Revenue Trend (Weekly)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#a8a29e', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#a8a29e', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#fafaf9'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="revenue" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};