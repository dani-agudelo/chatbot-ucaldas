import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MODES } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ 
  config = null, 
  onConfigChange = () => {}, 
  onClearChat = () => {}, 
  onNewChat = () => {}, 
  apiStatus = 'connected' 
}) => {
  const location = useLocation();
  const { isAdmin } = useAuth();

  // Items de navegación - algunos solo para admin
  const navItems = [
    { path: '/chat', icon: 'chat_bubble', label: 'Chat', adminOnly: false },
    { path: '/metrics', icon: 'bar_chart', label: 'Métricas', adminOnly: true },
    { path: '/documents', icon: 'description', label: 'Documentos', adminOnly: true },
  ];

  // Filtrar items según rol
  const visibleNavItems = navItems.filter(item => !item.adminOnly || isAdmin());

  return (
    <aside className="w-72 shrink-0 border-r border-gray-200/80 dark:border-gray-800/80 bg-white/30 dark:bg-background-dark/30 p-4 flex flex-col h-screen">
      
      {/* Espacio para header */}
      <div className="h-12"></div>

      {/* Navegación */}
      <nav className="flex flex-col gap-1">
        {visibleNavItems.map((item) => (
          <div key={item.path} className="flex items-center gap-1">
            <Link
              to={item.path}
              className={`flex-1 flex h-10 items-center gap-3 rounded-lg px-3 transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <p className="text-sm font-medium">{item.label}</p>
            </Link>
            
            {item.path === '/chat' && location.pathname === '/chat' && (
              <button
                onClick={onNewChat}
                className="h-10 w-10 flex items-center justify-center rounded-lg text-gray-500 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 transition-colors"
                title="Nuevo Chat"
              >
                <span className="material-symbols-outlined text-xl">add</span>
              </button>
            )}
          </div>
        ))}
      </nav>

      {/* Sección inferior fija */}
      {location.pathname === '/chat' && config && (
        <>
          {/* OPCIONES */}
          <div className="border-t border-gray-200/80 dark:border-gray-800/80 pt-5 mt-28">
            <div className="flex items-center gap-2 px-2 pb-3">
              <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-base">tune</span>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Opciones</h3>
            </div>

            <div className="space-y-1">
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
                    className="w-3.5 h-3.5 text-primary focus:ring-1 focus:ring-primary"
                  />
                  <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-base">
                    {mode.label === 'Breve' ? 'short_text' : 'subject'}
                  </span>
                  <p className="text-sm text-gray-900 dark:text-white">{mode.label}</p>
                </label>
              ))}
            </div>

            {/* Toggle RAG */}
            <label className="flex items-center justify-between px-2 py-2 mt-4 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/30 transition-colors">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-base">search</span>
                <span className="text-sm text-gray-900 dark:text-white">Usar RAG</span>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={config.useRAG}
                  onChange={(e) => onConfigChange({ useRAG: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 dark:bg-gray-700 rounded-full peer-checked:bg-primary/30 transition-all">
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-all shadow-sm ${
                    config.useRAG ? 'translate-x-4 bg-primary' : 'translate-x-0 bg-white'
                  }`}></div>
                </div>
              </div>
            </label>
          </div>

        </>
      )}

      {/* Sección al fondo: Limpiar Chat + Conectado */}
      <div className="mt-auto">
        {/* Limpiar chat - solo en página de chat */}
        {location.pathname === '/chat' && (
          <button
            onClick={onClearChat}
            className="w-full flex items-center gap-2 px-2 py-2 rounded-md text-sm text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors"
          >
            <span className="material-symbols-outlined text-base">delete</span>
            <span>Limpiar Chat</span>
          </button>
        )}

        {/* Estado de conexión */}
        <div className="border-t border-gray-200/50 dark:border-gray-800/50 mt-3 pt-3">
          <div className="flex items-center justify-center gap-2 px-3 py-2">
            <div className={`w-2 h-2 rounded-full ${
              apiStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {apiStatus === 'connected' ? 'Conectado' : 'Desconectado'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

