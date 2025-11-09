import React, { useState } from 'react';
import DocumentList from '../components/documents/DocumentList';
import Button from '../components/ui/Button';

const DocumentsPage = () => {
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Documentos</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Fuentes de información del chatbot</p>
        </div>
        <Button 
          icon="upload"
          onClick={() => setShowUpload(!showUpload)}
          variant="primary"
        >
          Subir Documento
        </Button>
      </div>

      {/* Upload section (placeholder) */}
      {showUpload && (
        <div className="rounded-xl bg-white dark:bg-surface-dark p-8 border-2 border-dashed border-gray-300 dark:border-gray-700">
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <span className="material-symbols-outlined text-primary text-4xl">upload_file</span>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Arrastra archivos aquí
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                o haz clic para seleccionar
              </p>
            </div>
            <Button variant="primary">
              Seleccionar Archivos
            </Button>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Formatos soportados: PDF, TXT (máx. 10MB)
            </p>
            <div className="pt-4">
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-2">
                ⚠️ Funcionalidad en desarrollo (Fase 2)
              </p>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => setShowUpload(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* RAG Process Explanation */}
      <div className="rounded-xl bg-white dark:bg-surface-dark p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          ¿Cómo funciona el proceso RAG?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Cuando haces una pregunta al chatbot:
        </p>

        <div className="space-y-4">
          {[
            {
              icon: 'search',
              title: '1. Búsqueda Semántica',
              description: 'El sistema busca los 4 fragmentos más relevantes usando embeddings y similitud semántica.'
            },
            {
              icon: 'dataset',
              title: '2. Construcción del Contexto',
              description: 'Los fragmentos relevantes se concatenan manteniendo la referencia a cada fuente.'
            },
            {
              icon: 'smart_toy',
              title: '3. Generación de Respuesta',
              description: 'El LLM genera la respuesta usando el contexto y cita las fuentes utilizadas.'
            },
            {
              icon: 'format_quote',
              title: '4. Citación de Fuentes',
              description: 'La respuesta incluye las fuentes consultadas con extractos y enlaces.'
            },
          ].map((step, idx) => (
            <div 
              key={idx}
              className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary shrink-0">
                <span className="material-symbols-outlined text-xl">{step.icon}</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white mb-1">{step.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Documents list */}
      <div className="rounded-xl bg-white dark:bg-surface-dark p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Documentos Disponibles</h2>
        <DocumentList />
      </div>
    </div>
  );
};

export default DocumentsPage;

