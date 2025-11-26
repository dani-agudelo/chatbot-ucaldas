import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { APP_NAME, UNIVERSITY_NAME } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';

const Header = ({ onSettingsClick, onMenuClick, sidebarOpen }) => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/chat');
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200/80 dark:border-gray-800/80 bg-white/50 dark:bg-background-dark/50 backdrop-blur-sm px-4 sm:px-6 sticky top-0 z-10">
      {/* Logo y título */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Botón hamburguesa (solo móvil) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">
            {sidebarOpen ? 'close' : 'menu'}
          </span>
        </button>
        <img 
          src="/assets/logo-uc.png" 
          alt="Universidad de Caldas" 
          className="w-10 h-10 object-contain"
          onError={(e) => {
            if (e.target.src.includes('.png')) {
              e.target.src = '/assets/logo-uc.svg';
            } else {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }
          }}
        />
        <div className="hidden items-center justify-center w-10 h-10 rounded-full bg-primary/20">
          <span className="material-symbols-outlined text-primary text-xl">school</span>
        </div>
        
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold leading-tight text-gray-900 dark:text-white truncate">
            {APP_NAME}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
            {UNIVERSITY_NAME}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Botón de configuración */}
        <button 
          onClick={onSettingsClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Configuración"
        >
          <span className="material-symbols-outlined text-xl">settings</span>
        </button>

        {/* Admin section */}
        {isAdmin() ? (
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg bg-primary/10 dark:bg-primary/20">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-200">
                {user?.name || 'Admin'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              title="Cerrar sesión"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
            <span className="hidden sm:inline">Admin</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;

