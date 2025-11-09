import React, { createContext, useContext, useState, useCallback } from 'react';

const ChatContext = createContext();

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    return {
      config: null,
      updateConfig: () => {},
      clearChat: () => {},
      newChat: () => {},
      messages: [],
      addMessage: () => {},
      clearMessages: () => {},
    };
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [config, setConfig] = useState({
    useRAG: true,
    mode: 'extended',
    modelName: 'gemini',
  });

  // Estado persistente de mensajes
  const [messages, setMessages] = useState([]);

  const [clearChatTrigger, setClearChatTrigger] = useState(0);
  const [newChatTrigger, setNewChatTrigger] = useState(0);

  const updateConfig = (newConfig) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  // Agregar un mensaje al historial
  const addMessage = useCallback((message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  // Agregar múltiples mensajes
  const addMessages = useCallback((newMessages) => {
    setMessages(prev => [...prev, ...newMessages]);
  }, []);

  // Limpiar mensajes
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const clearChat = () => {
    clearMessages();
    setClearChatTrigger(prev => prev + 1);
  };

  const newChat = () => {
    setNewChatTrigger(prev => prev + 1);
  };

  return (
    <ChatContext.Provider value={{
      config,
      updateConfig,
      clearChat,
      newChat,
      clearChatTrigger,
      newChatTrigger,
      messages,
      addMessage,
      addMessages,
      clearMessages,
      setMessages,
    }}>
      {children}
    </ChatContext.Provider>
  );
};


