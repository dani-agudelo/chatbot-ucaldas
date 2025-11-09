import React from 'react';
import { useMetrics } from '../hooks/useMetrics';
import StatsGrid from '../components/metrics/StatsGrid';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { formatUptime } from '../utils/formatters';

const MetricsPage = () => {
  const { stats, health, isLoading, error, refresh } = useMetrics(false);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center max-w-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-4xl">error</span>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Error al cargar métricas</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Button onClick={refresh} icon="refresh">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" text="Cargando métricas..." />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Métricas del Sistema</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Estadísticas y rendimiento del chatbot</p>
        </div>
        <Button onClick={refresh} icon="refresh" variant="secondary">
          Actualizar
        </Button>
      </div>

      {/* Main stats */}
      <StatsGrid stats={stats} />

      {/* Detailed sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RAG Stats */}
        <div className="rounded-xl bg-white dark:bg-surface-dark p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Estadísticas del RAG</h2>
            <span className="material-symbols-outlined text-primary text-3xl">search</span>
          </div>

          <div className="space-y-4">
            {stats?.rag_stats && (
              <>
                <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Chunks Indexados</span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {stats.rag_stats.total_chunks?.toLocaleString() || 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tamaño de Chunk</span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {stats.rag_stats.chunk_size || 'N/A'} chars
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overlap</span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {stats.rag_stats.chunk_overlap || 'N/A'} chars
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Health Status */}
        <div className="rounded-xl bg-white dark:bg-surface-dark p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Estado de Componentes</h2>
            <span className="material-symbols-outlined text-primary text-3xl">health_and_safety</span>
          </div>

          <div className="space-y-3">
            {health?.components && Object.entries(health.components).map(([component, status]) => (
              <div key={component} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    status.includes('operational') ? 'bg-green-500' : 
                    status.includes('degraded') ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase">
                    {component}
                  </span>
                </div>
                <Badge variant={
                  status.includes('operational') ? 'success' : 
                  status.includes('degraded') ? 'warning' : 'danger'
                } size="sm">
                  {status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="rounded-xl bg-white dark:bg-surface-dark p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Información del Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Versión</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{health?.version || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tiempo Activo</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {stats?.uptime_seconds ? formatUptime(stats.uptime_seconds) : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Estado General</p>
            <Badge 
              variant={stats?.status === 'healthy' ? 'success' : 'warning'}
              size="md"
            >
              {stats?.status === 'healthy' ? 'Operativo' : 'Degradado'}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsPage;

