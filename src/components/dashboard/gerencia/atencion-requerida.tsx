"use client";

import { Info } from "lucide-react";
import { EjecutivoRiesgoResumenDTO, NivelRiesgo } from "@/types/api";
import { formatCompactCLP } from "@/utils/formatters";
import { useDashboardStore } from "@/store/use-dashboard-store";

interface AtencionRequeridaProps {
  ejecutivos: EjecutivoRiesgoResumenDTO[];
  className?: string;
}

// Helper para extraer las iniciales (Ej: "Michel Carvajal" -> "MC")
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

export function AtencionRequerida({ ejecutivos, className = "" }: AtencionRequeridaProps) {
  // Conectamos con Zustand para el futuro "Brushing & Linking" (Zoom semántico Nivel 2)
  const { setEjecutivoFocusId } = useDashboardStore();

  // Ordenamos para que los riesgos "Altos" y "Críticos" aparezcan primero
  const sortedEjecutivos = [...ejecutivos].sort((a, b) => {
    const ordenRiesgo: Record<NivelRiesgo, number> = {
      "Crítico": 1,
      "Alto": 2,
      "Medio": 3,
      "Bajo": 4,
      "No disponible": 5,
    };
    return ordenRiesgo[a.nivel_riesgo_comercial] - ordenRiesgo[b.nivel_riesgo_comercial];
  });

  return (
    <div className={`flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
      
      {/* CABECERA */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-slate-900">
            Atención Requerida (Riesgo Comercial)
          </h2>
          <span title="Clasificación basada en la probabilidad de llegar a la meta mensual." className="cursor-help flex items-center">
            <Info className="w-4 h-4 text-slate-400" />
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          ¿Qué ejecutivos necesitan ayuda para llegar a su meta?
        </p>
      </div>

      {/* LISTA DE EJECUTIVOS */}
      <div className="flex flex-col p-4 gap-3 max-h-[450px] overflow-y-auto">
        {sortedEjecutivos.map((ej) => {
          
          // Configuración condicional según el nivel de riesgo
          const isAlto = ej.nivel_riesgo_comercial === "Alto" || ej.nivel_riesgo_comercial === "Crítico";
          const isMedio = ej.nivel_riesgo_comercial === "Medio";
          const isBajo = ej.nivel_riesgo_comercial === "Bajo";

          const bgAvatar = isAlto ? "bg-red-500" : isMedio ? "bg-amber-500" : "bg-emerald-500";
          const badgeClass = isAlto 
            ? "bg-red-50 text-red-700 border-red-200" 
            : isMedio 
            ? "bg-amber-50 text-amber-700 border-amber-200"
            : "bg-emerald-50 text-emerald-700 border-emerald-200";

          return (
            <div 
              key={ej.id_ejecutivo}
              onClick={() => setEjecutivoFocusId(ej.id_ejecutivo)}
              className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer bg-white"
            >
              {/* Info del Ejecutivo y Semáforo */}
              <div className="flex items-center gap-4 mb-3 sm:mb-0">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ${bgAvatar}`}>
                  {getInitials(ej.nombre_completo)}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#485CC7] transition-colors">
                    {ej.nombre_completo}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider ${badgeClass}`}>
                      Riesgo {ej.nivel_riesgo_comercial}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      Prob: {ej.probabilidad_cumplimiento_pct || 0}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Métricas Financieras (Vendido vs Gap) */}
              <div className="flex flex-col sm:items-end">
                <div className="text-sm">
                  <span className="font-extrabold text-slate-900">
                    {formatCompactCLP(ej.ventas_acumuladas)}
                  </span>
                  <span className="text-slate-500 font-medium ml-1">vendido</span>
                </div>
                
                {isBajo ? (
                  <span className="text-xs font-bold text-emerald-600 mt-0.5">
                    Meta Asegurada
                  </span>
                ) : (
                  <span className="text-xs font-bold text-red-600 mt-0.5">
                    Faltarán {formatCompactCLP(ej.gap_proyectado_meta)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
    </div>
  );
}