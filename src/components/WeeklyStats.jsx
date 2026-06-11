import { useMemo, memo } from 'react';
import { Activity, TrendingDown, Award } from 'lucide-react';
import StatCard from './StatCard';

const WeeklyStats = ({ sevenDayLogs }) => {
  const { total7Days, dailyAvg, bestDayStr } = useMemo(() => {
    const safeLogs = sevenDayLogs || [];
    const t7Days = safeLogs
      .filter(d => typeof d.value === 'number' && Number.isFinite(d.value))
      .reduce((acc, curr) => acc + curr.value, 0);
    const dAvg = t7Days / 7;

    const nonZeroDays = safeLogs.filter(d => typeof d.value === 'number' && Number.isFinite(d.value) && d.value > 0);
    const bestDayData = nonZeroDays.length > 0 
      ? nonZeroDays.reduce((min, curr) => curr.value < min.value ? curr : min, nonZeroDays[0])
      : null;
    const bDayStr = bestDayData && Number.isFinite(bestDayData.value)
      ? `${bestDayData.name} (${bestDayData.value.toFixed(1)} kg)`
      : 'N/A';
    
    return { total7Days: t7Days, dailyAvg: dAvg, bestDayStr: bDayStr };
  }, [sevenDayLogs]);

  if (!sevenDayLogs) return null;

  return (
    <div role="region" aria-label="Weekly statistics" className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard icon={Activity} label="7-Day Total" value={Number.isFinite(total7Days) ? total7Days.toFixed(1) : '0.0'} subtext="kg CO₂" color="emerald" />
      <StatCard icon={TrendingDown} label="Daily Average (7d)" value={Number.isFinite(dailyAvg) ? dailyAvg.toFixed(1) : '0.0'} subtext="kg CO₂" color="blue" />
      <StatCard icon={Award} label="Best Day (Lowest)" value={bestDayStr} color="purple" />
    </div>
  );
};

export default memo(WeeklyStats);
