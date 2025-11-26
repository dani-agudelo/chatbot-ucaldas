import React, { useState, useEffect } from 'react';
import { metricsAPI } from '../../services/api';
import LoadingSpinner from '../ui/LoadingSpinner';
import Button from '../ui/Button';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const MetricsDashboard = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await metricsAPI.getReport();
      setData(response);
    } catch (err) {
      console.error('Error fetching metrics:', err);
      setError(err.message || 'Error al cargar métricas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" text="Cargando métricas..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-4xl">error</span>
          </div>
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Error al cargar métricas</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Button onClick={fetchMetrics} icon="refresh">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  if (!data || data.total_interactions === 0) {
    return (
      <div className="rounded-xl bg-white dark:bg-surface-dark p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="text-center py-6 sm:py-8">
          <div className="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 mb-4">
            <span className="material-symbols-outlined text-primary text-3xl sm:text-4xl">analytics</span>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Dashboard de Métricas
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
            Las métricas se generan automáticamente cuando los usuarios interactúan con el chatbot
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">chat</span>
              <span>Interacciones</span>
            </div>
            <div className="hidden sm:block">•</div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">speed</span>
              <span>Latencia</span>
            </div>
            <div className="hidden sm:block">•</div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">token</span>
              <span>Tokens</span>
            </div>
            <div className="hidden sm:block">•</div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">attach_money</span>
              <span>Costos</span>
            </div>
          </div>
          <div className="mt-6 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg max-w-sm mx-auto">
            <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
              💡 Envía mensajes al chatbot para comenzar a generar métricas
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con botón de actualizar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard de Métricas</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {data.date_range.start && data.date_range.end && (
              <>
                {new Date(data.date_range.start).toLocaleDateString()} - {new Date(data.date_range.end).toLocaleDateString()}
              </>
            )}
          </p>
        </div>
        <Button onClick={fetchMetrics} icon="refresh" variant="secondary" size="sm">
          Actualizar
        </Button>
      </div>

      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Interacciones"
          value={data.total_interactions.toLocaleString()}
          icon="chat"
          color="blue"
        />
        <MetricCard
          title="Costo Total"
          value={`$${data.totals.cost_usd.toFixed(6)}`}
          icon="attach_money"
          color="green"
        />
        <MetricCard
          title="Tokens Totales"
          value={data.totals.tokens.toLocaleString()}
          icon="token"
          color="purple"
        />
        <MetricCard
          title="Latencia Promedio"
          value={`${data.averages.latency_ms.toFixed(0)} ms`}
          icon="speed"
          color="orange"
        />
      </div>

      {/* Gráficos por fecha */}
      {data.by_date && data.by_date.length > 0 && (
        <div className="space-y-6">
          {/* Gráfico de interacciones por día - Barras */}
          <ChartCard title="Interacciones por Día">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.by_date.map(d => ({
                ...d,
                fecha: new Date(d.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="fecha" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="count" 
                  fill="#3b82f6" 
                  name="Interacciones"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Gráfico de latencia promedio - Línea */}
          <ChartCard title="Latencia Promedio por Día (ms)">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.by_date.map(d => ({
                ...d,
                fecha: new Date(d.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="fecha" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  label={{ value: 'ms', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="avg_latency" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  name="Latencia (ms)"
                  dot={{ fill: '#f97316', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Gráfico de costo y tokens - Área */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Costo Acumulado por Día (USD)">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={data.by_date.map(d => ({
                  ...d,
                  fecha: new Date(d.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
                  costo: parseFloat(d.total_cost.toFixed(6))
                }))}>
                  <defs>
                    <linearGradient id="colorCosto" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="fecha" 
                    stroke="#6b7280"
                    style={{ fontSize: '11px' }}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    style={{ fontSize: '11px' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => `$${value.toFixed(6)}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="costo" 
                    stroke="#10b981" 
                    fillOpacity={1} 
                    fill="url(#colorCosto)"
                    name="Costo (USD)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Tokens Totales por Día">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={data.by_date.map(d => ({
                  ...d,
                  fecha: new Date(d.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
                }))}>
                  <defs>
                    <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="fecha" 
                    stroke="#6b7280"
                    style={{ fontSize: '11px' }}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    style={{ fontSize: '11px' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => value.toLocaleString()}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total_tokens" 
                    stroke="#8b5cf6" 
                    fillOpacity={1} 
                    fill="url(#colorTokens)"
                    name="Tokens"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      )}

      {/* Métricas detalladas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Promedios */}
        <div className="rounded-xl bg-white dark:bg-surface-dark p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">analytics</span>
            Promedios
          </h3>
          <div className="space-y-3">
            <MetricRow label="Latencia" value={`${data.averages.latency_ms.toFixed(2)} ms`} />
            <MetricRow label="Tokens por interacción" value={data.averages.tokens.toFixed(0)} />
            <MetricRow label="Costo por interacción" value={`$${data.averages.cost_usd.toFixed(6)}`} />
            <MetricRow label="Documentos recuperados" value={data.averages.docs_retrieved.toFixed(1)} />
            <MetricRow label="Score de similitud" value={data.averages.similarity_score.toFixed(4)} />
            <MetricRow label="Validez de citaciones" value={`${(data.averages.citation_validity * 100).toFixed(1)}%`} />
            <MetricRow label="Tasa de alucinación" value={`${(data.averages.hallucination_rate * 100).toFixed(2)}%`} />
          </div>
        </div>

        {/* Totales */}
        <div className="rounded-xl bg-white dark:bg-surface-dark p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">summarize</span>
            Totales
          </h3>
          <div className="space-y-3">
            <MetricRow label="Costo total" value={`$${data.totals.cost_usd.toFixed(6)}`} />
            <MetricRow label="Tokens totales" value={data.totals.tokens.toLocaleString()} />
            <MetricRow label="Tokens de entrada" value={data.totals.input_tokens.toLocaleString()} />
            <MetricRow label="Tokens de salida" value={data.totals.output_tokens.toLocaleString()} />
            <MetricRow label="Citaciones totales" value={data.totals.citations.toLocaleString()} />
            <MetricRow label="Citaciones válidas" value={data.totals.valid_citations.toLocaleString()} />
          </div>
        </div>
      </div>

    </div>
  );
};

const MetricCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  return (
    <div className="rounded-xl bg-white dark:bg-surface-dark p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          <span className="material-symbols-outlined text-white text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );
};

const ChartCard = ({ title, children }) => {
  return (
    <div className="rounded-xl bg-white dark:bg-surface-dark p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
      {children}
    </div>
  );
};

const MetricRow = ({ label, value }) => {
  return (
    <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <span className="text-sm font-semibold text-gray-900 dark:text-white">{value}</span>
    </div>
  );
};

export default MetricsDashboard;

