import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'docclean_user';
const USERS_REGISTRY_KEY = 'docclean_registered_users';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Default logged-in user so workflow and protected routes work out-of-the-box
    const defaultUser: AuthUser = {
      id: 'usr_demo_8921',
      name: 'Dr. Vaishnavi',
      email: 'vaishnavidhamodharan2004@gmail.com',
      createdAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUser));
    } catch {
      // ignore
    }
    return defaultUser;
  });

  const isAuthenticated = Boolean(user);

  const login = (email: string, password?: string) => {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    // Try finding in registry or create session
    let name = email.split('@')[0];
    name = name.charAt(0).toUpperCase() + name.slice(1);

    try {
      const rawUsers = localStorage.getItem(USERS_REGISTRY_KEY);
      if (rawUsers) {
        const list = JSON.parse(rawUsers);
        const match = list.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
        if (match) {
          name = match.name;
        }
      }
    } catch {
      // ignore
    }

    const authUser: AuthUser = {
      id: `usr_${Date.now()}`,
      name,
      email,
      createdAt: new Date().toISOString(),
    };

    setUser(authUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    return { success: true };
  };

  const signup = (name: string, email: string, password?: string) => {
    if (!name.trim()) {
      return { success: false, error: 'Please provide your full name.' };
    }
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please provide a valid email address.' };
    }

    const newUser: AuthUser = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
    };

    try {
      const rawUsers = localStorage.getItem(USERS_REGISTRY_KEY);
      const list = rawUsers ? JSON.parse(rawUsers) : [];
      list.push(newUser);
      localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }

    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
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
