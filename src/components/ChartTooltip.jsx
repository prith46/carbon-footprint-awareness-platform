import { memo } from 'react';
import PropTypes from 'prop-types';

const ChartTooltip = ({ active, payload, label, unit = "kg CO₂" }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      return null;
    }
    const formattedValue = Number.isInteger(value) ? value : value.toFixed(1);
    const displayLabel = label || payload[0].name || payload[0].payload?.name;

    return (
      <div id="chart-tooltip" role="tooltip" className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl">
        <p className="text-slate-300 font-medium mb-1">{displayLabel}</p>
        <p className="text-emerald-400 font-bold">{formattedValue} {unit}</p>
      </div>
    );
  }
  return null;
};

ChartTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.number,
    name: PropTypes.string,
    payload: PropTypes.object,
  })),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  unit: PropTypes.string,
};

export default memo(ChartTooltip);
