import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  config => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => {
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  error => {
    console.error('[API Error]:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export const chatAPI = {
  /**
   * Envía un mensaje al chatbot
   */
  sendMessage: async (data) => {
    const response = await api.post('/api/chat/', data);
    return response.data;
  },
};

export const systemAPI = {
  /**
   * Verifica el estado de salud del sistema
   */
  healthCheck: async () => {
    const response = await api.get('/api/health');
    return response.data;
  },
  
  /**
   * Obtiene estadísticas del sistema
   */
  getStats: async () => {
    const response = await api.get('/api/stats');
    return response.data;
  },
  
  /**
   * Obtiene información general de la API
   */
  getInfo: async () => {
    const response = await api.get('/api/info');
    return response.data;
  },
};

// ============================================================================
// METRICS API
// ============================================================================

export const metricsAPI = {
  /**
   * Obtiene métricas detalladas del reporte CSV
   */
  getReport: async () => {
    const response = await api.get('/api/metrics/report');
    return response.data;
  },
};

// ============================================================================
// DOCUMENTS API (para Fase 2)
// ============================================================================

export const documentsAPI = {
  /**
   * Lista todos los documentos
   */
  list: async () => {
    // TODO: Implementar en Fase 2
    return { documents: [] };
  },
  
  /**
   * Sube un nuevo documento
   */
  upload: async (file) => {
    // TODO: Implementar en Fase 2
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default api;


