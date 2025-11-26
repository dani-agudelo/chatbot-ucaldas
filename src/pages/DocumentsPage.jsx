import React, { useState, useRef, useCallback, useEffect } from 'react';
import DocumentList from '../components/documents/DocumentList';
import Button from '../components/ui/Button';
import { documentsAPI } from '../services/api';
import Swal from 'sweetalert2';

const DocumentsPage = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const [reloadStatus, setReloadStatus] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const fileInputRef = useRef(null);
  const pollingRef = useRef(null);

  // Polling para verificar estado de recarga
  const checkReloadStatus = useCallback(async () => {
    try {
      const status = await documentsAPI.getReloadStatus();
      setReloadStatus(status);
      
      if (!status.in_progress && isReloading) {
        // La recarga terminó
        setIsReloading(false);
        
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
        
        if (status.last_error) {
          Swal.fire({
            icon: 'error',
            title: 'Error al recargar',
            text: status.last_error,
          });
        } else {
          Swal.fire({
            icon: 'success',
            title: '¡Documentos recargados!',
            html: `
              <p>Base de conocimiento actualizada</p>
              <p class="text-sm text-gray-500 mt-2">
                ${status.last_result?.message || 'Procesamiento completado'}
              </p>
            `,
            timer: 3000,
            showConfirmButton: false,
          });
        }
      }
    } catch (error) {
      console.error('Error checking reload status:', error);
    }
  }, [isReloading]);

  // Limpiar polling al desmontar
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  const handleReloadRAG = async () => {
    const result = await Swal.fire({
      title: '¿Recargar documentos en RAG?',
      html: `
        <p class="text-sm text-gray-600">Esto procesará todos los documentos y actualizará la base de conocimiento.</p>
        <p class="text-xs text-blue-600 mt-2">ℹ️ El proceso se ejecutará en segundo plano</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, recargar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#7c3aed',
    });

    if (result.isConfirmed) {
      setIsReloading(true);
      try {
        const response = await documentsAPI.reload();
        
        if (response.status === 'in_progress') {
          // Ya hay una recarga en progreso
          Swal.fire({
            icon: 'info',
            title: 'Recarga en progreso',
            text: response.message,
            timer: 3000,
            showConfirmButton: false,
          });
        } else if (response.status === 'started') {
          // Iniciar polling para verificar cuando termine
          Swal.fire({
            icon: 'info',
            title: 'Procesando documentos...',
            html: `
              <p>${response.message}</p>
              <p class="text-sm text-gray-500 mt-2">Puedes seguir usando la aplicación mientras se procesa.</p>
            `,
            timer: 3000,
            showConfirmButton: false,
          });
          
          // Polling cada 3 segundos
          pollingRef.current = setInterval(checkReloadStatus, 3000);
        } else {
          // Respuesta inmediata (no debería pasar pero por si acaso)
          setIsReloading(false);
          Swal.fire({
            icon: 'success',
            title: '¡Documentos recargados!',
            text: response.message || 'Base de conocimiento actualizada',
            timer: 2500,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        setIsReloading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error al recargar',
          text: error.response?.data?.detail || 'Error desconocido',
        });
      }
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    // Validar extensión
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['txt', 'pdf'].includes(ext)) {
      Swal.fire({
        icon: 'error',
        title: 'Formato no válido',
        text: 'Solo se permiten archivos .txt y .pdf',
      });
      return;
    }

    // Validar tamaño (10MB)
    if (file.size > 10 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'Archivo muy grande',
        text: 'El tamaño máximo es 10MB',
      });
      return;
    }

    setIsUploading(true);
    try {
      const result = await documentsAPI.upload(file);
      Swal.fire({
        icon: 'success',
        title: '¡Documento subido!',
        text: result.message,
        timer: 2000,
        showConfirmButton: false,
      });
      setShowUpload(false);
      setRefreshKey(prev => prev + 1); // Refrescar lista
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al subir',
        text: error.response?.data?.detail || 'Error desconocido',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) handleFileUpload(file);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Documentos</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Fuentes de información del chatbot</p>
        </div>
        <Button 
          icon={showUpload ? "close" : "upload"}
          onClick={() => setShowUpload(!showUpload)}
          variant={showUpload ? "secondary" : "primary"}
        >
          {showUpload ? "Cancelar" : "Subir Documento"}
        </Button>
      </div>

      {/* Upload section */}
      {showUpload && (
        <div 
          className={`rounded-xl bg-white dark:bg-surface-dark p-8 border-2 border-dashed transition-colors ${
            isDragging 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-300 dark:border-gray-700'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".txt,.pdf"
            className="hidden"
          />
          
          <div className="text-center space-y-4">
            <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full transition-colors ${
              isDragging ? 'bg-primary/20' : 'bg-primary/10'
            }`}>
              <span className="material-symbols-outlined text-primary text-4xl">
                {isUploading ? 'sync' : 'upload_file'}
              </span>
            </div>
            
            {isUploading ? (
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Subiendo documento...
                </p>
                <div className="w-48 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
                  <div className="h-full bg-primary animate-pulse rounded-full"></div>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {isDragging ? '¡Suelta el archivo aquí!' : 'Arrastra archivos aquí'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    o haz clic para seleccionar
                  </p>
                </div>
                <Button 
                  variant="primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Seleccionar Archivo
                </Button>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Formatos soportados: TXT, PDF (máx. 10MB)
                </p>
              </>
            )}
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Documentos Disponibles</h2>
          <div className="flex items-center gap-3">
            {isReloading && (
              <span className="text-sm text-primary animate-pulse flex items-center gap-2">
                <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                Procesando en background...
              </span>
            )}
            <Button
              icon={isReloading ? "hourglass_empty" : "refresh"}
              onClick={handleReloadRAG}
              variant="secondary"
              disabled={isReloading}
              className={isReloading ? "opacity-50 cursor-not-allowed" : ""}
            >
              {isReloading ? "En proceso..." : "Recargar en RAG"}
            </Button>
          </div>
        </div>
        <DocumentList refreshKey={refreshKey} />
      </div>
    </div>
  );
};

export default DocumentsPage;

