import React from 'react';

const SourceCard = ({ source, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 transition-all shadow-sm hover:shadow-md cursor-pointer"
    >
      {/* Icon */}
      <div className="flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary shrink-0">
        <span className="material-symbols-outlined text-lg sm:text-2xl">description</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-bold text-primary dark:text-white truncate">
          {source.document || 'Documento desconocido'}
        </p>
        {source.excerpt && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 sm:line-clamp-2">
            {source.excerpt}
          </p>
        )}
      </div>

      {/* Arrow icon */}
      <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-base sm:text-lg shrink-0">
        chevron_right
      </span>
    </div>
  );
};

export default SourceCard;


