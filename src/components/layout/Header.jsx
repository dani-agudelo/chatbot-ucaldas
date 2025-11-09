import React from 'react';
import { APP_NAME, UNIVERSITY_NAME } from '../../utils/constants';

const Header = ({ onSettingsClick }) => {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200/80 dark:border-gray-800/80 bg-white/50 dark:bg-background-dark/50 backdrop-blur-sm px-6 sticky top-0 z-10">
      {/* Logo y título */}
      <div className="flex items-center gap-3">
        {/* Logo de la Universidad */}
        <img 
          src="/assets/logo-uc.png" 
          alt="Universidad de Caldas" 
          className="w-10 h-10 object-contain"
          onError={(e) => {
            // Fallback: intentar SVG si PNG falla
            if (e.target.src.includes('.png')) {
              e.target.src = '/assets/logo-uc.svg';
            } else {
              // Si tampoco existe SVG, mostrar icono
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }
          }}
        />
        {/* Fallback icon si no hay logo */}
        <div className="hidden items-center justify-center w-10 h-10 rounded-full bg-primary/20">
          <span className="material-symbols-outlined text-primary text-xl">school</span>
        </div>
        
        <div>
          <h1 className="text-lg font-bold leading-tight text-gray-900 dark:text-white">
            {APP_NAME}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {UNIVERSITY_NAME}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button 
          onClick={onSettingsClick}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          aria-label="Configuración"
        >
          <span className="material-symbols-outlined text-2xl">settings</span>
        </button>
        
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-white font-bold">
          U
        </div>
      </div>
    </header>
  );
};

export default Header;

