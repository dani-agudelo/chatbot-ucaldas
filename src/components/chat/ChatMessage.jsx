import React from 'react';
import SourceCard from './SourceCard';

const ChatMessage = ({ message, onSourceClick }) => {
  const isUser = message.role === 'user';
  const isError = message.role === 'error';

  // Traducción de métricas al español
  const translateMetric = (key) => {
    const translations = {
      'query_number': 'Consulta Número',
      'context_used': 'Contexto RAG',
      'sources_found': 'Fuentes Encontradas',
      'mode': 'Modo',
      'model': 'Modelo',
      'latency_ms': 'Latencia (ms)',
      'tokens_used': 'Tokens Usados',
      'cost': 'Costo Estimado',
      'avg_relevance_score': 'Relevancia Promedio'
    };
    return translations[key] || key.replace(/_/g, ' ');
  };

  // Formatear valores de métricas
  const formatMetricValue = (key, value) => {
    if (key === 'context_used') {
      return value ? 'Sí (usado)' : 'No (sin RAG)';
    }
    if (key === 'mode') {
      return value === 'brief' ? 'Breve' : value === 'extended' ? 'Extendido' : value;
    }
    if (typeof value === 'number') {
      // Usar decimales para latencia, costos y scores de relevancia
      if (key === 'latency_ms' || key === 'cost' || key === 'avg_relevance_score') {
        return value.toFixed(4);
      }
      // Para contadores (query_number, sources_found, tokens_used), mostrar enteros
      return Math.round(value).toString();
    }
    return value;
  };

  if (isError) {
    return (
      <div className="flex items-start gap-3 animate-fadeIn">
        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-red-600 dark:text-red-400">error</span>
        </div>
        <div className="flex-1 max-w-2xl rounded-lg px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-800 dark:text-red-300">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-3 animate-fadeIn ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
        isUser 
          ? 'bg-gray-200 dark:bg-gray-700' 
          : 'bg-primary/10 dark:bg-primary/20'
      }`}>
        <span className={`material-symbols-outlined ${
          isUser ? 'text-gray-700 dark:text-gray-300' : 'text-primary'
        }`}>
          {isUser ? 'person' : 'smart_toy'}
        </span>
      </div>

      <div className={`flex flex-1 flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Label */}
        <p className="text-xs text-gray-500 dark:text-gray-400 px-1">
          {isUser ? 'Tú' : 'Asistente'}
        </p>

        {/* Message content */}
        <div className={`max-w-2xl rounded-lg px-4 py-3 shadow-sm ${
          isUser 
            ? 'bg-primary text-white' 
            : 'bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'
        }`}>
          <p className="text-base leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>

        {/* Sources */}
        {message.sources && message.sources.length > 0 && (
          <div className="max-w-2xl w-full space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 px-1">
              Fuentes citadas ({message.sources.length})
            </p>
            {message.sources.map((source, idx) => (
              <SourceCard 
                key={idx}
                source={source}
                onClick={() => onSourceClick && onSourceClick(source)}
              />
            ))}
          </div>
        )}

        {/* Metrics */}
        {message.metrics && Object.keys(message.metrics).length > 0 && (
          <details className="max-w-2xl w-full">
            <summary className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 px-1 py-1">
              Ver métricas
            </summary>
            <div className="mt-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs space-y-1">
              {Object.entries(message.metrics).map(([key, value]) => (
                <div key={key} className="flex justify-between gap-4">
                  <span className="text-gray-600 dark:text-gray-400">
                    {translateMetric(key)}:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formatMetricValue(key, value)}
                  </span>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;

