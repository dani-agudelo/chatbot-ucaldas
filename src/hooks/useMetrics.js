import { useState, useEffect, useCallback } from 'react';
import { systemAPI } from '../services/api';

export const useMetrics = (autoRefresh = false, interval = 30000) => {
  const [stats, setStats] = useState(null);
  const [health, setHealth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Obtiene las estadísticas del sistema
   */
  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await systemAPI.getStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.message || 'Error al cargar estadísticas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Obtiene el estado de salud del sistema
   */
  const fetchHealth = useCallback(async () => {
    try {
      const data = await systemAPI.healthCheck();
      setHealth(data);
    } catch (err) {
      console.error('Error fetching health:', err);
      setHealth({ status: 'unhealthy', error: err.message });
    }
  }, []);

  /**
   * Refresca todos los datos
   */
  const refresh = useCallback(async () => {
    await Promise.all([fetchStats(), fetchHealth()]);
  }, [fetchStats, fetchHealth]);

  // Carga inicial
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const intervalId = setInterval(refresh, interval);
    return () => clearInterval(intervalId);
  }, [autoRefresh, interval, refresh]);

  return {
    stats,
    health,
    isLoading,
    error,
    refresh,
  };
};


