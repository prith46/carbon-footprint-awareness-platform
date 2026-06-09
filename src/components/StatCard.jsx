const colorMap = {
  emerald: { bg: 'bg-emerald-500/10', textMain: 'text-emerald-400', textBg: 'text-emerald-500' },
  blue: { bg: 'bg-blue-500/10', textMain: 'text-blue-400', textBg: 'text-blue-500' },
  purple: { bg: 'bg-purple-500/10', textMain: 'text-purple-400', textBg: 'text-purple-500' },
  red: { bg: 'bg-red-500/10', textMain: 'text-red-400', textBg: 'text-red-500' },
};

const StatCard = ({ icon: Icon, label, value, subtext, color = 'emerald', valueClass }) => {
  const c = colorMap[color] || colorMap.emerald;
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon className={`w-24 h-24 ${c.textBg}`} />
      </div>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-400 text-sm font-medium">{label}</p>
          <h3 className={`text-2xl font-bold mt-1 ${valueClass || 'text-slate-100'}`}>
            {value} {subtext && <span className="text-base font-normal opacity-70">{subtext}</span>}
          </h3>
        </div>
        <div className={`p-2 rounded-lg ${c.bg}`}>
          <Icon size={20} className={c.textMain} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
