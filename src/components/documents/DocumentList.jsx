import React, { useState, useEffect } from 'react';
import { documentsAPI } from '../../services/api';
import Swal from 'sweetalert2';

const DocumentList = ({ refreshKey = 0 }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await documentsAPI.list();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Error cargando documentos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [refreshKey]);

  const handleDelete = async (filename) => {
    const result = await Swal.fire({
      title: '¿Eliminar documento?',
      text: `Se eliminará "${filename}" permanentemente`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await documentsAPI.delete(filename);
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El documento ha sido eliminado',
          timer: 1500,
          showConfirmButton: false
        });
        loadDocuments();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.detail || 'No se pudo eliminar'
        });
      }
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredDocuments = documents.filter(doc =>
    doc.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando documentos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          search
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar documento..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
        />
      </div>

      {/* Count */}
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {documents.length} documento{documents.length !== 1 ? 's' : ''} en el sistema
      </p>

      {/* Documents list */}
      {filteredDocuments.length > 0 ? (
        <div className="space-y-3">
          {filteredDocuments.map((doc) => (
            <div 
              key={doc.filename}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  doc.extension === '.pdf' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  <span className="material-symbols-outlined">
                    {doc.extension === '.pdf' ? 'picture_as_pdf' : 'description'}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {doc.filename}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatSize(doc.size)} • {formatDate(doc.uploaded_at)}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => handleDelete(doc.filename)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                title="Eliminar documento"
              >
                <span className="material-symbols-outlined text-xl">delete</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <span className="material-symbols-outlined text-gray-400 text-4xl">folder_off</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {searchTerm ? 'No se encontraron documentos' : 'Sin documentos'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {searchTerm ? 'Intenta con otros términos' : 'Sube un documento para comenzar'}
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentList;


