import React from 'react';
import { formatNumber } from '../../utils/formatters';

const MetricCard = ({ label, value, trend = null, icon = null, helpText = null }) => {
  const getTrendColor = () => {
    if (!trend) return '';
    if (trend.direction === 'up') {
      return trend.isGood ? 'text-green-600' : 'text-red-600';
    }
    return trend.isGood ? 'text-red-600' : 'text-green-600';
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return trend.direction === 'up' ? 'arrow_upward' : 'arrow_downward';
  };

  return (
    <div className="flex flex-col gap-1.5 sm:gap-2 rounded-xl bg-white dark:bg-surface-dark p-3 sm:p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-400">{label}</p>
        {icon && (
          <span className="material-symbols-outlined text-xl sm:text-2xl text-gray-400">{icon}</span>
        )}
      </div>

      {/* Value */}
      <p className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
        {typeof value === 'number' ? formatNumber(value) : value}
      </p>

      {/* Trend */}
      {trend && (
        <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}>
          <span className="material-symbols-outlined text-base">{getTrendIcon()}</span>
          <span>{trend.value}</span>
        </div>
      )}

      {/* Help text */}
      {helpText && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">{helpText}</p>
      )}
    </div>
  );
};

export default MetricCard;


