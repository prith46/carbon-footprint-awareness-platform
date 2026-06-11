import { useMemo, memo } from 'react';
import { Activity, TrendingDown, Award } from 'lucide-react';

const WeeklyStats = ({ sevenDayLogs }) => {
  const { total7Days, dailyAvg, bestDayStr } = useMemo(() => {
    const t7Days = sevenDayLogs
      .filter(d => typeof d.value === 'number' && Number.isFinite(d.value))
      .reduce((acc, curr) => acc + curr.value, 0);
    const dAvg = t7Days / 7;

    const nonZeroDays = sevenDayLogs.filter(d => d.value > 0);
    const bestDayData = nonZeroDays.length > 0 
      ? nonZeroDays.reduce((min, curr) => curr.value < min.value ? curr : min, nonZeroDays[0])
      : null;
    const bDayStr = bestDayData && Number.isFinite(bestDayData.value)
      ? `${bestDayData.name} (${bestDayData.value.toFixed(1)} kg)`
      : 'N/A';
    
    return { total7Days: t7Days, dailyAvg: dAvg, bestDayStr: bDayStr };
  }, [sevenDayLogs]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between group">
        <div>
          <p className="text-slate-400 text-sm font-medium">7-Day Total</p>
          <h3 className="text-2xl font-bold text-slate-100 mt-1">
            {Number.isFinite(total7Days) ? total7Days.toFixed(1) : '0.0'}{' '}
            <span className="text-base font-normal text-slate-400">kg CO₂</span>
          </h3>
        </div>
        <div className="p-3 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
          <Activity aria-hidden="true" className="text-emerald-400" size={24} />
        </div>
      </div>
      
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between group">
        <div>
          <p className="text-slate-400 text-sm font-medium">Daily Average (7d)</p>
          <h3 className="text-2xl font-bold text-slate-100 mt-1">
            {Number.isFinite(dailyAvg) ? dailyAvg.toFixed(1) : '0.0'}{' '}
            <span className="text-base font-normal text-slate-400">kg CO₂</span>
          </h3>
        </div>
        <div className="p-3 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
          <TrendingDown aria-hidden="true" className="text-blue-400" size={24} />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between group">
        <div>
          <p className="text-slate-400 text-sm font-medium">Best Day (Lowest)</p>
          <h3 className="text-2xl font-bold text-emerald-400 mt-1">{bestDayStr}</h3>
        </div>
        <div className="p-3 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
          <Award aria-hidden="true" className="text-purple-400" size={24} />
        </div>
      </div>
    </div>
  );
};

export default memo(WeeklyStats);
