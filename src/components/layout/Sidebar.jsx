import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../ui/Button';
import { MODES } from '../../utils/constants';

const Sidebar = ({ 
  config = null, 
  onConfigChange = () => {}, 
  onClearChat = () => {}, 
  onNewChat = () => {}, 
  apiStatus = 'connected' 
}) => {
  const location = useLocation();

  const navItems = [
    { path: '/chat', icon: 'chat_bubble', label: 'Chat' },
    { path: '/metrics', icon: 'bar_chart', label: 'Métricas' },
    { path: '/documents', icon: 'description', label: 'Documentos' },
  ];

  return (
    <aside className="w-72 shrink-0 border-r border-gray-200/80 dark:border-gray-800/80 bg-white/30 dark:bg-background-dark/30 p-4 flex flex-col h-screen overflow-y-auto">
      
      {/* Espacio superior */}
      <div className="h-12"></div>

      {/* Botón nuevo chat */}
      {location.pathname === '/chat' && (
        <Button 
          icon="add_comment"
          onClick={onNewChat}
          variant="primary"
          fullWidth
          className="mb-4 h-10 text-sm"
        >
          Nuevo Chat
        </Button>
      )}

      {/* Navegación */}
      <nav className="flex flex-col gap-1 mb-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex h-10 items-center gap-3 rounded-lg px-3 transition-colors ${
              location.pathname === item.path
                ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300'
            }`}
          >
            <span className="material-symbols-outlined text-xl">{item.icon}</span>
            <p className="text-sm font-medium">{item.label}</p>
          </Link>
        ))}
      </nav>

      {/* Configuración del Chat (solo visible en la página de chat y si hay config) */}
      {location.pathname === '/chat' && config && (
        <div className="flex-1 overflow-y-auto pt-6 mt-2 border-t border-gray-200/80 dark:border-gray-800/80">
          <div className="flex items-center gap-2 px-2 pb-3">
            <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-base">tune</span>
            <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Opciones</h3>
          </div>

          {/* Modo de respuesta - Simplificado */}
          <div className="space-y-1.5 pb-3">
            {MODES.map((mode) => (
              <label
                key={mode.value}
                className="flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/30 transition-colors"
              >
                <input
                  type="radio"
                  name="mode"
                  value={mode.value}
                  checked={config.mode === mode.value}
                  onChange={(e) => onConfigChange({ mode: e.target.value })}
                  className="w-4 h-4 text-primary focus:ring-1 focus:ring-primary"
                />
                <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-base">
                  {mode.label === 'Breve' ? 'short_text' : 'subject'}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {mode.label}
                  </p>
                </div>
              </label>
            ))}
          </div>

          <div className="pt-3 pb-3 border-t border-gray-200/50 dark:border-gray-800/50">
            <label className="flex items-center justify-between px-2 py-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/30 transition-colors group">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-base group-hover:text-primary transition-colors">search</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Usar RAG</span>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={config.useRAG}
                  onChange={(e) => onConfigChange({ useRAG: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-gray-200 dark:bg-gray-700 rounded-full peer-checked:bg-primary/20 dark:peer-checked:bg-primary/30 transition-all duration-200 ease-in-out">
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-all duration-200 ease-in-out shadow-sm ${
                    config.useRAG 
                      ? 'translate-x-5 bg-primary' 
                      : 'translate-x-0 bg-white dark:bg-gray-300'
                  }`}></div>
                </div>
              </div>
            </label>
          </div>

          {/* Botón limpiar chat - Más discreto */}
          <button
            onClick={onClearChat}
            className="w-full mt-36 flex items-center gap-2 px-2 py-2 rounded-md text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/30 transition-colors"
          >
            <span className="material-symbols-outlined text-base">delete</span>
            <span>Limpiar Chat</span>
          </button>
        </div>
      )}
      
      {/* Mensaje cuando no estás en chat */}
      {location.pathname !== '/chat' && (
        <div className="flex-1"></div>
      )}

      {/* Estado de conexión - Más sutil */}
      <div className="mt-auto pt-3 border-t border-gray-200/50 dark:border-gray-800/50">
        <div className="flex items-center justify-center gap-2 px-3 py-2">
          <div className={`w-2 h-2 rounded-full ${
            apiStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
            {apiStatus === 'connected' ? 'Conectado' : 'Desconectado'}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

