import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Credenziali admin semplici (in produzione usa un sistema più sicuro)
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
  };

  // Controlla se l'utente è già autenticato al caricamento
  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken === 'authenticated') {
      setIsAdmin(true);
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAdmin(true);
      localStorage.setItem('admin_token', 'authenticated');
      return { success: true };
    }
    return { success: false, error: 'Credenziali non valide' };
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('admin_token');
  };

  const value = {
    isAdmin,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 