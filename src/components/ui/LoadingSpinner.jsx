import React from 'react';

const LoadingSpinner = ({ size = 'md', text = null }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };
  
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
      {text && <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>}
    </div>
  );
};

export const LoadingDots = () => {
  return (
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 rounded-full bg-primary animate-bounce-dot"></div>
      <div className="w-2 h-2 rounded-full bg-primary animate-bounce-dot" style={{ animationDelay: '-0.16s' }}></div>
      <div className="w-2 h-2 rounded-full bg-primary animate-bounce-dot" style={{ animationDelay: '-0.32s' }}></div>
    </div>
  );
};

export default LoadingSpinner;


