import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useActivityLog } from '../context/ActivityContext';
import { useUserProfile } from '../context/ProfileContext';
import { calculateEmissions } from '../utils/calculateEmissions';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, Award, CalendarDays, Leaf, ArrowRight } from 'lucide-react';
import ChartTooltip from '../components/ChartTooltip';
import StatCard from '../components/StatCard';
import QuickActions from '../components/QuickActions';
import RecentLogs from '../components/RecentLogs';
import { AVG_INDIAN_CO2_PER_DAY, RECENT_LOGS_LIMIT } from '../data/constants';

const Dashboard = () => {
  const { logs, totalCO2, breakdown } = useActivityLog();
  const { profile } = useUserProfile();
  const [checkedActions, setCheckedActions] = useState(new Set());

  const handleCheck = useCallback((id) => {
    setCheckedActions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  }, []);

  const {
    currentMonthLogs,
    monthTotal,
    highestCategoryName,
    savedCO2,
    chartData,
    recentLogs,
    formattedDate
  } = useMemo(() => {
    const currentDate = new Date();
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = currentDate.toLocaleDateString('en-US', dateOptions);

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const currentDay = currentDate.getDate();

    const monthLogs = logs.filter(log => {
      const logDate = new Date(log.date);
      return logDate.getMonth() === month && logDate.getFullYear() === year;
    });

    const { total: monthTotal, breakdown: monthBreakdown } = calculateEmissions(monthLogs);

    const highest = Object.entries(monthBreakdown).reduce((a, b) => b[1] > a[1] ? b : a, ['', 0]);
    const highestName = highest[1] > 0 ? highest[0] : 'None';

    const avgIndianCO2 = currentDay * AVG_INDIAN_CO2_PER_DAY;
    const saved = avgIndianCO2 - monthTotal;

    const cData = [
      { name: 'Transport', value: monthBreakdown.transport || 0 },
      { name: 'Food', value: monthBreakdown.food || 0 },
      { name: 'Energy', value: monthBreakdown.energy || 0 },
      { name: 'Shopping', value: monthBreakdown.shopping || 0 },
    ];

    const recent = [...logs]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, RECENT_LOGS_LIMIT);

    return {
      currentMonthLogs: monthLogs,
      monthTotal,
      highestCategoryName: highestName,
      savedCO2: saved,
      chartData: cData,
      recentLogs: recent,
      formattedDate: dateString
    };
  }, [logs, totalCO2, breakdown]);

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 max-w-lg w-full shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="bg-slate-800 p-4 rounded-full">
              <Leaf className="w-12 h-12 text-emerald-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mb-3">Welcome to CarbonTrace, {profile.name}!</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Your dashboard is currently empty. Start logging your daily activities to see your carbon footprint breakdown and discover ways to reduce it.
          </p>
          <Link
            to="/log"
            className="inline-flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-6 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg shadow-emerald-500/20"
          >
            <span>Log First Activity</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-1">Hello, {profile.name || 'Friend'} 👋</h1>
          <p className="text-slate-400 flex items-center gap-2">
            <CalendarDays size={16} />
            <span>{formattedDate}</span>
          </p>
        </div>
        <Link
          to="/log"
          className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          <span>Log Activity</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={Activity} 
          label="This Month" 
          value={monthTotal.toFixed(1)} 
          subtext="kg CO₂" 
          color="emerald" 
        />
        <StatCard 
          icon={Award} 
          label="Highest Impact" 
          value={<span className="capitalize">{highestCategoryName}</span>} 
          color="blue" 
        />
        <StatCard 
          icon={CalendarDays} 
          label="Activities (Month)" 
          value={currentMonthLogs.length} 
          color="purple" 
        />
        <StatCard 
          icon={Leaf} 
          label="Saved vs. Average" 
          value={Math.abs(savedCO2).toFixed(1)} 
          subtext={`kg ${savedCO2 >= 0 ? 'below' : 'above'} avg`} 
          color="emerald" 
          valueClass={savedCO2 >= 0 ? 'text-emerald-400' : 'text-red-400'}
        />
      </div>

      <QuickActions 
        highestCategoryName={highestCategoryName} 
        checkedActions={checkedActions} 
        onCheck={handleCheck} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-100 mb-6">Emissions Breakdown (This Month)</h2>
          <div className="h-72 w-full" aria-label="Monthly emissions by category in kg CO2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
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
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#10b981' : '#334155'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <RecentLogs logs={recentLogs} />
      </div>
    </div>
  );
};

export default Dashboard;
