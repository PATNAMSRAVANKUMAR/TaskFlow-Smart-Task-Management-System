import React from 'react';
import {
  CheckSquare,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ArrowDown,
  Calendar
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import StatsCard from '../components/StatsCard';
import ProgressBar from '../components/ProgressBar';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import { scrollDown } from '../utils/scrollHelper';

const Dashboard = ({ onOpenAddTask, onEditTask, onDeleteTask, onNavigateToTasks }) => {
  const { tasks, stats, toggleComplete } = useTasks();

  // Filter tasks due today or urgent
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

  // Recent / priority tasks if no tasks specifically marked for today
  const activeTasks = tasks.filter((t) => t.status !== 'Completed').slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Tasks"
          value={stats.totalTasks}
          subtitle="All created tasks"
          icon={CheckSquare}
          color="blue"
          trend={`${stats.inProgressTasks} in progress`}
        />
        <StatsCard
          title="Completed"
          value={stats.completedTasks}
          subtitle="Successfully finished"
          icon={CheckCircle2}
          color="green"
          trend={`${stats.progressPercentage}% done`}
        />
        <StatsCard
          title="Pending"
          value={stats.pendingTasks}
          subtitle="Tasks to accomplish"
          icon={Clock}
          color="amber"
          trend="Action required"
        />
        <StatsCard
          title="Overdue"
          value={stats.overdueTasks}
          subtitle="Passed scheduled deadline"
          icon={AlertTriangle}
          color="red"
          trend={stats.overdueTasks > 0 ? 'Urgent' : 'On track'}
        />
      </div>

      {/* Overall Progress Section */}
      <div>
        <ProgressBar
          completed={stats.completedTasks}
          total={stats.totalTasks}
          percentage={stats.progressPercentage}
          completedToday={stats.completedToday}
          completedThisWeek={stats.completedThisWeek}
        />
      </div>

      {/* Today's Tasks Section */}
      <div id="tasks-section" className="space-y-4 scroll-mt-24">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Today's Tasks
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {todayTasks.length > 0
                  ? `${todayTasks.length} task${todayTasks.length > 1 ? 's' : ''} scheduled for today`
                  : 'Tasks due today or active priorities'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => scrollDown()}
              title="Scroll down to view tasks (Down by Down)"
              className="hidden sm:inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors cursor-pointer"
            >
              <ArrowDown className="w-3.5 h-3.5" />
              <span>Scroll down</span>
            </button>

            <button
              onClick={() => onNavigateToTasks()}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
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
        ) : activeTasks.length > 0 ? (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 text-xs font-medium">
              No tasks explicitly due today. Showing your top priority active tasks:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggleComplete={toggleComplete}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            title="All tasks completed!"
            description="You have no pending tasks right now. Take a break or plan what's next."
            actionText="+ Add New Task"
            onAction={onOpenAddTask}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
