import React from 'react';

const AnalyticsCharts = ({ storeAnalysis }) => {
  // Simple bar chart component
  const SimpleBarChart = ({ data, title, color, valueKey, labelKey }) => {
    const maxValue = Math.max(...data.map(d => Number(d[valueKey]) || 0), 1);
    
    return (
      <div className="bg-white rounded-2xl p-6 border border-stone-100">
        <h4 className="text-sm font-semibold text-stone-700 mb-4">{title}</h4>
        <div className="space-y-3">
          {data.map((item, index) => {
            const value = Number(item[valueKey]) || 0;
            const percentage = (value / maxValue) * 100;
            
            return (
              <div key={index} className="flex items-center gap-3">
                <div className="w-12 text-xs text-stone-500 font-medium">
                  {item[labelKey]}
                </div>
                <div className="flex-1 bg-stone-100 rounded-full h-6 relative overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${color}`}
                    style={{ width: `${percentage}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-semibold text-stone-700">
                      {value.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Simple line chart component
  const SimpleLineChart = ({ data, title, valueKey, labelKey, color }) => {
    const maxValue = Math.max(...data.map(d => Number(d[valueKey]) || 0), 1);
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1 || 1)) * 100;
      const y = 100 - ((Number(item[valueKey]) || 0) / maxValue) * 100;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="bg-white rounded-2xl p-6 border border-stone-100">
        <h4 className="text-sm font-semibold text-stone-700 mb-4">{title}</h4>
        <div className="relative h-32">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={y}
                x1="0" y1={y} x2="100" y2={y}
                stroke="#e5e7eb" strokeWidth="0.5"
              />
            ))}
            {/* Data line */}
            <polyline
              points={points}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Data points */}
            {data.map((item, index) => {
              const x = (index / (data.length - 1 || 1)) * 100;
              const y = 100 - ((Number(item[valueKey]) || 0) / maxValue) * 100;
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="2"
                  fill={color}
                />
              );
            })}
          </svg>
          {/* Labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-stone-500">
            {data.map((item, index) => (
              <span key={index} className="flex-1 text-center">
                {item[labelKey]}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Donut chart component
  const DonutChart = ({ data, title }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    
    return (
      <div className="bg-white rounded-2xl p-6 border border-stone-100">
        <h4 className="text-sm font-semibold text-stone-700 mb-4">{title}</h4>
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
              {data.map((item, index) => {
                const percentage = (item.value / total) * 100;
                const angle = (percentage / 100) * 360;
                const endAngle = currentAngle + angle;
                
                const x1 = 16 + 14 * Math.cos((currentAngle * Math.PI) / 180);
                const y1 = 16 + 14 * Math.sin((currentAngle * Math.PI) / 180);
                const x2 = 16 + 14 * Math.cos((endAngle * Math.PI) / 180);
                const y2 = 16 + 14 * Math.sin((endAngle * Math.PI) / 180);
                
                const largeArcFlag = angle > 180 ? 1 : 0;
                
                const pathData = [
                  `M 16 16`,
                  `L ${x1} ${y1}`,
                  `A 14 14 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                  `Z`
                ].join(' ');
                
                currentAngle = endAngle;
                
                return (
                  <path
                    key={index}
                    d={pathData}
                    fill={item.color}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold text-stone-900">
                  {total.toLocaleString()}
                </div>
                <div className="text-xs text-stone-500">NPR</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-stone-600">{item.label}</span>
              </div>
              <span className="font-semibold text-stone-700">
                {item.value.toLocaleString()} NPR
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!storeAnalysis) return null;

  // Prepare data for charts
  const monthlySalesData = storeAnalysis.monthly_sales || [];
  const dailySalesData = storeAnalysis.daily_sales || [];
  
  const donationBreakdown = [
    {
      label: 'Direct Donations',
      value: storeAnalysis.direct_donations || 0,
      color: '#8b5cf6'
    },
    {
      label: 'Store Charity (2%)',
      value: storeAnalysis.charity_amount || 0,
      color: '#10b981'
    },
    {
      label: 'Already Donated',
      value: storeAnalysis.donated_amount || 0,
      color: '#3b82f6'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Monthly Sales Bar Chart */}
        <SimpleBarChart
          data={monthlySalesData}
          title="Monthly Sales"
          color="bg-emerald-500"
          valueKey="sales"
          labelKey="month"
        />

        {/* Daily Sales Trend */}
        <SimpleLineChart
          data={dailySalesData.slice(-7)}
          title="Daily Sales Trend (7 Days)"
          valueKey="sales"
          labelKey="date"
          color="#10b981"
        />

        {/* Donation Breakdown */}
        <DonutChart
          data={donationBreakdown}
          title="Donation Sources"
        />

        {/* Monthly Orders */}
        <SimpleBarChart
          data={monthlySalesData}
          title="Monthly Orders"
          color="bg-blue-500"
          valueKey="orders"
          labelKey="month"
        />

        {/* Monthly Charity */}
        <SimpleBarChart
          data={monthlySalesData}
          title="Monthly Charity (2%)"
          color="bg-purple-500"
          valueKey="charity"
          labelKey="month"
        />

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl p-6 border border-stone-100">
          <h4 className="text-sm font-semibold text-stone-700 mb-4">Quick Stats</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-stone-500">Avg Order Value</span>
              <span className="text-sm font-semibold text-stone-700">
                {storeAnalysis.total_orders > 0 
                  ? Math.round(storeAnalysis.total_sales / storeAnalysis.total_orders).toLocaleString()
                  : 0} NPR
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-stone-500">Charity Rate</span>
              <span className="text-sm font-semibold text-stone-700">
                {storeAnalysis.total_sales > 0 
                  ? ((storeAnalysis.charity_amount / storeAnalysis.total_sales) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-stone-500">Pending Donations</span>
              <span className="text-sm font-semibold text-emerald-600">
                {storeAnalysis.pending_donation.toLocaleString()} NPR
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
