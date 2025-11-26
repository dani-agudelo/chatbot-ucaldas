import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [isLoading, setIsLoading] = useState(true);

  // Verificar token al cargar
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const userData = await authAPI.getMe();
          setUser(userData);
        } catch {
          logout(); // Token inválido
        }
      }
      setIsLoading(false);
    };
    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    const response = await authAPI.login(email, password);
    localStorage.setItem('admin_token', response.access_token);
    setToken(response.access_token);
    setUser(response.user);
    return response.user;
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setUser(null);
  };

  const isAdmin = () => !!user && user.role?.toLowerCase() === 'admin';
  const isAuthenticated = () => !!user && !!token;

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, isAdmin, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
