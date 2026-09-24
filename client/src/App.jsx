import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useTasks } from './context/TaskContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TaskModal from './components/TaskModal';
import CategoryModal from './components/CategoryModal';
import ConfirmModal from './components/ConfirmModal';
import ScrollNavigator from './components/ScrollNavigator';
import AiAssistant from './components/AiAssistant';

import Dashboard from './pages/Dashboard';
import AllTasks from './pages/AllTasks';
import Today from './pages/Today';
import Upcoming from './pages/Upcoming';
import Completed from './pages/Completed';
import Categories from './pages/Categories';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';

import { Sparkles, Loader2 } from 'lucide-react';

function App() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { deleteTask, deleteCategory } = useTasks();

  const [authView, setAuthView] = useState('login'); // 'login' | 'register'
  const [activePage, setActivePage] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modal States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Delete',
    onConfirm: () => {}
  });

  // Open Task Modal for New Task
  const handleOpenAddTask = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  // Open Task Modal for Editing
  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  // Trigger Delete Confirmation for a Task
  const handleDeleteTask = (taskId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Task?',
      message: 'This action cannot be undone. Are you sure you want to delete this task?',
      confirmText: 'Delete Task',
      onConfirm: async () => {
        await deleteTask(taskId);
      }
    });
  };

  // Trigger Delete Confirmation for a Category
  const handleDeleteCategory = (cat) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete Category "${cat.name}"?`,
      message:
        'Custom category will be removed and any associated tasks will be safely reassigned to "Other".',
      confirmText: 'Delete Category',
      onConfirm: async () => {
        await deleteCategory(cat._id);
      }
    });
  };

  // Page titles and subtitles
  const getPageInfo = () => {
    switch (activePage) {
      case 'dashboard':
        return { title: null, subtitle: 'Stay organized and get things done.' };
      case 'all-tasks':
        return { title: 'All Tasks', subtitle: 'Search, filter, and organize all your workspace items.' };
      case 'today':
        return { title: "Today's Schedule", subtitle: 'Focused action items due today.' };
      case 'upcoming':
        return { title: 'Upcoming Tasks', subtitle: 'Forward roadmap and scheduled deliverables.' };
      case 'completed':
        return { title: 'Completed Tasks', subtitle: 'Historical record of achieved goals and finished items.' };
      case 'categories':
        return { title: 'Categories', subtitle: 'Organize tasks into structured domain projects.' };
      case 'settings':
        return { title: 'Settings', subtitle: 'Configure preferences, credentials, and app appearance.' };
      default:
        return { title: 'TaskFlow', subtitle: 'Smart Task Management System' };
    }
  };

  // If loading session
  if (authLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300">
        <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center mb-4 shadow-lg shadow-brand-500/25 animate-pulse">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="flex items-center space-x-2 text-sm font-semibold">
          <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
          <span>Starting TaskFlow...</span>
        </div>
      </div>
    );
  }

  // If unauthenticated: render Login or Register
  if (!isAuthenticated) {
    if (authView === 'register') {
      return <Register onSwitchToLogin={() => setAuthView('login')} />;
    }
    return <Login onSwitchToRegister={() => setAuthView('register')} />;
  }

  const { title, subtitle } = getPageInfo();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Top Header */}
        <Header
          title={title}
          subtitle={subtitle}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onOpenAddTask={handleOpenAddTask}
        />

        {/* Dynamic Page Router */}
        <main className="flex-1 px-4 sm:px-8 pt-6 pb-36 max-w-7xl w-full mx-auto min-h-[calc(100vh-80px)]">
          {activePage === 'dashboard' && (
            <Dashboard
              onOpenAddTask={handleOpenAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onNavigateToTasks={() => setActivePage('all-tasks')}
            />
          )}

          {activePage === 'all-tasks' && (
            <AllTasks
              onOpenAddTask={handleOpenAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          )}

          {activePage === 'today' && (
            <Today
              onOpenAddTask={handleOpenAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          )}

          {activePage === 'upcoming' && (
            <Upcoming
              onOpenAddTask={handleOpenAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          )}

          {activePage === 'completed' && (
            <Completed
              onDeleteTask={handleDeleteTask}
            />
          )}

          {activePage === 'categories' && (
            <Categories
              onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
              onDeleteCategory={handleDeleteCategory}
              onSelectCategory={() => setActivePage('all-tasks')}
            />
          )}

          {activePage === 'settings' && <Settings />}
        </main>
      </div>

      {/* Reusable Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        taskToEdit={taskToEdit}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
      />

      {/* Global Scroll Navigator (View Down by Down, Top, Bottom, Auto-Scroll) */}
      <ScrollNavigator />

      {/* AI Assistant (Matching Screenshots: Floating Trigger Pill & Chat Window) */}
      <AiAssistant />
    </div>
  );
}

export default App;
