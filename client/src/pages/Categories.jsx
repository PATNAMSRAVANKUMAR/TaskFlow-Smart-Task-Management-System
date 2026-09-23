import React from 'react';
import {
  FolderKanban,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Briefcase,
  User,
  Book,
  Heart,
  ShoppingBag,
  Tag
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';

const Categories = ({ onOpenCategoryModal, onDeleteCategory, onSelectCategory }) => {
  const { categories } = useTasks();

  const getIcon = (name) => {
    switch (name?.toLowerCase()) {
      case 'work':
        return Briefcase;
      case 'personal':
        return User;
      case 'study':
        return Book;
      case 'health':
        return Heart;
      case 'shopping':
        return ShoppingBag;
      default:
        return Tag;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-600 dark:text-brand-400 font-bold text-xs uppercase tracking-wider mb-1">
            <FolderKanban className="w-4 h-4" />
            <span>Organization</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Categories</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Segment your tasks into structured domains and track category-specific progress.
          </p>
        </div>

        <button
          onClick={onOpenCategoryModal}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-brand-500/20 active:scale-95 transition-all self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const Icon = getIcon(cat.name);
          const percent =
            cat.totalTasks > 0 ? Math.round((cat.completedTasks / cat.totalTasks) * 100) : 0;

          return (
            <div
              key={cat._id || cat.name}
              className="group bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-card-hover transition-all duration-300 relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
                      style={{ backgroundColor: cat.color || '#6366f1' }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {cat.name}
                      </h3>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                        {cat.isDefault ? 'Default' : 'Custom Category'}
                      </span>
                    </div>
                  </div>

                  {!cat.isDefault && (
                    <button
                      type="button"
                      onClick={() => onDeleteCategory(cat)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-all"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Progress bar */}
                <div className="mt-5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Completion</span>
                    <span className="font-bold text-slate-900 dark:text-white">{percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: cat.color || '#6366f1'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Stats Footer */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-xs text-slate-400 block font-medium">Total</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {cat.totalTasks || 0}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
                  <span className="text-xs text-emerald-600/80 dark:text-emerald-400/80 block font-medium">
                    Done
                  </span>
                  <span className="text-sm font-bold">{cat.completedTasks || 0}</span>
                </div>
                <div className="p-2 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300">
                  <span className="text-xs text-amber-600/80 dark:text-amber-400/80 block font-medium">
                    Pending
                  </span>
                  <span className="text-sm font-bold">{cat.pendingTasks || 0}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
