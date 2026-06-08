import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useActivityLog } from '../hooks/useActivityLog';
import { useUserProfile } from '../hooks/useUserProfile';
import { calculateEmissions } from '../utils/calculateEmissions';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { 
  Leaf, 
  Car, 
  Utensils, 
  Zap, 
  ShoppingBag, 
  Activity, 
  Target, 
  Award, 
  CalendarDays, 
  ArrowRight 
} from 'lucide-react';

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

const categoryIcons = {
  transport: <Car size={18} className="text-blue-400" />,
  food: <Utensils size={18} className="text-orange-400" />,
  energy: <Zap size={18} className="text-yellow-400" />,
  shopping: <ShoppingBag size={18} className="text-purple-400" />
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl">
        <p className="text-slate-300 font-medium mb-1">{payload[0].payload.name}</p>
        <p className="text-emerald-400 font-bold">{payload[0].value.toFixed(1)} kg CO₂</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const { logs } = useActivityLog();
  const { profile } = useUserProfile();

  const currentDate = new Date();
  
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('en-US', dateOptions);

  const {
    currentMonthLogs,
    monthTotal,
    monthBreakdown,
    highestCategoryName,
    savedCO2,
    chartData,
    recentLogs
  } = useMemo(() => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const currentDay = currentDate.getDate();

    const monthLogs = logs.filter(log => {
      const logDate = new Date(log.date);
      return logDate.getMonth() === month && logDate.getFullYear() === year;
    });

    const { total, breakdown } = calculateEmissions(monthLogs);

    const highest = Object.entries(breakdown).reduce((a, b) => b[1] > a[1] ? b : a, ['', 0]);
    const highestName = highest[1] > 0 ? highest[0] : 'None';

    const avgIndianCO2 = currentDay * 1.5;
    const saved = avgIndianCO2 - total;

    const cData = [
      { name: 'Transport', value: breakdown.transport || 0 },
      { name: 'Food', value: breakdown.food || 0 },
      { name: 'Energy', value: breakdown.energy || 0 },
      { name: 'Shopping', value: breakdown.shopping || 0 },
    ];

    const recent = [...logs]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    return {
      currentMonthLogs: monthLogs,
      monthTotal: total,
      monthBreakdown: breakdown,
      highestCategoryName: highestName,
      savedCO2: saved,
      chartData: cData,
      recentLogs: recent
    };
  }, [logs]);

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
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Activity className="w-24 h-24 text-emerald-500" />
          </div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-400 text-sm font-medium">This Month</p>
              <h3 className="text-2xl font-bold text-slate-100 mt-1">{monthTotal.toFixed(1)} <span className="text-base font-normal text-slate-500">kg CO₂</span></h3>
            </div>
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Target size={20} className="text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Award className="w-24 h-24 text-blue-500" />
          </div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-400 text-sm font-medium">Highest Impact</p>
              <h3 className="text-2xl font-bold text-slate-100 mt-1 capitalize">{highestCategoryName}</h3>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Activity size={20} className="text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <CalendarDays className="w-24 h-24 text-purple-500" />
          </div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-400 text-sm font-medium">Activities (Month)</p>
              <h3 className="text-2xl font-bold text-slate-100 mt-1">{currentMonthLogs.length}</h3>
            </div>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <CalendarDays size={20} className="text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Leaf className="w-24 h-24 text-emerald-500" />
          </div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-400 text-sm font-medium">Saved vs. Average</p>
              <h3 className={`text-2xl font-bold mt-1 ${savedCO2 >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {savedCO2 >= 0 ? '+' : ''}{savedCO2.toFixed(1)} <span className="text-base font-normal opacity-70">kg CO₂</span>
              </h3>
            </div>
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Leaf size={20} className="text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-100 mb-6">Emissions Breakdown (This Month)</h2>
          <div className="h-72 w-full">
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
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#334155', opacity: 0.4 }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#10b981' : '#334155'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-100">Recent Logs</h2>
            <Link to="/log" className="text-sm text-emerald-400 hover:text-emerald-300 font-medium">View All</Link>
          </div>
          <div className="space-y-4">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-700/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-slate-800 rounded-lg">
                    {categoryIcons[log.category] || <Activity size={18} className="text-slate-400" />}
                  </div>
                  <div>
                    <p className="text-slate-200 font-medium text-sm">{typeLabels[log.type] || log.type}</p>
                    <p className="text-slate-500 text-xs">{log.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-bold text-sm">+{log.kgCO2.toFixed(1)}</p>
                  <p className="text-slate-500 text-xs">kg CO₂</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
