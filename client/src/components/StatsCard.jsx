import React from 'react';

const StatsCard = ({ title, value, subtitle, icon: Icon, color = 'blue', trend }) => {
  const colorStyles = {
    blue: {
      bgIcon: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
      border: 'hover:border-blue-300 dark:hover:border-blue-700',
      badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300'
    },
    green: {
      bgIcon: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
      border: 'hover:border-emerald-300 dark:hover:border-emerald-700',
      badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
    },
    amber: {
      bgIcon: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
      border: 'hover:border-amber-300 dark:hover:border-amber-700',
      badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
    },
    red: {
      bgIcon: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
      border: 'hover:border-rose-300 dark:hover:border-rose-700',
      badge: 'bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
    }
  };

  const style = colorStyles[color] || colorStyles.blue;

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-card-hover ${style.border}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</span>
        <div className={`p-2.5 rounded-xl ${style.bgIcon} transition-colors`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {value}
        </span>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style.badge}`}>
            {trend}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium truncate">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default StatsCard;
