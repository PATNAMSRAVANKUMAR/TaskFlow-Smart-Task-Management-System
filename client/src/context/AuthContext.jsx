import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('taskflow_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('taskflow_token') || null);
  const [loading, setLoading] = useState(true);

  // Validate or restore session
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('taskflow_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.data?.success) {
            setUser(res.data.data);
            localStorage.setItem('taskflow_user', JSON.stringify(res.data.data));
          }
        } catch (err) {
          console.warn('Session expired or invalid:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleAuthSuccess = (data) => {
    setUser(data);
    setToken(data.token);
    localStorage.setItem('taskflow_token', data.token);
    localStorage.setItem('taskflow_user', JSON.stringify(data));
  };

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.data?.success) {
      handleAuthSuccess(res.data.data);
      return res.data;
    }
  };

  const register = async (name, email, password) => {
    const res = await authService.register({ name, email, password });
    if (res.data?.success) {
      handleAuthSuccess(res.data.data);
      return res.data;
    }
  };

  const demoLogin = async () => {
    const res = await authService.demoLogin();
    if (res.data?.success) {
      handleAuthSuccess(res.data.data);
      return res.data;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
  };

  const updateProfile = async (data) => {
    const res = await authService.updateProfile(data);
    if (res.data?.success) {
      const updated = { ...user, ...res.data.data };
      setUser(updated);
      localStorage.setItem('taskflow_user', JSON.stringify(updated));
      return res.data;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        demoLogin,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
