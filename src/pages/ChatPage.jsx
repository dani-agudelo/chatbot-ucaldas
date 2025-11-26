import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useChat } from '../hooks/useChat';
import ChatMessage from '../components/chat/ChatMessage';
import ChatInput from '../components/chat/ChatInput';
import { LoadingDots } from '../components/ui/LoadingSpinner';
import { useChatContext } from '../context/ChatContext';
import { confirmDialog, errorAlert, showToast } from '../utils/sweetAlert';

const ChatPage = () => {
  const [threadId] = useState(() => `user_${Date.now()}`);
  const { config: contextConfig, clearChatTrigger, newChatTrigger } = useChatContext();
  const { messages, isLoading, sendMessage, clearChat, messagesEndRef } = useChat(threadId, contextConfig);
  const [selectedSource, setSelectedSource] = useState(null);
  const chatContainerRef = useRef(null);

  const [showWelcome, setShowWelcome] = useState(messages.length === 0);

  useEffect(() => {
    setShowWelcome(messages.length === 0);
  }, [messages.length]);

  const handleSend = async (message) => {
    try {
      await sendMessage(message);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      
      // Mostrar alerta de error con SweetAlert
      await errorAlert({
        title: 'Error al enviar mensaje',
        text: error.response?.data?.detail || error.message || 'No se pudo enviar el mensaje. Por favor, intenta nuevamente.',
      });
    }
  };

  const handleNewChat = useCallback(async () => {
    const confirmed = await confirmDialog({
      title: '¿Iniciar un nuevo chat?',
      text: 'Se perderá el historial actual de la conversación.',
      confirmText: 'Sí, iniciar nuevo chat',
      cancelText: 'Cancelar',
      icon: 'warning',
    });

    if (confirmed) {
      clearChat();
      window.location.reload();
    }
  }, [clearChat]);

  useEffect(() => {
    if (clearChatTrigger > 0) {
      showToast({
        title: 'Chat limpiado',
        icon: 'success',
      });
    }
  }, [clearChatTrigger]);

  useEffect(() => {
    if (newChatTrigger > 0) {
      handleNewChat();
    }
  }, [newChatTrigger, handleNewChat]);

  return (
    <div className="flex flex-1 flex-col h-full">
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 scroll-smooth"
      >
        {showWelcome && (
          <div className="flex h-full items-center justify-center animate-fadeIn py-4 sm:py-0">
            <div className="text-center max-w-2xl px-2 sm:px-4">
              {/* Logo de la Universidad */}
              <div className="mx-auto mb-3 sm:mb-6 flex items-center justify-center">
                <img 
                  src="/assets/logo-uc.png" 
                  alt="Universidad de Caldas" 
                  className="w-16 h-16 sm:w-24 sm:h-24 object-contain"
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
                <div className="hidden h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-primary/10 items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-3xl sm:text-4xl">smart_toy</span>
                </div>
              </div>
              
              <h2 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-4 text-gray-900 dark:text-white">
                Bienvenido al Asistente Académico
              </h2>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-500 mb-4 sm:mb-6">
                Puedo ayudarte con preguntas sobre:
              </p>
              <div className="grid grid-cols-2 gap-2 sm:gap-4 max-w-xl mx-auto">
                {[
                  { icon: 'school', text: 'Políticas educativas' },
                  { icon: 'policy', text: 'Regulaciones de IA' },
                  { icon: 'science', text: 'Investigación en IA' },
                  { icon: 'menu_book', text: 'Documentación técnica' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-4 rounded-lg bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
                  >
                    <span className="material-symbols-outlined text-primary text-xl sm:text-2xl">{item.icon}</span>
                    <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <ChatMessage
            key={idx}
            message={msg}
            onSourceClick={(source) => setSelectedSource(source)}
          />
        ))}

        {isLoading && (
          <div className="flex items-start gap-3 animate-fadeIn">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary">smart_toy</span>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">Asistente</p>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <LoadingDots />
                <span className="text-sm text-gray-500">Generando respuesta...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSend={handleSend} disabled={isLoading} />

      {selectedSource && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedSource(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Detalles del Documento
              </h3>
              <button
                onClick={() => setSelectedSource(null)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 dark:bg-primary/20">
                <span className="material-symbols-outlined text-primary text-3xl">description</span>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{selectedSource.document}</p>
                </div>
              </div>

              {selectedSource.excerpt && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Extracto:</p>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {selectedSource.excerpt}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;

