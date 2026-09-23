import React from 'react';
import { CalendarClock, Clock, ArrowRight } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';

const Upcoming = ({ onOpenAddTask, onEditTask, onDeleteTask }) => {
  const { tasks, toggleComplete } = useTasks();

  const now = new Date();
  const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  const endOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59, 999);
  const endOfThisWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 23, 59, 59, 999);
  const endOfNextWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14, 23, 59, 59, 999);

  // Filter tasks that have dueDate in the future and not completed
  const upcomingTasks = tasks.filter((t) => {
    if (!t.dueDate || t.status === 'Completed') return false;
    const d = new Date(t.dueDate);
    return d >= startOfTomorrow;
  });

  const tomorrowTasks = upcomingTasks.filter((t) => {
    const d = new Date(t.dueDate);
    return d >= startOfTomorrow && d <= endOfTomorrow;
  });

  const thisWeekTasks = upcomingTasks.filter((t) => {
    const d = new Date(t.dueDate);
    return d > endOfTomorrow && d <= endOfThisWeek;
  });

  const nextWeekTasks = upcomingTasks.filter((t) => {
    const d = new Date(t.dueDate);
    return d > endOfThisWeek && d <= endOfNextWeek;
  });

  const laterTasks = upcomingTasks.filter((t) => {
    const d = new Date(t.dueDate);
    return d > endOfNextWeek;
  });

  const sections = [
    { title: 'Tomorrow', subtitle: 'Next 24-48 hours', items: tomorrowTasks },
    { title: 'This Week', subtitle: 'Upcoming in the next 7 days', items: thisWeekTasks },
    { title: 'Next Week', subtitle: 'Scheduled for 8-14 days out', items: nextWeekTasks },
    { title: 'Later', subtitle: 'Future deadlines & roadmap', items: laterTasks }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header Intro */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-brand-600 dark:text-brand-400 font-bold text-xs uppercase tracking-wider mb-1">
            <CalendarClock className="w-4 h-4" />
            <span>Timeline Planning</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Upcoming Deadlines</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Chronological breakdown of future commitments and milestones.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-900">
          {upcomingTasks.length} upcoming task{upcomingTasks.length === 1 ? '' : 's'}
        </span>
      </div>

      {upcomingTasks.length === 0 ? (
        <EmptyState
          title="No upcoming tasks"
          description="You don't have any tasks scheduled for future dates. Plan ahead by adding upcoming work."
          actionText="+ Add Upcoming Task"
          onAction={onOpenAddTask}
        />
      ) : (
        <div className="space-y-8">
          {sections.map(
            (sec) =>
              sec.items.length > 0 && (
                <div key={sec.title} className="space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-brand-500" />
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {sec.title}
                      </h3>
                      <span className="text-xs text-slate-400 font-medium">({sec.subtitle})</span>
                    </div>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      {sec.items.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sec.items.map((task) => (
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
              )
          )}
        </div>
      )}
    </div>
  );
};

export default Upcoming;
