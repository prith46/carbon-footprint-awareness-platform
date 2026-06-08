import { useState, useEffect } from 'react';
import { useActivityLog } from '../hooks/useActivityLog';
import { emissionFactors } from '../data/emissionFactors';
import { Trash2, CheckCircle2 } from 'lucide-react';

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
  electricity: 'Electricity Usage',
  ac_hour: 'AC Usage',
  heating_hour: 'Heating Usage',
  new_clothing: 'New Clothing',
  electronics: 'Electronics',
  secondhand: 'Secondhand Item'
};

const categoryLabels = {
  transport: 'Transport',
  food: 'Food',
  energy: 'Energy',
  shopping: 'Shopping'
};

const quantityLabels = {
  transport: 'Distance (km)',
  food: 'Number of Meals',
  energy: 'Units (kWh / Hours)',
  shopping: 'Number of Items'
};

const Log = () => {
  const { logs, addLog, deleteLog } = useActivityLog();
  
  const [category, setCategory] = useState('transport');
  const [type, setType] = useState('car_petrol');
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const firstType = Object.keys(emissionFactors[category])[0];
    setType(firstType);
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!quantity || quantity <= 0) return;

    addLog({
      category,
      type,
      quantity: Number(quantity),
      date
    });

    setQuantity('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const sortedLogs = [...logs]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Log Activity</h1>
        <p className="text-slate-400">Record your daily activities to track your carbon footprint.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        {showSuccess && (
          <div className="absolute top-0 left-0 w-full bg-emerald-500 text-slate-950 font-medium text-sm py-2 px-4 flex items-center justify-center space-x-2 z-10 transition-all">
            <CheckCircle2 size={18} />
            <span>Activity logged!</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-1.5">Category</label>
            <div className="relative">
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-colors appearance-none"
              >
                {Object.keys(emissionFactors).map(cat => (
                  <option key={cat} value={cat}>{categoryLabels[cat]}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-slate-300 mb-1.5">Activity Type</label>
            <div className="relative">
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-colors appearance-none"
              >
                {Object.keys(emissionFactors[category]).map(t => (
                  <option key={t} value={t}>{typeLabels[t] || t}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-slate-300 mb-1.5">{quantityLabels[category]}</label>
            <input
              id="quantity"
              type="number"
              min="0"
              step="0.1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-colors"
              placeholder={`Enter ${quantityLabels[category].toLowerCase()}`}
              required
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-300 mb-1.5">Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-colors [color-scheme:dark]"
              required
            />
          </div>

          <div className="md:col-span-2 flex justify-end mt-2">
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-8 py-2.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg shadow-emerald-500/20"
            >
              Add Activity
            </button>
          </div>
        </form>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-800/20">
          <h2 className="text-lg font-semibold text-slate-100">Recent Logs</h2>
        </div>
        
        {sortedLogs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
              <CheckCircle2 size={24} className="text-slate-500" />
            </div>
            <p className="text-slate-400">No activities logged yet. Start above.</p>
          </div>
        ) : (
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
                {sortedLogs.map(log => (
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
        )}
      </div>
    </div>
  );
};

export default Log;
