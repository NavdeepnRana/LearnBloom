import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('mb_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('mb_token');
    if (token) {
      api.get('/auth/me')
        .then(({ data }) => {
          setUser(data.user);
          localStorage.setItem('mb_user', JSON.stringify(data.user));
        })
        .catch(() => {
          localStorage.removeItem('mb_token');
          localStorage.removeItem('mb_user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('mb_token', data.token);
    localStorage.setItem('mb_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('mb_token', data.token);
    localStorage.setItem('mb_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('mb_token');
    localStorage.removeItem('mb_user');
    setUser(null);
  };

  const refreshUser = async () => {
    const { data } = await api.get('/auth/me');
    setUser(data.user);
    localStorage.setItem('mb_user', JSON.stringify(data.user));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
