"use client";

import { AlertCircle, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { formatCLP } from "@/utils/formatters";
import { useDashboardStore } from "@/store/use-dashboard-store";

// Definimos la interfaz localmente para los datos de la tabla
export interface ClienteRiesgoData {
  id_cliente: number;
  razon_social: string;
  volumen_compra: number;
  magnitud_riesgo: number;
  estado_riesgo: "Alto Riesgo" | "Alerta Temprana" | "Buen Estado";
  descripcion: string;
  id_ejecutivo_responsable: number;
  nombre_responsable: string;
}

interface ClientesRiesgoProps {
  clientes: ClienteRiesgoData[];
  className?: string;
}

export function ClientesRiesgo({ clientes, className = "" }: ClientesRiesgoProps) {
  // Conectamos con Zustand para el Brushing & Linking y el Drill-down
  const { setEjecutivoFocusId, setClienteFocusId } = useDashboardStore();

  // Encontramos el valor máximo para escalar todas las barras proporcionalmente
  const maxVolumen = Math.max(...clientes.map((c) => c.volumen_compra), 1);

  // Conteo para los badges de la cabecera
  const countAlto = clientes.filter(c => c.estado_riesgo === "Alto Riesgo").length;
  const countAlerta = clientes.filter(c => c.estado_riesgo === "Alerta Temprana").length;
  const countSano = clientes.filter(c => c.estado_riesgo === "Buen Estado").length;

  return (
    <div className={`flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
      
      {/* CABECERA */}
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              Clientes Estratégicos en Riesgo
            </h2>
            <span title="Detecta qué clientes importantes representan un riesgo de cobranza y qué ejecutivo es responsable. Haz clic para ver el Estado de Cuenta B2B." className="cursor-help flex items-center">
              <Info className="w-4 h-4 text-slate-400" />
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Detecta qué clientes importantes representan un riesgo y qué ejecutivo es responsable. Haz clic para ver el Estado de Cuenta B2B.
          </p>
        </div>

        {/* BADGES DE RESUMEN */}
        <div className="flex items-center gap-2">
          {countAlto > 0 && (
            <span className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-md text-[10px] font-bold uppercase tracking-wider">
              Alto Riesgo: {countAlto}
            </span>
          )}
          {countAlerta > 0 && (
            <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[10px] font-bold uppercase tracking-wider">
              Alertas: {countAlerta}
            </span>
          )}
          {countSano > 0 && (
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-bold uppercase tracking-wider">
              Sanos: {countSano}
            </span>
          )}
        </div>
      </div>

      {/* LISTA DE CLIENTES */}
      <div className="flex flex-col p-6 gap-4">
        {clientes.map((cliente) => {
          const isAlto = cliente.estado_riesgo === "Alto Riesgo";
          const isAlerta = cliente.estado_riesgo === "Alerta Temprana";

          // Proporciones para las barras
          const pctVolumen = (cliente.volumen_compra / maxVolumen) * 100;
          const pctRiesgo = (cliente.magnitud_riesgo / maxVolumen) * 100;

          // Colores dinámicos
          const Icono = isAlto ? AlertCircle : isAlerta ? AlertTriangle : CheckCircle2;
          const colorIcono = isAlto ? "text-red-500" : isAlerta ? "text-amber-500" : "text-emerald-500";
          const bgBadge = isAlto ? "bg-red-50 text-red-700 border-red-200" : isAlerta ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200";
          const colorBarraRiesgo = isAlto ? "bg-[#e11d48]" : isAlerta ? "bg-[#f59e0b]" : "bg-transparent";

          return (
            <div 
              key={cliente.id_cliente}
              // Interacciones: Hover para el Ejecutivo, Clic para el Modal del Cliente
              onMouseEnter={() => setEjecutivoFocusId(cliente.id_ejecutivo_responsable)}
              onMouseLeave={() => setEjecutivoFocusId(null)}
              onClick={() => setClienteFocusId(cliente.id_cliente)}
              className="group flex flex-col xl:flex-row justify-between p-5 rounded-xl border border-slate-200 hover:border-[#485CC7]/40 hover:shadow-md transition-all cursor-pointer bg-white gap-6"
            >
              {/* IZQUIERDA: Info del Cliente */}
              <div className="flex gap-4 xl:w-5/12">
                <Icono className={`w-5 h-5 shrink-0 mt-0.5 ${colorIcono}`} />
                <div className="flex flex-col">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#485CC7] transition-colors">
                    {cliente.razon_social}
                  </h3>
                  <div className="mt-1.5 mb-2">
                    <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider ${bgBadge}`}>
                      {cliente.estado_riesgo}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-2">
                    {cliente.descripcion}
                  </p>
                  <p className="text-xs font-medium text-slate-600">
                    Responsable: <strong className="text-[#485CC7] group-hover:underline">{cliente.nombre_responsable}</strong>
                  </p>
                </div>
              </div>

              {/* DERECHA: Barras Paralelas */}
              <div className="flex flex-col justify-center gap-4 xl:w-7/12">
                
                {/* Barra Volumen */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      Volumen de Compra
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">
                      {formatCLP(cliente.volumen_compra)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-slate-400 h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${pctVolumen}%` }} />
                  </div>
                </div>

                {/* Barra Riesgo */}
                {cliente.magnitud_riesgo > 0 && (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-end">
                      <span className={`text-[10px] font-bold uppercase tracking-wide ${isAlto ? "text-red-600" : "text-amber-600"}`}>
                        Magnitud del Riesgo ($)
                      </span>
                      <span className={`text-sm font-extrabold ${isAlto ? "text-red-600" : "text-amber-600"}`}>
                        {formatCLP(cliente.magnitud_riesgo)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-700 ease-out ${colorBarraRiesgo}`} style={{ width: `${pctRiesgo}%` }} />
                    </div>
                  </div>
                )}
                
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}