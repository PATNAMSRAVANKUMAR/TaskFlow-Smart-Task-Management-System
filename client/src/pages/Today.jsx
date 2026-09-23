import React from 'react';
import { Calendar, CheckCircle2, ListTodo, Plus } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';

const Today = ({ onOpenAddTask, onEditTask, onDeleteTask }) => {
  const { tasks, toggleComplete } = useTasks();

  const today = new Date();
  const todayTasks = tasks.filter((t) => {
    if (!t.dueDate) return false;
    const d = new Date(t.dueDate);
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  });

  const completedTodayTasks = todayTasks.filter((t) => t.status === 'Completed');
  const completionRate =
    todayTasks.length > 0 ? Math.round((completedTodayTasks.length / todayTasks.length) * 100) : 0;

  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Date Banner & Daily Focus */}
      <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-indigo-700 text-white rounded-2xl p-6 shadow-md shadow-brand-500/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-100 text-xs font-bold uppercase tracking-wider mb-1">
              <Calendar className="w-4 h-4" />
              <span>Daily Focus</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">{formattedDate}</h2>
            <p className="text-xs sm:text-sm text-indigo-100/90 mt-1">
              {todayTasks.length === 0
                ? "You have no tasks scheduled for today."
                : `You've completed ${completedTodayTasks.length} of ${todayTasks.length} tasks scheduled today.`}
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20">
            <div>
              <span className="text-2xl font-black block leading-none">{completionRate}%</span>
              <span className="text-[11px] text-indigo-100 block font-medium">Daily Target</span>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Mini progress bar */}
        {todayTasks.length > 0 && (
          <div className="mt-4 w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        )}
      </div>

      {/* Task List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <ListTodo className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <span>Today's Schedule</span>
          </h3>

          <button
            onClick={onOpenAddTask}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:hover:bg-brand-900 text-brand-700 dark:text-brand-300 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Task for Today</span>
          </button>
        </div>

        {todayTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todayTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggleComplete={toggleComplete}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Clear schedule for today!"
            description="No tasks are currently scheduled for today. You can add one or plan your upcoming week."
            actionText="+ Add Task For Today"
            onAction={onOpenAddTask}
          />
        )}
      </div>
    </div>
  );
};

export default Today;
