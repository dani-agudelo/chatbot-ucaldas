import React from 'react';
import MetricCard from './MetricCard';

const StatsGrid = ({ stats }) => {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        label="Consultas Totales"
        value={stats.total_queries || 0}
        icon="chat"
        helpText="Total desde el inicio"
      />
      
      <MetricCard
        label="Tiempo Activo"
        value={formatUptime(stats.uptime_seconds || 0)}
        icon="schedule"
        helpText="Uptime del servidor"
      />
      
      <MetricCard
        label="Modelos"
        value={stats.models_available?.length || 0}
        icon="psychology"
        helpText={stats.models_available?.join(', ') || 'N/A'}
      />
      
      <MetricCard
        label="Estado"
        value={stats.status === 'healthy' ? 'Operativo' : 'Degradado'}
        icon="health_and_safety"
        helpText="Estado general del sistema"
      />
    </div>
  );
};

// Helper function (debería estar en formatters.js pero la pongo aquí por simplicidad)
const formatUptime = (seconds) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  
  return parts.join(' ') || '0m';
};

export default StatsGrid;

