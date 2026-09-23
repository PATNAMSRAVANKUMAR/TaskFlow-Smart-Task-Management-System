import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { taskService, categoryService } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    completedToday: 0,
    completedThisWeek: 0,
    todayTasksCount: 0,
    progressPercentage: 0
  });
  const [categories, setCategories] = useState([]);

  const [loadingTasks, setLoadingTasks] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Fetch Tasks with optional query params
  const fetchTasks = useCallback(async (params = {}) => {
    if (!isAuthenticated) return;
    setLoadingTasks(true);
    try {
      const res = await taskService.getTasks(params);
      if (res.data?.success) {
        setTasks(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      showToast(err.response?.data?.message || 'Failed to load tasks', 'error');
    } finally {
      setLoadingTasks(false);
    }
  }, [isAuthenticated, showToast]);

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoadingStats(true);
    try {
      const res = await taskService.getStats();
      if (res.data?.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoadingStats(false);
    }
  }, [isAuthenticated]);

  // Fetch Categories
  const fetchCategories = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoadingCategories(true);
    try {
      const res = await categoryService.getCategories();
      if (res.data?.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoadingCategories(false);
    }
  }, [isAuthenticated]);

  // Initial load when user signs in
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
      fetchStats();
      fetchCategories();
    } else {
      setTasks([]);
      setCategories([]);
    }
  }, [isAuthenticated, fetchTasks, fetchStats, fetchCategories]);

  // Create Task
  const createTask = async (taskData) => {
    try {
      const res = await taskService.createTask(taskData);
      if (res.data?.success) {
        setTasks((prev) => [res.data.data, ...prev]);
        showToast('Task created successfully', 'success');
        fetchStats();
        fetchCategories();
        return res.data.data;
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create task', 'error');
      throw err;
    }
  };

  // Update Task
  const updateTask = async (id, taskData) => {
    try {
      const res = await taskService.updateTask(id, taskData);
      if (res.data?.success) {
        setTasks((prev) => prev.map((t) => (t._id === id ? res.data.data : t)));
        showToast('Task updated successfully', 'success');
        fetchStats();
        fetchCategories();
        return res.data.data;
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update task', 'error');
      throw err;
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    try {
      const res = await taskService.deleteTask(id);
      if (res.data?.success) {
        setTasks((prev) => prev.filter((t) => t._id !== id));
        showToast('Task deleted successfully', 'success');
        fetchStats();
        fetchCategories();
        return true;
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete task', 'error');
      throw err;
    }
  };

  // Toggle Complete / Reopen
  const toggleComplete = async (id) => {
    try {
      // Find current task
      const target = tasks.find((t) => t._id === id);
      const isCompleting = target ? target.status !== 'Completed' : true;

      const res = await taskService.toggleComplete(id);
      if (res.data?.success) {
        setTasks((prev) => prev.map((t) => (t._id === id ? res.data.data : t)));

        if (isCompleting) {
          showToast('Task completed! Keep up the momentum! 🎉', 'success');
          // Trigger delightful celebratory confetti
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899']
          });
        } else {
          showToast('Task restored to pending', 'info');
        }

        fetchStats();
        fetchCategories();
        return res.data.data;
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to toggle status', 'error');
      throw err;
    }
  };

  // Create Category
  const createCategory = async (categoryData) => {
    try {
      const res = await categoryService.createCategory(categoryData);
      if (res.data?.success) {
        setCategories((prev) => [...prev, res.data.data]);
        showToast('Category created successfully', 'success');
        return res.data.data;
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create category', 'error');
      throw err;
    }
  };

  // Delete Category
  const deleteCategory = async (id) => {
    try {
      const res = await categoryService.deleteCategory(id);
      if (res.data?.success) {
        setCategories((prev) => prev.filter((c) => c._id !== id));
        showToast(res.data.message || 'Category deleted', 'success');
        fetchTasks();
        fetchCategories();
        return true;
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete category', 'error');
      throw err;
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        stats,
        categories,
        loadingTasks,
        loadingStats,
        loadingCategories,
        fetchTasks,
        fetchStats,
        fetchCategories,
        createTask,
        updateTask,
        deleteTask,
        toggleComplete,
        createCategory,
        deleteCategory
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
