import axios from 'axios';
import { mockStorage } from './mockStorage';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000
});

// Detect if running on GitHub Pages or standalone static environment
const isStaticHost =
  typeof window !== 'undefined' &&
  (window.location.hostname.includes('github.io') ||
   window.location.protocol === 'file:' ||
   import.meta.env.VITE_STANDALONE === 'true');

// Attach token to every outgoing request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('taskflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthenticated 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthUrl = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');
      if (!isAuthUrl) {
        localStorage.removeItem('taskflow_token');
        localStorage.removeItem('taskflow_user');
      }
    }
    return Promise.reject(error);
  }
);

// Wrapper that falls back to client mock storage if on GitHub Pages or if API is unreachable
const withFallback = async (apiCall, mockCall) => {
  if (isStaticHost) {
    const res = await mockCall();
    return { data: res };
  }
  try {
    return await apiCall();
  } catch (err) {
    // If backend is offline, static 404 from GitHub Pages, or 500/502/504 proxy failure, seamlessly fallback
    if (!err.response || err.response.status === 404 || err.response.status >= 500 || err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
      console.warn('API unreachable or failed, operating with local fallback:', err.message);
      const res = await mockCall();
      return { data: res };
    }
    throw err;
  }
};

// Auth Endpoints
export const authService = {
  register: (data) =>
    withFallback(
      async () => {
        const res = await api.post('/auth/register', data);
        try {
          await mockStorage.register(data);
        } catch (e) {}
        return res;
      },
      () => mockStorage.register(data)
    ),
  login: (data) =>
    withFallback(
      async () => {
        try {
          const res = await api.post('/auth/login', data);
          try {
            await mockStorage.register({
              name: res.data?.data?.name || data.email.split('@')[0],
              email: data.email,
              password: data.password
            });
          } catch (e) {}
          return res;
        } catch (err) {
          if (err.response && err.response.status === 401) {
            try {
              const mockRes = await mockStorage.login(data);
              if (mockRes && mockRes.success) {
                return { data: mockRes };
              }
            } catch (mockErr) {}
          }
          throw err;
        }
      },
      () => mockStorage.login(data)
    ),
  demoLogin: () =>
    withFallback(
      () => api.post('/auth/demo'),
      () => mockStorage.demoLogin()
    ),
  getMe: () =>
    withFallback(
      () => api.get('/auth/me'),
      () => mockStorage.getMe()
    ),
  updateProfile: (data) =>
    withFallback(
      () => api.put('/auth/profile', data),
      () => mockStorage.updateProfile(data)
    ),
  updatePassword: (data) =>
    withFallback(
      () => api.put('/auth/updatepassword', data),
      () => mockStorage.updatePassword(data)
    )
};

// Task Endpoints
export const taskService = {
  getTasks: (params) =>
    withFallback(
      () => api.get('/tasks', { params }),
      () => mockStorage.getTasks(params)
    ),
  getTaskById: (id) =>
    withFallback(
      () => api.get(`/tasks/${id}`),
      async () => {
        const res = await mockStorage.getTasks();
        const found = res.data.find((t) => t._id === id);
        return { success: true, data: found };
      }
    ),
  createTask: (data) =>
    withFallback(
      () => api.post('/tasks', data),
      () => mockStorage.createTask(data)
    ),
  updateTask: (id, data) =>
    withFallback(
      () => api.put(`/tasks/${id}`, data),
      () => mockStorage.updateTask(id, data)
    ),
  deleteTask: (id) =>
    withFallback(
      () => api.delete(`/tasks/${id}`),
      () => mockStorage.deleteTask(id)
    ),
  toggleComplete: (id) =>
    withFallback(
      () => api.patch(`/tasks/${id}/complete`),
      () => mockStorage.toggleComplete(id)
    ),
  getStats: () =>
    withFallback(
      () => api.get('/tasks/stats'),
      () => mockStorage.getStats()
    )
};

// Category Endpoints
export const categoryService = {
  getCategories: () =>
    withFallback(
      () => api.get('/categories'),
      () => mockStorage.getCategories()
    ),
  createCategory: (data) =>
    withFallback(
      () => api.post('/categories', data),
      () => mockStorage.createCategory(data)
    ),
  deleteCategory: (id) =>
    withFallback(
      () => api.delete(`/categories/${id}`),
      () => mockStorage.deleteCategory(id)
    )
};

export default api;
