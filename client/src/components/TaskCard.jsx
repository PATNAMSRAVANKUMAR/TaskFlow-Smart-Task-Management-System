import React from 'react';
import { Calendar, Clock, Edit3, Trash2, CheckCircle2, Circle, AlertCircle, Tag } from 'lucide-react';

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const isCompleted = task.status === 'Completed';

  // Smart Overdue detection
  const now = new Date();
  const dueDateObj = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDateObj && dueDateObj < now && !isCompleted;

  // Format Due Date
  const formatDueDate = (date) => {
    if (!date) return 'No due date';
    const d = new Date(date);
    const today = new Date();
    const isToday =
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();

    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const isTomorrow =
      d.getDate() === tomorrow.getDate() &&
      d.getMonth() === tomorrow.getMonth() &&
      d.getFullYear() === tomorrow.getFullYear();

    if (isToday) return 'Today';
    if (isTomorrow) return 'Tomorrow';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Priority Styles
  const priorityStyles = {
    High: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900',
    Low: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900'
  };

  // Status Styles
  const statusStyles = {
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900',
    'In Progress': 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-900',
    Pending: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
  };

  return (
    <div
      className={`group relative bg-white dark:bg-slate-900 rounded-2xl p-5 border transition-all duration-300 shadow-sm hover:shadow-card-hover ${
        isCompleted
          ? 'opacity-75 border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40'
          : isOverdue
          ? 'border-rose-300 dark:border-rose-900/80 shadow-rose-500/5'
          : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          {/* Custom Checkbox */}
          <button
            type="button"
            onClick={() => onToggleComplete(task._id)}
            className="mt-0.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors shrink-0 focus:outline-none"
            title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
            ) : (
              <Circle className="w-5 h-5 hover:scale-110 transition-transform" />
            )}
          </button>

          {/* Title & Description */}
          <div className="flex-1 min-w-0">
            <h4
              className={`text-base font-semibold leading-snug break-words transition-all ${
                isCompleted
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              {task.title}
            </h4>

            {task.description && (
              <p
                className={`text-sm mt-1 leading-relaxed break-words ${
                  isCompleted
                    ? 'line-through text-slate-400 dark:text-slate-600'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {task.description}
              </p>
            )}

            {/* Badges / Metadata */}
            <div className="mt-3.5 flex flex-wrap items-center gap-2">
              {/* Priority */}
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                  priorityStyles[task.priority] || priorityStyles.Medium
                }`}
              >
                {task.priority} Priority
              </span>

              {/* Category */}
              {task.category && (
                <span className="inline-flex items-center space-x-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <Tag className="w-3 h-3 text-slate-400" />
                  <span>{task.category}</span>
                </span>
              )}

              {/* Status */}
              <span
                className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${
                  statusStyles[task.status] || statusStyles.Pending
                }`}
              >
                {task.status}
              </span>

              {/* Due Date & Overdue */}
              {task.dueDate && (
                <span
                  className={`inline-flex items-center space-x-1 text-xs font-medium px-2.5 py-0.5 rounded-full border ${
                    isOverdue
                      ? 'bg-rose-100/90 text-rose-800 border-rose-300 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800'
                      : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800/80 dark:text-slate-400 dark:border-slate-700'
                  }`}
                >
                  {isOverdue ? (
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                  ) : (
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                  <span>{isOverdue ? `Overdue: ${formatDueDate(task.dueDate)}` : formatDueDate(task.dueDate)}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1 shrink-0 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Edit task"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(task._id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
