import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/apiClient';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, expectedRole?: string) => Promise<void>;
  register: (userData: { name: string; email: string; phone: string; password: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user
      authAPI.getCurrentUser()
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string, expectedRole?: string) => {
    const response = await authAPI.login({ email, password, expectedRole });
    const { token, user: userData } = response.data;

    if (!token || !userData) {
      throw new Error('Invalid response format: missing token or user data');
    }

    localStorage.setItem('token', token);
    setUser(userData);
  };

  const register = async (userData: { name: string; email: string; phone: string; password: string }) => {
    const response = await authAPI.register(userData);
    const { token, user: userDataResponse } = response.data;

    if (!token || !userDataResponse) {
      throw new Error('Invalid response format: missing token or user data');
    }

    localStorage.setItem('token', token);
    setUser(userDataResponse);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
