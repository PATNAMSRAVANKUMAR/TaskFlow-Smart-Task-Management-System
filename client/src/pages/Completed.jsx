import React from 'react';
import { CheckCircle2, RotateCcw, Trash2, Calendar, Tag, AlertCircle } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import EmptyState from '../components/EmptyState';

const Completed = ({ onDeleteTask }) => {
  const { tasks, toggleComplete } = useTasks();

  const completedTasks = tasks.filter((t) => t.status === 'Completed');

  const formatDate = (date) => {
    if (!date) return 'Recently';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const priorityStyles = {
    High: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900',
    Low: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900'
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Achievement Archive</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Completed Tasks</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review your finished accomplishments or restore items back to your workflow.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900">
          {completedTasks.length} accomplished
        </span>
      </div>

      {completedTasks.length > 0 ? (
        <div className="space-y-3">
          {completedTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-slate-300 dark:hover:border-slate-700"
            >
              <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200 line-through">
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 truncate">
                      {task.description}
                    </p>
                  )}

                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    {/* Priority */}
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                        priorityStyles[task.priority] || priorityStyles.Medium
                      }`}
                    >
                      {task.priority}
                    </span>

                    {/* Category */}
                    <span className="inline-flex items-center space-x-1 text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      <Tag className="w-3 h-3 text-slate-400" />
                      <span>{task.category || 'General'}</span>
                    </span>

                    {/* Completed At */}
                    <span className="inline-flex items-center space-x-1 text-xs text-slate-400">
                      <Calendar className="w-3 h-3" />
                      <span>Completed: {formatDate(task.completedAt || task.updatedAt)}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => toggleComplete(task._id)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  title="Restore task to pending"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                  <span>Restore</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteTask(task._id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-colors"
                  title="Permanently delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No completed tasks yet"
          description="Tasks you finish will be saved here so you can review your progress and achievements."
        />
      )}
    </div>
  );
};

export default Completed;
