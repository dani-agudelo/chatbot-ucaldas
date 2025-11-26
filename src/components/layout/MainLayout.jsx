import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { systemAPI } from '../../services/api';
import { useChatContext } from '../../context/ChatContext';

const MainLayout = () => {
  const [apiStatus, setApiStatus] = useState('checking');
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { config, updateConfig, clearChat, newChat } = useChatContext();
  const location = useLocation();

  // Cerrar sidebar al cambiar de ruta (en móvil)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Verificar estado de la API
  useEffect(() => {
    const checkAPI = async () => {
      try {
        await systemAPI.healthCheck();
        setApiStatus('connected');
      } catch (error) {
        setApiStatus('disconnected');
      }
    };

    checkAPI();
    const interval = setInterval(checkAPI, 30000); // Verificar cada 30s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100">
      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        config={config}
        onConfigChange={updateConfig}
        onClearChat={clearChat}
        onNewChat={newChat}
        apiStatus={apiStatus}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header 
          onSettingsClick={() => setShowSettings(!showSettings)} 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Modal de configuración (placeholder) */}
      {showSettings && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={() => setShowSettings(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Configuración</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Configuraciones globales (próximamente)
            </p>
            <button 
              onClick={() => setShowSettings(false)}
              className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;

