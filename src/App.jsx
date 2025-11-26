import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ChatProvider } from './context/ChatContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import ChatPage from './pages/ChatPage';
import MetricsPage from './pages/MetricsPage';
import DocumentsPage from './pages/DocumentsPage';
import LoginPage from './pages/LoginPage';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Rutas protegidas solo para admin
const AdminRoute = ({ children }) => {
  const { isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Verificando..." />
      </div>
    );
  }

  if (!isAdmin()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChatProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/chat" replace />} />
              <Route path="chat" element={<ChatPage />} />
              
              {/* Solo admin */}
              <Route path="metrics" element={<AdminRoute><MetricsPage /></AdminRoute>} />
              <Route path="documents" element={<AdminRoute><DocumentsPage /></AdminRoute>} />
              
              <Route path="*" element={<Navigate to="/chat" replace />} />
            </Route>
          </Routes>
        </ChatProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

