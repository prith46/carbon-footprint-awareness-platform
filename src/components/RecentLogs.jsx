import { memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Activity, Car, Utensils, Zap, ShoppingBag } from 'lucide-react';
import { typeLabels } from '../data/labels';

const categoryIcons = {
  transport: <Car aria-hidden="true" size={18} className="text-blue-400" />,
  food: <Utensils aria-hidden="true" size={18} className="text-orange-400" />,
  energy: <Zap aria-hidden="true" size={18} className="text-yellow-400" />,
  shopping: <ShoppingBag aria-hidden="true" size={18} className="text-purple-400" />
};

const RecentLogs = ({ logs }) => {
  if (!logs) return null;
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-100">Recent Logs</h2>
        <Link to="/log" aria-label="View all activity logs" className="text-sm text-emerald-400 hover:text-emerald-300 font-medium">View All</Link>
      </div>
      <ul role="list" className="space-y-4">
        {logs.length === 0 ? (
          <li><p className="text-slate-400 text-sm text-center py-4">No recent logs yet.</p></li>
        ) : (
          logs.map((log) => (
            <li key={log.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-700/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-slate-800 rounded-lg">
                  {categoryIcons[log.category] || <Activity aria-hidden="true" size={18} className="text-slate-400" />}
                </div>
                <div>
                  <p className="text-slate-200 font-medium text-sm">{typeLabels[log.type] || log.type}</p>
                  <p className="text-slate-400 text-xs">{log.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-emerald-400 font-bold text-sm">
                  {typeof log.kgCO2 === 'number' && Number.isFinite(log.kgCO2) ? `+${log.kgCO2.toFixed(1)}` : '—'}
                </p>
                <p className="text-slate-400 text-xs">kg CO₂</p>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

RecentLogs.propTypes = {
  logs: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    kgCO2: PropTypes.number,
  })).isRequired,
};

export default memo(RecentLogs);
