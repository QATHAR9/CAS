import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
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

  useEffect(() => {
    const savedUser = localStorage.getItem('cas_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate authentication - replace with real API call
    if (username === 'admin' && password === 'admin123') {
      const mockUser: User = {
        id: '1',
        username: 'admin',
        fullName: 'Admin Officer',
        badge: 'ADM001',
        department: 'Administration',
        role: 'admin',
        permissions: [
          'read_dashboard',
          'read_cases',
          'write_cases',
          'delete_cases',
          'case_intake',
          'forward_prosecution',
          'read_criminals',
          'write_criminals',
          'delete_criminals',
          'read_evidence',
          'write_evidence',
          'delete_evidence',
          'read_suspects',
          'write_suspects',
          'read_map',
          'read_search',
          'read_notifications',
          'read_audit',
          'manage_users',
          'read_settings',
          'write_settings'
        ],
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
        lastLogin: new Date().toISOString(),
        isActive: true
      };
      setUser(mockUser);
      localStorage.setItem('cas_user', JSON.stringify(mockUser));
      return true;
    } else if (username === 'officer' && password === 'officer123') {
      const mockUser: User = {
        id: '2',
        username: 'officer',
        fullName: 'John Smith',
        badge: 'OFF001',
        department: 'Patrol Division',
        role: 'officer',
        permissions: [
          'read_dashboard',
          'read_cases',
          'write_cases',
          'case_intake',
          'read_criminals',
          'read_evidence',
          'write_evidence',
          'read_suspects',
          'write_suspects',
          'read_map',
          'read_search',
          'read_notifications'
        ],
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
        lastLogin: new Date().toISOString(),
        isActive: true
      };
      setUser(mockUser);
      localStorage.setItem('cas_user', JSON.stringify(mockUser));
      return true;
    } else if (username === 'detective' && password === 'detective123') {
      const mockUser: User = {
        id: '3',
        username: 'detective',
        fullName: 'Sarah Brown',
        badge: 'DET001',
        department: 'Criminal Investigation Division',
        role: 'detective',
        permissions: [
          'read_dashboard',
          'read_cases',
          'write_cases',
          'case_intake',
          'forward_prosecution',
          'read_criminals',
          'write_criminals',
          'read_evidence',
          'write_evidence',
          'read_suspects',
          'write_suspects',
          'read_map',
          'read_search',
          'read_notifications',
          'read_audit'
        ],
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
        lastLogin: new Date().toISOString(),
        isActive: true
      };
      setUser(mockUser);
      localStorage.setItem('cas_user', JSON.stringify(mockUser));
      return true;
    } else if (username === 'supervisor' && password === 'supervisor123') {
      const mockUser: User = {
        id: '4',
        username: 'supervisor',
        fullName: 'Michael Johnson',
        badge: 'SUP001',
        department: 'Operations',
        role: 'supervisor',
        permissions: [
          'read_dashboard',
          'read_cases',
          'write_cases',
          'case_intake',
          'forward_prosecution',
          'read_criminals',
          'write_criminals',
          'read_evidence',
          'write_evidence',
          'read_suspects',
          'write_suspects',
          'read_map',
          'read_search',
          'read_notifications',
          'read_audit',
          'read_settings'
        ],
        avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100',
        lastLogin: new Date().toISOString(),
        isActive: true
      };
      setUser(mockUser);
      localStorage.setItem('cas_user', JSON.stringify(mockUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cas_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};