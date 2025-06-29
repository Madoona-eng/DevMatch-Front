import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { getUserFromStorage, saveUserToStorage, clearUserFromStorage } from '../utils/userUtils';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = getUserFromStorage();
    if (savedUser) {
      setUser(savedUser);
      // Sync with useAuthStore
      useAuthStore.getState().syncWithAuthContext(savedUser);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    saveUserToStorage(userData);
    // Sync with useAuthStore
    useAuthStore.getState().syncWithAuthContext(userData);
  };

  const logout = () => {
    setUser(null);
    clearUserFromStorage();
    // Sync with useAuthStore
    useAuthStore.getState().syncWithAuthContext(null);
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    saveUserToStorage(newUser);
    // Sync with useAuthStore
    useAuthStore.getState().syncWithAuthContext(newUser);
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user,
    isRecruiter: user?.role === 'recruiter',
    isProgrammer: user?.role === 'programmer'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};