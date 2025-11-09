export const APP_NAME = 'Chatbot de Inteligencia Artificial';
export const UNIVERSITY_NAME = 'Universidad de Caldas';

export const MODELS = [
  { value: 'gemini', label: 'Gemini 2.0' },
  // Agregar más modelos aquí en el futuro
];

export const MODES = [
  { value: 'brief', label: 'Breve', description: 'Respuestas cortas y concisas' },
  { value: 'extended', label: 'Extendido', description: 'Respuestas detalladas y explicativas' },
];

export const COMMANDS = [
  { command: '/ayuda', description: 'Muestra todos los comandos disponibles', aliases: ['/help', '/?'] },
  { command: '/politica', description: 'Muestra la política de privacidad', aliases: ['/privacidad', '/privacy'] },
  { command: '/fuentes', description: 'Lista fuentes disponibles', aliases: ['/sources', '/docs'] },
  { command: '/modo breve', description: 'Cambia a modo respuestas cortas', aliases: ['/mode brief'] },
  { command: '/modo extendido', description: 'Cambia a modo respuestas detalladas', aliases: ['/mode extended'] },
  { command: '/estado', description: 'Muestra el estado del sistema', aliases: ['/status', '/health'] },
  { command: '/limpiar', description: 'Limpia el historial', aliases: ['/clear', '/reset'] },
];

export const DOCUMENT_SOURCES = [
  {
    titulo: 'UNESCO - Recomendación sobre la Ética de la IA',
    autor: 'UNESCO',
    año: 2021,
    tipo: 'Regulación',
  },
  {
    titulo: 'AI Act - Regulación Europea',
    autor: 'Parlamento Europeo',
    año: 2024,
    tipo: 'Legislación',
  },
  {
    titulo: 'Computing Machinery and Intelligence',
    autor: 'Alan Turing',
    año: 1950,
    tipo: 'Paper Fundacional',
  },
  {
    titulo: 'Programs with Common Sense',
    autor: 'John McCarthy',
    año: 1959,
    tipo: 'Paper Fundacional',
  },
  {
    titulo: 'Ethics Guidelines for Trustworthy AI',
    autor: 'European Commission',
    año: 2019,
    tipo: 'Guía',
  },
  {
    titulo: 'Política Nacional de Transformación Digital e IA',
    autor: 'MinTIC Colombia',
    año: 2019,
    tipo: 'Política Nacional',
  },
];

export const API_ENDPOINTS = {
  CHAT: '/api/chat/',
  HEALTH: '/api/health',
  STATS: '/api/stats',
  INFO: '/api/info',
  DOCUMENTS: '/api/documents',
};


