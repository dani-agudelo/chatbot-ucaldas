import React from 'react';
import Badge from '../ui/Badge';

const DocumentCard = ({ document, onClick }) => {
  const getFileIcon = (tipo) => {
    const icons = {
      'Regulación': 'gavel',
      'Legislación': 'policy',
      'Paper Fundacional': 'article',
      'Guía': 'menu_book',
      'Política Nacional': 'flag',
      'Investigación': 'science',
    };
    return icons[tipo] || 'description';
  };

  const getTypeVariant = (tipo) => {
    return 'success';
  };

  return (
    <div
      onClick={onClick}
      className="group flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer"
    >
      <div className="flex-1 p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary shrink-0">
            <span className="material-symbols-outlined text-2xl">{getFileIcon(document.tipo)}</span>
          </div>
          <Badge variant={getTypeVariant(document.tipo)} size="sm">
            {document.tipo}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 min-h-[3rem]">
          {document.titulo}
        </h3>

        {/* Info */}
        <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
          <p className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base">person</span>
            {document.autor}
          </p>
          <p className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base">calendar_today</span>
            {document.año}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;

