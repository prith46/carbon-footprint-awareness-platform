import { useMemo } from 'react';
import { useActivityLog } from '../context/ActivityContext';
import { getInsights } from '../utils/getInsights';
import { Link } from 'react-router-dom';
import { Lightbulb, ArrowRight, Activity } from 'lucide-react';

const categoryColors = {
  food: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  transport: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  energy: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  shopping: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  general: 'bg-slate-500/20 text-slate-400 border-slate-500/30'
};

const difficultyColors = {
  easy: 'bg-emerald-500/20 text-emerald-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  hard: 'bg-red-500/20 text-red-400'
};

const Insights = () => {
  const { recentBreakdown } = useActivityLog();
  const tips = useMemo(() => getInsights(recentBreakdown), [recentBreakdown]);

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Your Insights</h1>
        <p className="text-slate-400">Based on your last 30 days of activity</p>
      </div>

      {tips.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center shadow-xl">
          <div className="flex justify-center mb-6">
            <div className="bg-slate-800 p-4 rounded-full">
              <Lightbulb className="w-12 h-12 text-slate-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-100 mb-3">No Recent Data</h2>
          <p className="text-slate-400 mb-6 max-w-md">
            No recent activity found. Log activities in the last 30 days to get personalized insights.
          </p>
          <Link
            to="/log"
            className="inline-flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-6 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg shadow-emerald-500/20"
          >
            <span>Log Activity</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tips.map((tipObj, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg hover:border-slate-700 transition-colors relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border uppercase tracking-wider ${categoryColors[tipObj.category] || categoryColors.general}`}>
                  {tipObj.category}
                </span>
                <span className={`px-2.5 py-1 text-xs font-medium rounded-md uppercase tracking-wider ${difficultyColors[tipObj.difficulty] || 'bg-slate-800 text-slate-400'}`}>
                  {tipObj.difficulty}
                </span>
              </div>
              
              <h3 className="text-lg text-slate-100 font-medium leading-relaxed mb-6">
                {tipObj.tip}
              </h3>
              
              <div className="mt-auto pt-4 border-t border-slate-800/50 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <Activity size={16} />
                    <span className="text-sm">Estimated Saving</span>
                  </div>
                  <span className="text-emerald-400 font-bold">{tipObj.estimatedSaving}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Insights;
