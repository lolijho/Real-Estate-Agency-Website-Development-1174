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
    email: 'lorecucchini@gmail.com',
    password: 'Ylenia040590'
  };

  // Controlla se l'utente è già autenticato al caricamento
  useEffect(() => {
    try {
      const adminToken = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
      if (adminToken === 'authenticated') {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error('Errore accesso localStorage:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (email, password) => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setIsAdmin(true);
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_token', 'authenticated');
        }
      } catch (error) {
        console.error('Errore salvataggio localStorage:', error);
      }
      return { success: true };
    }
    return { success: false, error: 'Credenziali non valide' };
  };

  const logout = () => {
    setIsAdmin(false);
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
      }
    } catch (error) {
      console.error('Errore rimozione localStorage:', error);
    }
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