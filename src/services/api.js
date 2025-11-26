import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de admin a las peticiones
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
    }
    return Promise.reject(error);
  }
);

// ============================================================================
// AUTH API (Solo para administradores)
// ============================================================================

export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
};

// ============================================================================
// CHAT API
// ============================================================================

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
// DOCUMENTS API
// ============================================================================

export const documentsAPI = {
  /**
   * Lista todos los documentos
   */
  list: async () => {
    const response = await api.get('/api/documents/list');
    return response.data;
  },
  
  /**
   * Sube un nuevo documento
   */
  upload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Elimina un documento
   */
  delete: async (filename) => {
    const response = await api.delete(`/api/documents/${encodeURIComponent(filename)}`);
    return response.data;
  },

  /**
   * Inicia la recarga de documentos en el RAG (en background)
   */
  reload: async () => {
    const response = await api.post('/api/documents/reload');
    return response.data;
  },

  /**
   * Consulta el estado de la recarga en background
   */
  getReloadStatus: async () => {
    const response = await api.get('/api/documents/reload/status');
    return response.data;
  },
};

export default api;


