import { memo } from 'react';
import { quickActionsDB } from '../data/quickActions';

const QuickActions = ({ highestCategoryName, checkedActions, onCheck }) => {
  if (!checkedActions || typeof checkedActions.has !== 'function') return null;

  const actions = quickActionsDB[highestCategoryName] || quickActionsDB.generic;
  
  return (
    <div>
      <h2 id="quick-actions-heading" className="text-lg font-semibold text-slate-100 mb-4">Quick Actions for Today</h2>
      <div role="group" aria-labelledby="quick-actions-heading" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action) => {
          const isChecked = checkedActions.has(action.id);
          return (
            <label
              key={action.id}
              className={`flex items-start p-4 rounded-xl border cursor-pointer transition-all ${
                isChecked
                  ? 'bg-emerald-500/10 border-emerald-500/50'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center h-5 mt-0.5">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900 bg-slate-800 transition-colors"
                  checked={isChecked}
                  onChange={() => onCheck(action.id)}
                />
              </div>
              <div className="ml-3 flex-1">
                <p className={`text-sm font-medium transition-colors ${isChecked ? 'text-emerald-400 line-through opacity-70' : 'text-slate-200'}`}>
                  {action.text}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Saves ~{action.saving} CO₂
                  {isChecked && <span className="sr-only"> (completed for today)</span>}
                </p>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default memo(QuickActions);
