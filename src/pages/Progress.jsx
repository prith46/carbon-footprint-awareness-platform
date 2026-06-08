import { useState, useMemo } from 'react';
import { useActivityLog } from '../hooks/useActivityLog';
import { Link } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingDown, Calendar, ArrowRight, Trash2, Activity, Award } from 'lucide-react';

const typeLabels = {
  car_petrol: 'Car (Petrol)',
  car_diesel: 'Car (Diesel)',
  bus: 'Bus',
  train: 'Train',
  flight_domestic: 'Flight (Domestic)',
  bike: 'Bike',
  walk: 'Walk',
  beef_meal: 'Beef Meal',
  chicken_meal: 'Chicken Meal',
  fish_meal: 'Fish Meal',
  veg_meal: 'Vegetarian Meal',
  vegan_meal: 'Vegan Meal',
  electricity: 'Electricity',
  ac_hour: 'AC Usage',
  heating_hour: 'Heating',
  new_clothing: 'New Clothing',
  electronics: 'Electronics',
  secondhand: 'Secondhand Item'
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl">
        <p className="text-slate-300 font-medium mb-1">{label}</p>
        <p className="text-emerald-400 font-bold">{payload[0].value.toFixed(1)} kg CO₂</p>
      </div>
    );
  }
  return null;
};

const Progress = () => {
  const { logs, deleteLog } = useActivityLog();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    lineChartData,
    total7Days,
    dailyAvg,
    bestDayStr,
    barChartData,
    sortedLogs,
    totalPages,
    paginatedLogs
  } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 7-Day Logic
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      last7Days.push(d);
    }

    const dayMap = {};
    last7Days.forEach(d => {
      // Create local YYYY-MM-DD
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      dayMap[dateStr] = 0;
    });

    // 30-Day Logic
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const category30DaysMap = { transport: 0, food: 0, energy: 0, shopping: 0 };

    // Process logs
    const sorted = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));

    sorted.forEach(log => {
      // 7-day check
      if (dayMap[log.date] !== undefined) {
        dayMap[log.date] += log.kgCO2;
      }

      // 30-day check
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      if (logDate >= thirtyDaysAgo && logDate <= today) {
        if (category30DaysMap[log.category] !== undefined) {
          category30DaysMap[log.category] += log.kgCO2;
        }
      }
    });

    const lData = last7Days.map(d => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      return {
        name: dayName,
        value: dayMap[dateStr]
      };
    });

    const t7Days = lData.reduce((acc, curr) => acc + curr.value, 0);
    const dAvg = t7Days / 7;

    const nonZeroDays = lData.filter(d => d.value > 0);
    const bestDayData = nonZeroDays.length > 0 
      ? nonZeroDays.reduce((min, curr) => curr.value < min.value ? curr : min, nonZeroDays[0])
      : null;
    const bDayStr = bestDayData ? `${bestDayData.name} (${bestDayData.value.toFixed(1)} kg)` : 'N/A';

    const bData = Object.keys(category30DaysMap).map(cat => ({
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      value: category30DaysMap[cat]
    }));

    const tPages = Math.ceil(sorted.length / itemsPerPage);
    const pLogs = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return {
      lineChartData: lData,
      total7Days: t7Days,
      dailyAvg: dAvg,
      bestDayStr: bDayStr,
      barChartData: bData,
      sortedLogs: sorted,
      totalPages: tPages,
      paginatedLogs: pLogs
    };
  }, [logs, currentPage]);

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 max-w-lg w-full shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="bg-slate-800 p-4 rounded-full">
              <TrendingDown className="w-12 h-12 text-emerald-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mb-3">Nothing to show yet.</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Start logging your activities to see your historical trends and carbon reduction progress over time.
          </p>
          <Link
            to="/log"
            className="inline-flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-6 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg shadow-emerald-500/20"
          >
            <span>Log Activity</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Your Progress</h1>
        <p className="text-slate-400">Track your historical trends and reductions.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between group">
          <div>
            <p className="text-slate-400 text-sm font-medium">7-Day Total</p>
            <h3 className="text-2xl font-bold text-slate-100 mt-1">{total7Days.toFixed(1)} <span className="text-base font-normal text-slate-500">kg CO₂</span></h3>
          </div>
          <div className="p-3 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
            <Activity className="text-emerald-400" size={24} />
          </div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between group">
          <div>
            <p className="text-slate-400 text-sm font-medium">Daily Average (7d)</p>
            <h3 className="text-2xl font-bold text-slate-100 mt-1">{dailyAvg.toFixed(1)} <span className="text-base font-normal text-slate-500">kg CO₂</span></h3>
          </div>
          <div className="p-3 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
            <TrendingDown className="text-blue-400" size={24} />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between group">
          <div>
            <p className="text-slate-400 text-sm font-medium">Best Day (Lowest)</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">{bestDayStr}</h3>
          </div>
          <div className="p-3 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
            <Award className="text-purple-400" size={24} />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 7 Day Line Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-6">Emissions Trend (Last 7 Days)</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} 
                  activeDot={{ r: 6, fill: '#10b981', stroke: '#0f172a', strokeWidth: 2 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 30 Day Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-6">Category Trend (Last 30 Days)</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#334155', opacity: 0.4 }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {barChartData.map((entry, index) => {
                    const colors = ['#3b82f6', '#f97316', '#eab308', '#a855f7'];
                    return <Cell key={`cell-${index}`} fill={entry.value > 0 ? colors[index % colors.length] : '#334155'} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Log History Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-800/20 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">Log History</h2>
          <div className="text-sm text-slate-400">
            Total Entries: <span className="text-slate-200 font-medium">{sortedLogs.length}</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/50 text-xs uppercase font-medium text-slate-400">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4 text-right">Quantity</th>
                <th className="px-6 py-4 text-right">CO₂ (kg)</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {paginatedLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap text-slate-400">{log.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize font-medium text-slate-200">{log.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{typeLabels[log.type] || log.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-slate-300">{log.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-mono font-medium text-emerald-400">
                    {log.kgCO2.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => deleteLog(log.id)}
                      className="text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                      title="Delete log"
                      aria-label="Delete log"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-800/10 mt-auto">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-slate-400">
              Page <span className="font-medium text-slate-200">{currentPage}</span> of <span className="font-medium text-slate-200">{totalPages}</span>
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;
