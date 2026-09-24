// Client-side persistent storage engine for GitHub Pages (Static / Offline mode)
const STORAGE_KEYS = {
  USER: 'taskflow_user',
  TOKEN: 'taskflow_token',
  TASKS: 'taskflow_tasks_store',
  CATEGORIES: 'taskflow_categories_store',
  REGISTERED_USERS: 'taskflow_registered_users'
};

const DEFAULT_CATEGORIES = [
  { _id: 'cat_work', name: 'Work', color: '#3b82f6', icon: 'briefcase', isDefault: true },
  { _id: 'cat_personal', name: 'Personal', color: '#10b981', icon: 'user', isDefault: true },
  { _id: 'cat_study', name: 'Study', color: '#8b5cf6', icon: 'book', isDefault: true },
  { _id: 'cat_health', name: 'Health', color: '#f43f5e', icon: 'heart', isDefault: true },
  { _id: 'cat_shopping', name: 'Shopping', color: '#f59e0b', icon: 'shopping-bag', isDefault: true },
  { _id: 'cat_other', name: 'Other', color: '#6b7280', icon: 'tag', isDefault: true }
];

export const initMockStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
  }
};

const getStoredTasks = () => {
  const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
  return raw ? JSON.parse(raw) : [];
};

const setStoredTasks = (tasks) => {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
};

const getStoredCategories = () => {
  const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  return raw ? JSON.parse(raw) : DEFAULT_CATEGORIES;
};

const setStoredCategories = (cats) => {
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cats));
};

export const mockStorage = {
  // Auth
  demoLogin: async () => {
    const demoUser = {
      _id: 'usr_demo_123',
      name: 'Alex Morgan',
      email: 'demo@taskflow.dev',
      createdAt: new Date().toISOString(),
      token: 'mock_jwt_token_taskflow_demo_2026'
    };

    // Seed realistic tasks if none exist
    const currentTasks = getStoredTasks();
    if (currentTasks.length === 0) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0, 0);
      const overdue = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      const tomorrow = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
      const thisWeek = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      const nextWeek = new Date(Date.now() + 8 * 24 * 60 * 60 * 1000);
      const completedRecent = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);

      const sampleTasks = [
        {
          _id: 'task_1',
          title: 'Complete React dashboard implementation',
          description: 'Implement responsive widgets, charts, and dark mode toggling with smooth transitions.',
          priority: 'High',
          category: 'Work',
          status: 'In Progress',
          dueDate: today.toISOString(),
          createdAt: new Date().toISOString()
        },
        {
          _id: 'task_2',
          title: 'Submit quarterly budget proposal',
          description: 'Finalize spreadsheet calculations and send PDF to the finance committee.',
          priority: 'High',
          category: 'Work',
          status: 'Pending',
          dueDate: overdue.toISOString(),
          createdAt: new Date().toISOString()
        },
        {
          _id: 'task_3',
          title: 'Review pull request #42 for JWT authentication',
          description: 'Verify token expiration handling, refresh mechanics, and error status codes.',
          priority: 'Medium',
          category: 'Work',
          status: 'Pending',
          dueDate: today.toISOString(),
          createdAt: new Date().toISOString()
        },
        {
          _id: 'task_4',
          title: 'Weekly grocery shopping',
          description: 'Organic vegetables, whole grain bread, almond milk, and ground coffee.',
          priority: 'Low',
          category: 'Shopping',
          status: 'Pending',
          dueDate: tomorrow.toISOString(),
          createdAt: new Date().toISOString()
        },
        {
          _id: 'task_5',
          title: 'Dentist regular cleaning appointment',
          description: 'Dental clinic at 4th Avenue, 10:30 AM appointment with Dr. Chen.',
          priority: 'Medium',
          category: 'Health',
          status: 'Pending',
          dueDate: thisWeek.toISOString(),
          createdAt: new Date().toISOString()
        },
        {
          _id: 'task_6',
          title: 'Study Chapter 4: Distributed Systems Design',
          description: 'Focus on consensus algorithms: Raft, Paxos, and leader election protocols.',
          priority: 'Medium',
          category: 'Study',
          status: 'Pending',
          dueDate: nextWeek.toISOString(),
          createdAt: new Date().toISOString()
        },
        {
          _id: 'task_7',
          title: 'Morning 5km endurance run',
          description: 'Interval pacing in the park before breakfast.',
          priority: 'Low',
          category: 'Health',
          status: 'Completed',
          dueDate: completedRecent.toISOString(),
          completedAt: completedRecent.toISOString(),
          createdAt: new Date().toISOString()
        },
        {
          _id: 'task_8',
          title: 'Initialize GitHub repository and documentation',
          description: 'Setup initial commit, write README.md, and configure CI/CD actions.',
          priority: 'High',
          category: 'Work',
          status: 'Completed',
          dueDate: completedRecent.toISOString(),
          completedAt: completedRecent.toISOString(),
          createdAt: new Date().toISOString()
        }
      ];
      setStoredTasks(sampleTasks);
    }

    return { success: true, data: demoUser };
  },

  login: async ({ email, password }) => {
    const normalizedEmail = (email || '').toLowerCase().trim();
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS) || '[]');
    } catch (e) {
      users = [];
    }

    const found = users.find((u) => u.email === normalizedEmail);

    if (found) {
      if (found.password && password && found.password !== password) {
        const err = new Error('Invalid email or password');
        err.response = { status: 401, data: { success: false, message: 'Invalid email or password' } };
        throw err;
      }
      return { success: true, data: found };
    }

    // Default registered mock user
    const newUser = {
      _id: 'usr_' + Date.now(),
      name: normalizedEmail.split('@')[0],
      email: normalizedEmail,
      password: password || '123456',
      createdAt: new Date().toISOString(),
      token: 'mock_jwt_token_' + Date.now()
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users));
    return { success: true, data: newUser };
  },

  register: async ({ name, email, password }) => {
    const normalizedEmail = (email || '').toLowerCase().trim();
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS) || '[]');
    } catch (e) {
      users = [];
    }

    const existingIdx = users.findIndex((u) => u.email === normalizedEmail);
    const newUser = {
      _id: existingIdx >= 0 ? users[existingIdx]._id : 'usr_' + Date.now(),
      name: name || normalizedEmail.split('@')[0],
      email: normalizedEmail,
      password: password || '123456',
      createdAt: new Date().toISOString(),
      token: 'mock_jwt_token_' + Date.now()
    };

    if (existingIdx >= 0) {
      users[existingIdx] = newUser;
    } else {
      users.push(newUser);
    }
    localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users));
    initMockStorage();
    return { success: true, data: newUser };
  },

  getMe: async () => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    if (!user) throw new Error('Not logged in');
    return { success: true, data: JSON.parse(user) };
  },

  updateProfile: async ({ name }) => {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
    user.name = name;
    return { success: true, data: user };
  },

  updatePassword: async () => {
    return { success: true, message: 'Password updated successfully' };
  },

  // Tasks
  getTasks: async (params = {}) => {
    let tasks = getStoredTasks();
    const now = new Date();

    if (params.search) {
      const q = params.search.toLowerCase();
      tasks = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q)) ||
          (t.category && t.category.toLowerCase().includes(q))
      );
    }

    if (params.status && params.status !== 'All') {
      if (params.status === 'Overdue') {
        tasks = tasks.filter((t) => {
          const d = t.dueDate ? new Date(t.dueDate) : null;
          return d && d < now && t.status !== 'Completed';
        });
      } else {
        tasks = tasks.filter((t) => t.status === params.status);
      }
    }

    if (params.priority && params.priority !== 'All') {
      tasks = tasks.filter((t) => t.priority === params.priority);
    }

    if (params.category && params.category !== 'All') {
      tasks = tasks.filter((t) => t.category === params.category);
    }

    return { success: true, count: tasks.length, data: tasks };
  },

  createTask: async (taskData) => {
    const tasks = getStoredTasks();
    const newTask = {
      _id: 'task_' + Date.now(),
      title: taskData.title,
      description: taskData.description || '',
      priority: taskData.priority || 'Medium',
      category: taskData.category || 'Work',
      status: taskData.status || 'Pending',
      dueDate: taskData.dueDate || null,
      completedAt: taskData.status === 'Completed' ? new Date().toISOString() : null,
      createdAt: new Date().toISOString()
    };
    tasks.unshift(newTask);
    setStoredTasks(tasks);
    return { success: true, message: 'Task created', data: newTask };
  },

  updateTask: async (id, taskData) => {
    const tasks = getStoredTasks();
    const index = tasks.findIndex((t) => t._id === id);
    if (index === -1) throw new Error('Task not found');

    const updated = { ...tasks[index], ...taskData };
    if (taskData.status === 'Completed' && tasks[index].status !== 'Completed') {
      updated.completedAt = new Date().toISOString();
    } else if (taskData.status !== 'Completed' && tasks[index].status === 'Completed') {
      updated.completedAt = null;
    }
    tasks[index] = updated;
    setStoredTasks(tasks);
    return { success: true, message: 'Task updated', data: updated };
  },

  toggleComplete: async (id) => {
    const tasks = getStoredTasks();
    const index = tasks.findIndex((t) => t._id === id);
    if (index === -1) throw new Error('Task not found');

    const task = tasks[index];
    if (task.status === 'Completed') {
      task.status = 'Pending';
      task.completedAt = null;
    } else {
      task.status = 'Completed';
      task.completedAt = new Date().toISOString();
    }
    tasks[index] = task;
    setStoredTasks(tasks);
    return { success: true, message: 'Status toggled', data: task };
  },

  deleteTask: async (id) => {
    let tasks = getStoredTasks();
    tasks = tasks.filter((t) => t._id !== id);
    setStoredTasks(tasks);
    return { success: true, message: 'Task deleted', data: { id } };
  },

  getStats: async () => {
    const tasks = getStoredTasks();
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
    const pendingTasks = tasks.filter((t) => t.status === 'Pending').length;
    const overdueTasks = tasks.filter((t) => {
      const d = t.dueDate ? new Date(t.dueDate) : null;
      return d && d < now && t.status !== 'Completed';
    }).length;

    const completedToday = tasks.filter((t) => {
      if (t.status !== 'Completed' || !t.completedAt) return false;
      const d = new Date(t.completedAt);
      return d >= startOfToday && d <= endOfToday;
    }).length;

    const completedThisWeek = tasks.filter((t) => {
      if (t.status !== 'Completed' || !t.completedAt) return false;
      const d = new Date(t.completedAt);
      return d >= sevenDaysAgo;
    }).length;

    const todayTasksCount = tasks.filter((t) => {
      if (!t.dueDate) return false;
      const d = new Date(t.dueDate);
      return d >= startOfToday && d <= endOfToday;
    }).length;

    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      success: true,
      data: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        pendingTasks,
        overdueTasks,
        completedToday,
        completedThisWeek,
        todayTasksCount,
        progressPercentage
      }
    };
  },

  // Categories
  getCategories: async () => {
    initMockStorage();
    const categories = getStoredCategories();
    const tasks = getStoredTasks();

    const enriched = categories.map((cat) => {
      const catTasks = tasks.filter((t) => t.category === cat.name);
      const total = catTasks.length;
      const completed = catTasks.filter((t) => t.status === 'Completed').length;
      const pending = catTasks.filter((t) => t.status !== 'Completed').length;

      return {
        ...cat,
        totalTasks: total,
        completedTasks: completed,
        pendingTasks: pending
      };
    });

    return { success: true, count: enriched.length, data: enriched };
  },

  createCategory: async ({ name, color, icon }) => {
    const categories = getStoredCategories();
    const newCat = {
      _id: 'cat_' + Date.now(),
      name,
      color: color || '#6366f1',
      icon: icon || 'folder',
      isDefault: false
    };
    categories.push(newCat);
    setStoredCategories(categories);
    return {
      success: true,
      message: 'Category created',
      data: { ...newCat, totalTasks: 0, completedTasks: 0, pendingTasks: 0 }
    };
  },

  deleteCategory: async (id) => {
    let categories = getStoredCategories();
    const catToDelete = categories.find((c) => c._id === id);
    if (!catToDelete) throw new Error('Category not found');

    categories = categories.filter((c) => c._id !== id);
    setStoredCategories(categories);

    // Reassign tasks
    let tasks = getStoredTasks();
    tasks = tasks.map((t) => (t.category === catToDelete.name ? { ...t, category: 'Other' } : t));
    setStoredTasks(tasks);

    return { success: true, message: `Category "${catToDelete.name}" deleted.`, data: { id } };
  }
};
