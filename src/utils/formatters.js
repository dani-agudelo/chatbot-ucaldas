/**
 * Formatea un timestamp ISO en formato legible
 */
export const formatTimestamp = (timestamp) => {
  try {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  } catch {
    return timestamp;
  }
};

/**
 * Formatea segundos en formato legible (días, horas, minutos)
 */
export const formatUptime = (seconds) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(' ');
};

/**
 * Formatea números grandes con separadores de miles
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat('es-CO').format(num);
};

/**
 * Formatea bytes en formato legible (KB, MB, GB)
 */
export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Obtiene el emoji apropiado para un estado
 */
export const getStatusEmoji = (status) => {
  const statusLower = status?.toLowerCase() || '';
  
  if (statusLower.includes('operational') || statusLower.includes('healthy')) {
    return '✅';
  } else if (statusLower.includes('degraded') || statusLower.includes('warning')) {
    return '⚠️';
  } else if (statusLower.includes('error') || statusLower.includes('unhealthy')) {
    return '❌';
  }
  
  return '❓';
};

/**
 * Obtiene clase de color para un estado
 */
export const getStatusColor = (status) => {
  const statusLower = status?.toLowerCase() || '';
  
  if (statusLower.includes('operational') || statusLower.includes('healthy') || statusLower.includes('success')) {
    return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
  } else if (statusLower.includes('degraded') || statusLower.includes('warning')) {
    return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
  } else if (statusLower.includes('error') || statusLower.includes('unhealthy') || statusLower.includes('failed')) {
    return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
  }
  
  return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800';
};

/**
 * Trunca un texto a cierta longitud
 */
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};


