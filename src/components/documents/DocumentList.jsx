import React, { useState } from 'react';
import DocumentCard from './DocumentCard';
import { DOCUMENT_SOURCES } from '../../utils/constants';

const DocumentList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  const documentTypes = [...new Set(DOCUMENT_SOURCES.map(doc => doc.tipo))];

  const filteredDocuments = DOCUMENT_SOURCES.filter(doc => {
    const matchesSearch = doc.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.autor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterType || doc.tipo === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
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

        {/* Type filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value="">Todos los tipos</option>
          {documentTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Mostrando <strong>{filteredDocuments.length}</strong> de <strong>{DOCUMENT_SOURCES.length}</strong> documentos
      </p>

      {/* Documents grid */}
      {filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDocuments.map((doc, idx) => (
            <DocumentCard
              key={idx}
              document={doc}
              onClick={() => console.log('Ver documento:', doc.titulo)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <span className="material-symbols-outlined text-gray-400 text-4xl">folder_off</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No se encontraron documentos
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Intenta con otros términos de búsqueda
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentList;


