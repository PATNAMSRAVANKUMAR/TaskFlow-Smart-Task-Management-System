import React from 'react';
import { Menu, Plus, Bell, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ onOpenMobileMenu, onOpenAddTask, title, subtitle }) => {
  const { user } = useAuth();

  // Dynamic greeting based on current local hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const displayName = user?.name ? user.name.split(' ')[0] : 'there';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="flex items-center space-x-3">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Greeting / Dynamic title */}
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>{title || `${getGreeting()}, ${displayName}`}</span>
            <span className="inline-block animate-pulse text-brand-500">✨</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            {subtitle || 'Stay organized and get things done.'}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onOpenAddTask}
          className="inline-flex items-center space-x-2 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-brand-500/25 active:scale-95 transition-all duration-200"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">Add Task</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
