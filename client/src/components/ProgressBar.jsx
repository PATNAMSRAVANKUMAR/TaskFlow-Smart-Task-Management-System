import React from 'react';
import { Target, TrendingUp, CheckCircle2 } from 'lucide-react';

const ProgressBar = ({ completed, total, percentage, completedToday = 0, completedThisWeek = 0 }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Overall Progress</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {completed} of {total} tasks completed
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-black text-brand-600 dark:text-brand-400">{percentage}%</span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300">
            {percentage === 100 && total > 0 ? 'All caught up! 🎉' : 'In Progress'}
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="relative w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-500 ease-out shadow-sm"
          style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
        />
      </div>

      {/* Productivity Summary Chips */}
      <div className="mt-5 grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Completed Today</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{completedToday} tasks</span>
          </div>
        </div>
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">This Week</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{completedThisWeek} tasks</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
