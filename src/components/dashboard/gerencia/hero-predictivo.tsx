"use client";

import { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { AlertTriangle, Info, Target } from "lucide-react";
import { ResumenEquipoData } from "@/types/api"; 
import { formatCLP, formatCompactCLP } from "@/utils/formatters";


interface HeroPredictivoProps {
  data: ResumenEquipoData; 
  className?: string;
}

export function HeroPredictivo({ data, className = "" }: HeroPredictivoProps) {
  // 1. Extracción y sanitización de datos
  const real = data.ventas_acumuladas || 0;
  const meta = data.meta_mensual || 0;
  const forecast = data.forecast_cierre_mensual || real; // Si no hay forecast, es lo real
  const gap = data.gap_proyectado_meta || 0;
  const prob = data.probabilidad_cumplimiento_pct || 0;
  
  const hayDeficit = gap > 0 && forecast < meta;

  // 2. Cálculos para el Bullet Chart (HTML/CSS)
  
  // ANCLAJE DE ESCALA: Si la proyección es menor a la meta, maxScale es la meta 
  // para que la línea negra calce exacto al 100% del contenedor. Si la supera, se expande.
  const maxScale = Math.max(meta, forecast) || 1;
  
  const widthReal = Math.min((real / maxScale) * 100, 100);
  const widthForecast = Math.max(Math.min(((forecast - real) / maxScale) * 100, 100), 0);
  const posMeta = Math.min((meta / maxScale) * 100, 100);

  // 3. Configuración del Donut Chart (Probabilidad)
  const donutOption = useMemo(() => {
    // Regla de Negocio INSECAP: <80% Rojo, 80-99% Amarillo, >=100% Verde
    const probColor = prob >= 100 ? "#10b981" : prob >= 80 ? "#f59e0b" : "#ef4444";

    return {
      tooltip: { show: false },
      series: [
        {
          type: "pie",
          radius: ["70%", "90%"],
          avoidLabelOverlap: false,
          silent: true, // Desactiva interactividad para no generar ruido visual
          label: {
            show: true,
            position: "center",
            formatter: `${prob}%`,
            fontSize: 32,
            fontWeight: "bold",
            color: "#ffffff", // slate-900
          },
          data: [
            { value: prob, itemStyle: { color: probColor } },
            { value: Math.max(100 - prob, 0), itemStyle: { color: "#334155" } }, // Fondo gris
          ],
        },
      ],
    };
  }, [prob]);

  return (
    // Agregamos la prop className al contenedor principal
    <div className={`flex flex-col lg:flex-row w-full bg-slate-800 rounded-2xl border border-slate-800 shadow-sm overflow-hidden ${className}`}>
      
      {/* SECCIÓN IZQUIERDA: FORECAST Y BULLET CHART */}
      <div className="flex-1 p-6 lg:p-8 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Proyección de Ventas (Cierre de Mes)
          </h2>
          {/* Envolvemos en span nativo para el title */}
          <span title="Cálculo predictivo basado en monto bruto y tasa de éxito." className="cursor-help flex items-center">
            <Info className="w-4 h-4 text-slate-400" />
          </span>
        </div>
        
        <div className="flex gap-10 mb-8">
          <span className="text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            {formatCompactCLP(forecast)}
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-400">Meta Asignada:</span>
            <span className="text-lg font-bold text-slate-200">{formatCompactCLP(meta)}</span>
          </div>
        </div>

        {/* BULLET CHART - Data-Ink Ratio Optimizado */}
        <div className="relative w-full h-10 bg-slate-700 rounded-lg overflow-hidden flex items-center mb-4">
          {/* Capa 1: Venta Real (Azul Corporativo #485CC7) */}
          <div 
            className="absolute left-0 h-full bg-[#485CC7] transition-all duration-700 ease-out z-20 flex items-center px-3"
            style={{ width: `${widthReal}%` }}
          >
            {widthReal > 15 && (
              <span className="text-xs font-bold text-white whitespace-nowrap">
                REAL: {formatCompactCLP(real)}
              </span>
            )}
          </div>
          
          {/* Capa 2: Proyección (Celeste Corporativo #00B8DE Translúcido) */}
          <div 
            className="absolute h-full bg-[#00B8DE]/90 transition-all duration-700 ease-out z-10 flex items-center justify-center border-l border-white/20"
            style={{ left: `${widthReal}%`, width: `${widthForecast}%` }}
          >
            {widthForecast > 15 && (
              <span className="text-xs font-bold text-white uppercase tracking-wider opacity-90">
                + Proyección
              </span>
            )}
          </div>

          {/* Marcador de Meta */}
          <div 
            className="absolute h-12 w-1.5 bg-slate-900 z-30 transform -translate-x-1/2 rounded-full shadow-sm"
            style={{ left: `${posMeta}%` }}
          />
          
        </div>

        {/* METADATOS Y ALERTAS PRESCRIPTIVAS */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="text-sm font-medium text-slate-400">
            Avance: <strong className="text-slate-300">{data.progreso_meta_pct || 0}%</strong> de la meta total
          </span>

          {hayDeficit ? (
            <div className="flex items-center gap-2 bg-red-900 text-red-200 px-3 py-1.5 rounded-md border border-red-500">
              <AlertTriangle className="w-4 h-4 text-red-300" />
              <span className="text-sm font-semibold">
                Déficit Estimado (GAP): Faltarán {formatCLP(gap)}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-emerald-950/80 text-emerald-300 border-emerald-800/60 px-3 py-1.5 rounded-md border">
              <Target className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold">
                Meta Asegurada: Superávit de {formatCLP(Math.abs(gap))}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN DERECHA: DONUT CHART DE PROBABILIDAD */}
      <div className="w-full lg:w-72 bg-slate-800 border-t lg:border-t-0 lg:border-l border-slate-700 p-6 flex flex-col items-center justify-center">
        <div className="flex items-center gap-1.5 mb-2">
          <h3 className="text-sm font-semibold text-slate-300 text-center">
            Probabilidad de llegar a meta
          </h3>
          <span title="Probabilidad calculada por el modelo ML." className="cursor-help flex items-center">
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </span>
        </div>
        
        <div className="w-40 h-40">
          <ReactECharts 
            option={donutOption} 
            style={{ height: "100%", width: "100%" }} 
            opts={{ renderer: "svg" }}
          />
        </div>
      </div>
      
    </div>
  );
}