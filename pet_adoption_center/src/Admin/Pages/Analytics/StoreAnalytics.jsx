import { useState, useEffect } from 'react';
import { Loader2, TrendingUp, Package, DollarSign, ShoppingCart, Users, BarChart3 } from 'lucide-react';
import api from '../../../api/axios';

const StoreAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/admin/store-analytics');
        setAnalytics(response.data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Simple progress bar component
  const ProgressBar = ({ value, max, color, label }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-stone-600">{label}</span>
          <span className="font-semibold text-stone-900">{value.toLocaleString()}</span>
        </div>
        <div className="w-full bg-stone-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${color}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  // Simple stat card component
  const StatCard = ({ icon, title, value, subtitle, color }) => (
    <div className={`${color} rounded-2xl p-6 text-white`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-white/20 rounded-lg">
          {icon}
        </div>
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
      <p className="text-white/70 text-sm">{subtitle}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-stone-400 w-8 h-8" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-20 text-stone-500">
        <p>Failed to load analytics data</p>
      </div>
    );
  }

  const { overview, monthly_trends, top_products, daily_sales, payment_breakdown } = analytics;

  // Calculate max values for progress bars
  const maxRevenue = Math.max(...monthly_trends.map(m => m.revenue || 0), 1);
  const maxOrders = Math.max(...monthly_trends.map(m => m.orders || 0), 1);

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BarChart3 className="w-6 h-6 text-emerald-600" />
        <h1 className="text-2xl font-bold text-stone-900">Store Analytics</h1>
      </div>

      {/* Overview Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<DollarSign className="w-5 h-5" />}
          title="Total Revenue"
          value={`${(overview.total_revenue || 0).toLocaleString()} NPR`}
          subtitle={`From ${overview.total_orders || 0} orders`}
          color="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />
        <StatCard
          icon={<ShoppingCart className="w-5 h-5" />}
          title="Total Orders"
          value={overview.total_orders || 0}
          subtitle={`${overview.completed_orders || 0} completed`}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          icon={<Package className="w-5 h-5" />}
          title="Avg Order Value"
          value={`${Math.round(overview.avg_order_value || 0).toLocaleString()} NPR`}
          subtitle="Per order average"
          color="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          title="Last 30 Days"
          value={`${overview.orders_last_30_days || 0} orders`}
          subtitle={`${(overview.revenue_last_30_days || 0).toLocaleString()} NPR`}
          color="bg-gradient-to-br from-orange-500 to-orange-600"
        />
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <h2 className="text-lg font-semibold text-stone-900 mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          Monthly Revenue Trends
        </h2>
        <div className="space-y-4">
          {monthly_trends.slice(-6).map((month, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-stone-700">
                <span>{month.month}</span>
                <span>{month.revenue?.toLocaleString()} NPR</span>
              </div>
              <ProgressBar
                value={month.revenue || 0}
                max={maxRevenue}
                color="bg-emerald-500"
                label={`${month.orders || 0} orders`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <h2 className="text-lg font-semibold text-stone-900 mb-6 flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-600" />
          Top Selling Products
        </h2>
        <div className="space-y-3">
          {top_products.slice(0, 5).map((product, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-stone-900">{product.name}</p>
                  <p className="text-sm text-stone-500">{product.total_sold} sold</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-stone-900">{product.total_revenue?.toLocaleString()} NPR</p>
                <p className="text-sm text-stone-500">Revenue</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Sales & Payment Status */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Daily Sales */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <h2 className="text-lg font-semibold text-stone-900 mb-6 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-purple-600" />
            Daily Sales (Last 7 Days)
          </h2>
          <div className="space-y-3">
            {daily_sales.map((day, index) => (
              <div key={index} className="flex justify-between items-center p-2">
                <span className="text-sm text-stone-600">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
                <div className="text-right">
                  <p className="font-semibold text-stone-900">{day.revenue?.toLocaleString()} NPR</p>
                  <p className="text-xs text-stone-500">{day.orders} orders</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Status */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <h2 className="text-lg font-semibold text-stone-900 mb-2 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-orange-600" />
            Payment Status Overview
          </h2>
          <p className="text-sm text-stone-500 mb-6">See how your payments are performing at a glance</p>
          
          <div className="space-y-5">
            {payment_breakdown.map((status, index) => {
              const getStatusInfo = (statusType) => {
                switch(statusType) {
                  case 'completed':
                    return {
                      label: 'Successfully Paid',
                      description: 'Orders where payment was successful',
                      color: 'bg-green-500',
                      icon: 'Success'
                    };
                  case 'pending':
                    return {
                      label: 'Pending Payment',
                      description: 'Orders waiting for payment confirmation',
                      color: 'bg-yellow-500',
                      icon: 'Processing'
                    };
                  case 'failed':
                    return {
                      label: 'Payment Failed',
                      description: 'Orders where payment was declined or failed',
                      color: 'bg-red-500',
                      icon: 'Failed'
                    };
                  case 'refunded':
                    return {
                      label: 'Refunded',
                      description: 'Orders that were refunded to customers',
                      color: 'bg-orange-500',
                      icon: 'Refunded'
                    };
                  default:
                    return {
                      label: statusType.charAt(0).toUpperCase() + statusType.slice(1),
                      description: 'Unknown payment status',
                      color: 'bg-gray-500',
                      icon: 'Other'
                    };
                }
              };

              const statusInfo = getStatusInfo(status.status);
              
              return (
                <div key={index} className="bg-stone-50 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full text-white ${statusInfo.color}`}>
                          {statusInfo.icon}
                        </span>
                        <h3 className="font-semibold text-stone-900">{statusInfo.label}</h3>
                      </div>
                      <p className="text-xs text-stone-500 mb-2">{statusInfo.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-bold text-stone-900">
                          {status.total_amount?.toLocaleString() || 0} NPR
                        </span>
                        <span className="text-stone-500">
                          {status.count || 0} {status.count === 1 ? 'order' : 'orders'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <ProgressBar
                    value={status.total_amount || 0}
                    max={Math.max(...payment_breakdown.map(s => s.total_amount || 0), 1)}
                    color={statusInfo.color}
                    label={`${((status.total_amount || 0) / Math.max(...payment_breakdown.map(s => s.total_amount || 0), 1) * 100).toFixed(1)}% of total`}
                  />
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs text-blue-700 font-medium mb-2">Quick Insights:</p>
            <ul className="text-xs text-blue-600 space-y-1">
              {payment_breakdown.find(s => s.status === 'completed') && (
                <li>Success Rate: {((payment_breakdown.find(s => s.status === 'completed')?.total_amount || 0) / 
                  (payment_breakdown.reduce((sum, s) => sum + (s.total_amount || 0), 0)) * 100).toFixed(1)}%</li>
              )}
              {payment_breakdown.find(s => s.status === 'pending') && (
                <li>Pending Payments: {payment_breakdown.find(s => s.status === 'pending')?.count || 0} orders need attention</li>
              )}
              {payment_breakdown.find(s => s.status === 'failed') && (
                <li>Failed Payments: {payment_breakdown.find(s => s.status === 'failed')?.count || 0} orders need review</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreAnalytics;
