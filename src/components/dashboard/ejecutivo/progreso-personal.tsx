"use client";

import { Info, Target, TrendingUp, AlertTriangle } from "lucide-react";
import { DashboardEjecutivoResponseDTO } from "@/types/api";
import { formatCompactCLP } from "@/utils/formatters";

interface ProgresoPersonalProps {
  data: DashboardEjecutivoResponseDTO;
  diasHabilesTotales?: number;
  diasHabilesTranscurridos?: number;
  className?: string;
}

export function ProgresoPersonal({ 
  data, 
  diasHabilesTotales = 22, // Por defecto un mes laboral normal
  diasHabilesTranscurridos = 15, // Mock simulando que estamos a día 15
  className = "" 
}: ProgresoPersonalProps) {
  
  // 1. Extracción y cálculos base
  const real = data.ventas_acumuladas || 0;
  const meta = data.meta_mensual || 1; // Evitar división por 0
  const forecast = data.forecast_cierre_mensual || real;
  const gap = data.gap_proyectado_meta || 0;
  
  const pctAvance = Math.min((real / meta) * 100, 100);

  // 2. Cálculo de PACING DIARIO (La métrica anti "Falsa Tranquilidad")
  const pctTiempoTranscurrido = diasHabilesTranscurridos / diasHabilesTotales;
  const pctMetaLograda = real / meta;
  
  // Pacing = 1.0 es el ritmo perfecto. < 1.0 es atraso.
  const pacing = pctTiempoTranscurrido > 0 ? (pctMetaLograda / pctTiempoTranscurrido) : 0;
  
  // Lógica de color pre-atentiva (Oponencia de color de Ware)
  const isPacingPeligro = pacing < 0.8;
  const isPacingAlerta = pacing >= 0.8 && pacing < 1.0;

  const colorPacingBg = isPacingPeligro ? "bg-red-500" : isPacingAlerta ? "bg-amber-500" : "bg-emerald-500";
  const colorPacingText = isPacingPeligro ? "text-red-600" : isPacingAlerta ? "text-amber-600" : "text-emerald-600";

  // Posición de la aguja del Pacing (tope visual en 1.5 para no desbordar)
  const pacingPos = Math.min((pacing / 1.5) * 100, 100);
  const idealPos = (1.0 / 1.5) * 100; // Posición de la línea del 1.0

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
      
      {/* TARJETA 1: PROGRESO META (Lo que ya es seguro) */}
      <div className="flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              Progreso Meta
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">Ventas que ya cerraste</span>
          </div>
          <div className="p-2 bg-blue-50 rounded-lg">
            <Target className="w-5 h-5 text-[#485CC7]" />
          </div>
        </div>
        
        <div className="flex flex-col mb-4">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {formatCompactCLP(real)}
          </span>
          <span className="text-xs font-semibold text-slate-500 mt-1">
            de {formatCompactCLP(meta)} <span className="text-[#485CC7]">({pctAvance.toFixed(1)}%)</span>
          </span>
        </div>

        {/* Barra de Progreso Simple */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mt-auto">
          <div 
            className="bg-[#485CC7] h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${pctAvance}%` }}
          />
        </div>
      </div>

      {/* TARJETA 2: PACING DIARIO (La velocidad vs el tiempo) */}
      <div className="flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-slate-800">Pacing Diario</h3>
              <span title="Ritmo de venta vs el calendario laboral. Si es menor a 1.0, vas atrasado." className="cursor-help">
                <Info className="w-3.5 h-3.5 text-slate-400" />
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Ritmo de venta vs Calendario Hábil</span>
          </div>
          <div className={`p-2 rounded-lg ${isPacingPeligro ? 'bg-red-50' : isPacingAlerta ? 'bg-amber-50' : 'bg-emerald-50'}`}>
            <TrendingUp className={`w-5 h-5 ${colorPacingText}`} />
          </div>
        </div>
        
        <div className="flex items-end justify-between mb-4">
          <span className={`text-4xl font-black tracking-tighter ${colorPacingText}`}>
            {pacing.toFixed(2)}
          </span>
          <span className="text-xs font-bold text-slate-400 mb-1">
            Ideal: 1.0
          </span>
        </div>

        {/* Linear Pacing Gauge (Bullet Chart invertido) */}
        <div className="relative w-full h-2.5 bg-slate-100 rounded-full mt-auto mb-1">
          {/* Relleno Dinámico */}
          <div 
            className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-out ${colorPacingBg}`}
            style={{ width: `${pacingPos}%` }}
          />
          {/* Marca del 1.0 Ideal */}
          <div 
            className="absolute top-[-4px] bottom-[-4px] w-1 bg-slate-800 rounded-full z-10"
            style={{ left: `${idealPos}%` }}
          />
        </div>
      </div>

      {/* TARJETA 3: PROYECCIÓN PERSONAL (El Hero Predictivo del Ejecutivo) */}
      <div className="flex flex-col bg-slate-900 rounded-2xl border border-slate-800 shadow-lg p-6 hover:shadow-xl transition-shadow relative overflow-hidden">
        {/* Elemento de diseño: resplandor sutil de fondo */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-[#00B8DE] opacity-20 blur-3xl pointer-events-none"></div>

        <div className="flex justify-between items-start mb-3 relative z-10">
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Proyección Personal
            </h3>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5">
              Si sigues trabajando así, cerrarás con:
            </span>
          </div>
        </div>
        
        <div className="flex flex-col mt-2 relative z-10">
          <span className="text-4xl lg:text-5xl font-black text-white tracking-tight">
            {formatCompactCLP(forecast)}
          </span>
          
          <div className="mt-4 flex items-center">
            {gap > 0 ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/20 border border-red-500/30 text-xs font-bold text-red-400">
                <AlertTriangle className="w-3.5 h-3.5" />
                Te faltarán {formatCompactCLP(gap)}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold text-emerald-400">
                <Target className="w-3.5 h-3.5" />
                ¡Meta Asegurada! (+{formatCompactCLP(Math.abs(gap))})
              </span>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}