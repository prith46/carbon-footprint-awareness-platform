import { useMemo } from 'react';
import { useActivityLog } from '../context/ActivityContext';
import { Link } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingDown, ArrowRight } from 'lucide-react';
import ChartTooltip from '../components/ChartTooltip';
import WeeklyStats from '../components/WeeklyStats';
import LogTable from '../components/LogTable';

const Progress = () => {
  const { logs, deleteLog } = useActivityLog();

  const {
    lineChartData,
    barChartData,
    sortedLogs
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

    const bData = Object.keys(category30DaysMap).map(cat => ({
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      value: category30DaysMap[cat]
    }));

    return {
      lineChartData: lData,
      barChartData: bData,
      sortedLogs: sorted
    };
  }, [logs]);

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

      <WeeklyStats sevenDayLogs={lineChartData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <Tooltip content={ChartTooltip} />
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
                <Tooltip content={ChartTooltip} cursor={{ fill: '#334155', opacity: 0.4 }} />
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

      <LogTable logs={sortedLogs} onDelete={deleteLog} />
    </div>
  );
};

export default Progress;
