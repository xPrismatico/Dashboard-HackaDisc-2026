"use client";

import { Clock, Info } from "lucide-react";
import { OportunidadPipelineDTO } from "@/types/api";
import { formatCLP } from "@/utils/formatters";

interface MiPipelineActivoProps {
  oportunidades: OportunidadPipelineDTO[];
  className?: string;
}

export function MiPipelineActivo({ oportunidades, className = "" }: MiPipelineActivoProps) {
  // Ordenamos de mayor a menor según el Valor Ponderado
  const sortedOportunidades = [...oportunidades].sort((a, b) => b.monto_ponderado - a.monto_ponderado);

  return (
    <div className={`flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
      
      {/* CABECERA */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-lg font-bold text-slate-900">
            Mi Monto Bruto y Tareas Diarias
          </h2>
          <span title="Lista de cotizaciones en negociación. Atiende primero a los clientes de la parte superior." className="cursor-help flex items-center">
            <Info className="w-4 h-4 text-slate-400" />
          </span>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          Cotizaciones B2B en negociación. Enfócate primero en los clientes con mayor Valor Ponderado (Valor $ realista de todas las cotizaciones actuales que se están negociando que tienen oportunidad).
        </p>
        <span className="inline-flex px-3 py-1 bg-blue-50 text-[#485CC7] text-xs font-bold rounded-md border border-blue-100">
          Ordenado por ($) Valor Ponderado (Monto bruto × Probabilidad de conversión)
        </span>
      </div>

      {/* LISTA DE TARJETAS (Bar-in-Table concept) */}
      <div className="flex flex-col p-6 gap-4 bg-slate-50/50">
        {sortedOportunidades.map((op) => {
          // Lógica de Alertas
          const isMargenPeligroso = op.margen_operacional_pct < 10;
          const isTiempoPeligroso = op.dias_sin_contacto > 10;

          return (
            <div 
              key={op.id_cotizacion}
              className="flex flex-col lg:flex-row lg:items-center justify-between p-5 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-[#485CC7]/40 hover:shadow-md transition-all gap-4"
            >
              
              {/* Bloque 1: Cliente y Cotización */}
              <div className="flex flex-col lg:w-1/4">
                <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                  {op.cliente}
                </h3>
                <span className="text-xs font-medium text-slate-500 mt-1">
                  Cotización: {op.codigo_cotizacion}
                </span>
              </div>

              {/* Bloque 2: Valor Ponderado y Detalles Financieros */}
              <div className="flex flex-row items-center gap-4 lg:w-2/4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Valor Ponderado
                  </span>
                  <span className="text-xl font-black text-[#485CC7]">
                    {formatCLP(op.monto_ponderado)}
                  </span>
                </div>
                
                <div className="flex flex-col gap-1.5 ml-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="bg-slate-400 h-full" style={{ width: `${op.probabilidad_cierre_pct}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">{op.probabilidad_cierre_pct}% prob.</span>
                  </div>
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold border w-max ${
                    isMargenPeligroso ? "bg-red-50 text-red-600 border-red-200" : "bg-slate-50 text-slate-500 border-slate-200"
                  }`}>
                    Margen Operacional: {op.margen_operacional_pct}%
                  </span>
                </div>
              </div>

              {/* Bloque 3: Estado (Días) */}
              <div className="flex flex-col lg:w-1/6">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                  Estado
                </span>
                <div className={`flex items-center gap-1.5 text-sm font-bold ${isTiempoPeligroso ? "text-red-600" : "text-emerald-600"}`}>
                  <Clock className="w-4 h-4" />
                  {op.dias_sin_contacto} días sin contacto
                </div>
              </div>

              {/* Bloque 4: Acción Sugerida (Botón) */}
              <div className="flex flex-col lg:w-1/4 lg:items-end mt-2 lg:mt-0">
                <span className="text-[10px] font-bold text-slate-800 mb-1">
                  Acción Hoy:
                </span>
                <button className="w-full lg:w-auto text-xs font-semibold text-[#485CC7] bg-blue-50 hover:bg-[#485CC7] hover:text-white border border-blue-200 transition-colors rounded-lg px-4 py-2.5 text-center">
                  {op.accion_sugerida}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}