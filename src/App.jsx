import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ChatProvider } from './context/ChatContext';
import MainLayout from './components/layout/MainLayout';
import ChatPage from './pages/ChatPage';
import MetricsPage from './pages/MetricsPage';
import DocumentsPage from './pages/DocumentsPage';

function App() {
  return (
    <BrowserRouter>
      <ChatProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/chat" replace />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="metrics" element={<MetricsPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="*" element={<Navigate to="/chat" replace />} />
          </Route>
        </Routes>
      </ChatProvider>
    </BrowserRouter>
  );
}

export default App;

