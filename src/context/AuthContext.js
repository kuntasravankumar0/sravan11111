import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { presenceService } from '../config/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    const userData = localStorage.getItem('userData');

    if (adminLoggedIn) {
      setIsAdmin(true);
      if (userData) setUser(JSON.parse(userData));
    } else if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const loginAdmin = useCallback((adminData) => {
    localStorage.setItem('adminLoggedIn', 'true');
    localStorage.setItem('userData', JSON.stringify(adminData));
    setUser(adminData);
    setIsAdmin(true);
  }, []);

  const loginUser = useCallback((userData) => {
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAdmin(false);
  }, []);

  // Presence heartbeat
  useEffect(() => {
    if (!user) return;

    const sendHeartbeat = () => {
      const payload = {
        userId: user.googleId || String(user.number || user.customerId),
        authProvider: user.googleId ? 'GOOGLE' : 'MANUAL',
      };
      presenceService.ping(payload).catch(() => {});
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 25000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, loginAdmin, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
