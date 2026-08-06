"use client";

import { PieChart, TrendingDown, TrendingUp, Users } from "lucide-react";
import { formatCLP } from "@/utils/formatters";

interface MetricasSecundariasProps {
  pipelinePonderado: number;
  tasaExito: number;
  reuniones: number;
  className?: string;
}

export function MetricasSecundarias({ 
  pipelinePonderado, 
  tasaExito, 
  reuniones, 
  className = "" 
}: MetricasSecundariasProps) {
  
  // Regla visual: Si la tasa de éxito cae por debajo del 20%, alertar en rojo.
  const isTasaBaja = tasaExito < 20;

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 ${className}`}>
      
      {/* TARJETA IZQUIERDA: Pipeline Ponderado (Ocupa 7 columnas) */}
      <div className="lg:col-span-7 flex items-center justify-between bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
        <div className="flex flex-col">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Valor Ponderado (Dinero real probable)
          </h3>
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {formatCLP(pipelinePonderado)}
          </span>
          <span className="text-xs font-medium text-slate-400 mt-1">
            (Valor realista de todas las cotizaciones actuales que se están negociando que tienen oportunidad según una probabilidad)
          </span>
        </div>
        <div className="hidden sm:flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 border border-slate-100">
          <PieChart className="w-8 h-8 text-slate-300" strokeWidth={1.5} />
        </div>
      </div>

      {/* TARJETA DERECHA: Tasa de Éxito y Reuniones (Ocupa 5 columnas, dividida internamente) */}
      <div className="lg:col-span-5 flex bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        
        {/* Mitad 1: Tasa de Éxito */}
        <div className="flex-1 p-6 flex flex-col justify-center border-r border-slate-100">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2">
            Tasa Éxito
          </h3>
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {tasaExito}%
            </span>
            {isTasaBaja ? (
              <TrendingDown className="w-5 h-5 text-red-500" strokeWidth={2.5} />
            ) : (
              <TrendingUp className="w-5 h-5 text-emerald-500" strokeWidth={2.5} />
            )}
          </div>
          <span className="text-xs font-medium text-slate-400 mt-1">
            (Cuántas de las cotizaciones terminan en ventas)
          </span>
          
        </div>

        {/* Mitad 2: Reuniones */}
        <div className="flex-1 p-6 flex flex-col justify-center bg-slate-50/50">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2">
            Reuniones
          </h3>
          <div className="flex items-baseline justify-center gap-1.5">
            <span className="text-3xl font-extrabold text-[#485CC7]">
              {reuniones}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              este mes
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}