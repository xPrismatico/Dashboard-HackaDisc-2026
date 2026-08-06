"use client";

import { useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import { Info, Maximize2, X } from "lucide-react";
import { OportunidadPipelineDTO } from "@/types/api";
import { formatCLP } from "@/utils/formatters";
import { AnimatePresence, motion } from "framer-motion";

interface PriorizacionScatterProps {
  oportunidades: OportunidadPipelineDTO[];
  className?: string;
}

export function PriorizacionScatter({ oportunidades, className = "" }: PriorizacionScatterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Conteos para los Badges Superiores
  const urgentes = oportunidades.filter(o => o.estado_alerta === "Urgente").length;
  const seguimiento = oportunidades.filter(o => o.estado_alerta === "Seguimiento").length;
  const sanas = oportunidades.filter(o => o.estado_alerta === "Sano").length;

  
  const getScatterOption = () => {
    // Mapeamos los datos al formato matricial de ECharts: 
    // [0: Probabilidad, 1: Días sin contacto, 2: Monto, 3: Razón Social, 4: Acción, 5: Estado, 6: ID Cotización]
    const scatterData = oportunidades.map(op => ({
      value: [
        op.probabilidad_cierre_pct,
        op.dias_sin_contacto,
        op.monto_ponderado,
        op.cliente,
        op.accion_sugerida,
        op.estado_alerta,
        op.codigo_cotizacion
      ],
      itemStyle: {
        // Colores en base al estado de alerta (Rojo, Amarillo, Verde Esmeralda)
        color: op.estado_alerta === "Urgente" ? "#f43f5e" : op.estado_alerta === "Seguimiento" ? "#f59e0b" : "#10b981",
        opacity: 0.85,
        borderColor: op.estado_alerta === "Urgente" ? "#be123c" : "transparent",
        borderWidth: op.estado_alerta === "Urgente" ? 1.5 : 0
      }
    }));

    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        backgroundColor: "#0f172a", // Fondo oscuro (slate-900)
        borderColor: "#334155",
        borderWidth: 1,
        padding: 16,
        borderRadius: 8,
        textStyle: { color: "#f8fafc", fontFamily: "inherit" },
        extraCssText: "box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);",
        formatter: (params: any) => {
          const [prob, dias, monto, cliente, accion, , codigo] = params.data.value;
          
          return `
            <div style="min-width: 240px; font-family: inherit;">
              <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid #334155; padding-bottom: 8px; margin-bottom: 12px;">
                <h3 style="font-weight: 800; font-size: 15px; color: #ffffff; margin: 0;">${cliente}</h3>
                <span style="font-size: 10px; color: #94a3b8; font-weight: 600;">(${codigo})</span>
              </div>
              
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #cbd5e1; font-size: 12px;">Monto:</span>
                  <span style="font-weight: 800; color: #38bdf8; font-size: 13px;">${formatCLP(monto)}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #cbd5e1; font-size: 12px;">Probabilidad:</span>
                  <span style="font-weight: 700; color: #ffffff; font-size: 13px;">${prob}%</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #cbd5e1; font-size: 12px;">Sin contacto:</span>
                  <span style="font-weight: 700; color: #ffffff; font-size: 13px;">${dias} días</span>
                </div>
              </div>

              <div style="margin-top: 14px; padding: 8px 10px; background-color: #1e293b; border-radius: 6px; border: 1px solid #334155;">
                <span style="display: block; font-size: 10px; color: #94a3b8; text-transform: uppercase; font-weight: 700; margin-bottom: 2px;">Acción Sugerida</span>
                <span style="color: #f8fafc; font-size: 12px; font-weight: 500;">${accion}</span>
              </div>
            </div>
          `;
        }
      },
      grid: {
        top: 30,
        left: 20,
        right: 30,
        bottom: 40,
        containLabel: true
      },
      xAxis: {
        type: "value",
        name: "Probabilidad de Cierre (%)",
        nameLocation: "middle",
        nameGap: 30,
        nameTextStyle: { color: "#64748b", fontSize: 11, fontWeight: 600 },
        min: 0,
        max: 100,
        axisLine: { lineStyle: { color: "#cbd5e1" } },
        axisLabel: { color: "#94a3b8", fontSize: 11 },
        splitLine: { show: false }
      },
      yAxis: {
        type: "value",
        name: "Días Sin Contacto",
        nameTextStyle: { color: "#64748b", fontSize: 11, fontWeight: 600, padding: [0, 0, 0, 30] },
        min: 0,
        // Limita el eje Y a 20 o al máximo valor + un padding visual
        max: (value: { max: number }) => Math.max(20, Math.ceil(value.max / 5) * 5),
        axisLine: { lineStyle: { color: "#cbd5e1" } },
        axisLabel: { color: "#94a3b8", fontSize: 11 },
        splitLine: { lineStyle: { color: "#f1f5f9", type: "dashed" } } // slate-100
      },
      series: [
        {
          type: "scatter",
          data: scatterData,
          // Función dinámica de tamaño (Área 2D) en base al volumen monetario
          symbolSize: (data: any[]) => {
            const monto = data[2] || 0;
            // Ecuación para escalar burbujas (min 15px, max 60px)
            return Math.max(15, Math.min(60, Math.sqrt(monto / 15000)));
          },
          emphasis: {
            focus: "self",
            itemStyle: {
              shadowBlur: 10,
              shadowColor: "rgba(0,0,0,0.3)"
            }
          }
        }
      ]
    };
  };

  const option = useMemo(() => getScatterOption(), [oportunidades]);

 return (
    <>
      {/* VISTA NORMAL */}
      <div className={`flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 lg:p-8 ${className}`}>
        
        {/* CABECERA Y BADGES */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-2">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  Priorización de Oportunidades (Clientes)
                </h2>
                <span title="Mapea tus cotizaciones activas. Las burbujas grandes arriba a la izquierda son tu mayor riesgo." className="cursor-help flex items-center">
                  <Info className="w-4 h-4 text-slate-400" />
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              ¿A qué cliente deberías llamar primero hoy? Pasa el mouse sobre las burbujas para ver detalles.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* CONTADORES (Scented Widgets Simplificados) */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex flex-col items-center justify-center px-3 py-1 bg-red-50 border border-red-100 rounded-lg min-w-[70px]">
                <span className="text-[9px] font-bold text-red-600 uppercase tracking-wider">Urgentes</span>
                <span className="text-lg font-black text-red-700 leading-none mt-0.5">{urgentes}</span>
              </div>
              <div className="flex flex-col items-center justify-center px-3 py-1 bg-amber-50 border border-amber-100 rounded-lg min-w-[70px]">
                <span className="text-[9px] font-bold text-amber-600 uppercase tracking-wider">Seguimiento</span>
                <span className="text-lg font-black text-amber-700 leading-none mt-0.5">{seguimiento}</span>
              </div>
              <div className="flex flex-col items-center justify-center px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-lg min-w-[70px]">
                <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Sanas</span>
                <span className="text-lg font-black text-emerald-700 leading-none mt-0.5">{sanas}</span>
              </div>
            </div>

            {/* BOTÓN EXPANDIR */}
            <button 
              onClick={() => setIsExpanded(true)}
              className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 transition-colors"
              title="Expandir gráfico"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* LEYENDA INFERIOR */}
        <div className="text-center mt-2">
          <span className="text-xs italic text-slate-400 font-medium">
            Tamaño de la burbuja = Monto Ponderado de la Cotización ($)
          </span>
        </div>

        {/* GRÁFICO ECHARTS */}
        <div className="w-full mt-4" style={{ height: "380px" }}>
          <ReactECharts 
            option={option} 
            style={{ height: "100%", width: "100%" }} 
            opts={{ renderer: "svg" }} 
          />
        </div>

      </div>

      {/* VISTA EXPANDIDA (MODAL PANTALLA COMPLETA CON FONDO DIFUMINADO) */}
      <AnimatePresence>
        {isExpanded && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative flex flex-col h-[85vh] w-[95vw] max-w-7xl bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 lg:p-8 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Priorización de Oportunidades (Clientes) - Vista Detallada
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Análisis ampliado del pipeline de cotizaciones B2B: Priorización de Oportunidades (Clientes) ¿A qué cliente deberías llamar primero hoy? Pasa el mouse sobre las burbujas para ver detalles.
                  </p>
                </div>
                
                <button
                  onClick={() => setIsExpanded(false)}
                  className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                  title="Cerrar vista maximizada"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 w-full flex items-center justify-center">
                <ReactECharts 
                  option={option} 
                  style={{ height: "100%", width: "100%" }} 
                  opts={{ renderer: "svg" }} 
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}