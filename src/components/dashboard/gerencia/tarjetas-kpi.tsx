"use client";

import { CheckCircle2, Users, Info } from "lucide-react";

interface TarjetasKpiProps {
  tasaExito: number;
  clientesNuevos: number;
  className?: string;
}

export function TarjetasKpi({ tasaExito, clientesNuevos, className = "" }: TarjetasKpiProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${className}`}>
      
      {/* TARJETA 1: Tasa de Éxito de Cotizaciones */}
      <div className="flex items-center gap-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 transition-shadow hover:shadow-md">
        {/* Ícono Decorativo */}
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 shrink-0">
          <CheckCircle2 className="w-6 h-6 text-emerald-500" strokeWidth={2.5} />
        </div>
        
        {/* Datos */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 mb-1">
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Tasa de Éxito de Cotizaciones
            </h3>
            <span title="Porcentaje de cotizaciones R13 que se convirtieron en ventas reales (K-COM-7)." className="cursor-help flex items-center">
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {tasaExito}%
            </span>
            <span className="text-sm font-medium text-slate-500">
              promedio del equipo
            </span>
          </div>
        </div>
      </div>

      {/* TARJETA 2: Clientes Nuevos Captados */}
      <div className="flex items-center gap-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 transition-shadow hover:shadow-md">
        {/* Ícono Decorativo */}
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 border border-blue-100 shrink-0">
          <Users className="w-6 h-6 text-[#485CC7]" strokeWidth={2.5} />
        </div>
        
        {/* Datos */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 mb-1">
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Clientes Nuevos Captados
            </h3>
            <span title="Empresas que compraron por primera vez en la historia de INSECAP (K-COM-3)." className="cursor-help flex items-center">
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {clientesNuevos}
            </span>
            <span className="text-sm font-medium text-slate-500">
              empresas este mes
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}