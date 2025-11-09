import { useState, useCallback, useRef, useEffect } from 'react';
import { chatAPI } from '../services/api';
import { useChatContext } from '../context/ChatContext';

export const useChat = (initialThreadId = null, externalConfig = null) => {
  const [threadId] = useState(initialThreadId || `user_${Date.now()}`);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Obtener mensajes y funciones del Context
  const { 
    messages: contextMessages,  
    clearMessages,
    setMessages: setContextMessages
  } = useChatContext();
  
  // Usar mensajes del Context (persistentes entre navegaciones)
  const messages = contextMessages;
  const setMessages = setContextMessages;
  
  // Usar config externo si está disponible, sino usar config interno
  const [internalConfig, setInternalConfig] = useState({
    useRAG: true,
    mode: 'extended',
    modelName: 'gemini',
  });
  
  const config = externalConfig || internalConfig;
  
  const messagesEndRef = useRef(null);

  // Auto-scroll al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Envía un mensaje al chatbot
   */
  const sendMessage = useCallback(async (message) => {
    if (!message.trim()) return;

    setIsLoading(true);
    setError(null);

    // Agregar mensaje del usuario
    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await chatAPI.sendMessage({
        message,
        thread_id: threadId,
        use_rag: config.useRAG,
        model_name: config.modelName,
        mode: config.mode,
      });

      // Agregar respuesta del asistente
      const assistantMessage = {
        role: 'assistant',
        content: response.response,
        sources: response.sources || [],
        metrics: response.metrics || {},
        timestamp: response.timestamp || new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMessage]);

      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Error al enviar mensaje';
      setError(errorMessage);
      
      // Agregar mensaje de error
      setMessages(prev => [...prev, {
        role: 'error',
        content: `Error: ${errorMessage}`,
        timestamp: new Date().toISOString(),
      }]);
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [threadId, config, setMessages]);

  /**
   * Limpia el historial de chat
   */
  const clearChat = useCallback(() => {
    clearMessages();
    setError(null);
  }, [clearMessages]);

  /**
   * Actualiza la configuración del chat (solo si no hay config externo)
   */
  const updateConfig = useCallback((newConfig) => {
    if (!externalConfig) {
      setInternalConfig(prev => ({ ...prev, ...newConfig }));
    }
  }, [externalConfig]);

  /**
   * Elimina el historial del servidor
   */
  const deleteHistory = useCallback(async () => {
    try {
      await chatAPI.deleteHistory(threadId);
      clearChat();
    } catch (err) {
      console.error('Error deleting history:', err);
      setError('Error al eliminar el historial');
    }
  }, [threadId, clearChat]);

  return {
    threadId,
    messages,
    isLoading,
    error,
    config,
    sendMessage,
    clearChat,
    updateConfig,
    deleteHistory,
    messagesEndRef,
  };
};

