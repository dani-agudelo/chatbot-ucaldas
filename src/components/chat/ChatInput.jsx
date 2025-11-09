import React, { useState, useRef, useEffect } from 'react';

const ChatInput = ({ onSend, disabled = false }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-6 pt-4 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-background-dark/50 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
          placeholder="Escribe tu pregunta sobre Inteligencia Artificial..."
          className="w-full min-h-[56px] max-h-[200px] pl-5 pr-16 py-4 rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:ring-2 focus:ring-primary focus:border-primary transition-shadow disabled:opacity-50 disabled:cursor-not-allowed resize-none"
          style={{ lineHeight: '1.5' }}
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="absolute right-3 bottom-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
        >
          <span className="material-symbols-outlined">send</span>
        </button>
      </form>
    </div>
  );
};

export default ChatInput;


