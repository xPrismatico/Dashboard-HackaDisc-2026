"use client";

import { useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts"; // ← SOLUCIÓN: Importamos echarts para poder usar el LinearGradient
import { Info, Maximize2, X } from "lucide-react";
import { formatCLP, formatCompactCLP } from "@/utils/formatters";
import { AnimatePresence, motion } from "framer-motion";

// Interfaces para simular los datos que llegarían del backend
export interface TendenciaData {
  dias: string[];
  ventaReal: (number | null)[];
  proyeccion: (number | null)[];
  metaLineal: number[];
}

interface TendenciaVentasChartProps {
  data: TendenciaData;
  className?: string;
}

interface TooltipParam {
  axisValue: string;
  seriesName: string;
  value: number | null;
  color: string;
}

export function TendenciaVentasChart({ data, className = "" }: TendenciaVentasChartProps) {
    const [isExpanded, setIsExpanded] = useState(false);

  const getChartOption = (heightPx: string | number) => ({
      backgroundColor: "transparent",
      
      // TOOLTIP: Scented Tooltip con Zoom Semántico Nivel 1
      tooltip: {
        trigger: "axis",
        backgroundColor: "#ffffff",
        borderColor: "#e2e8f0", // border-slate-200
        borderWidth: 1,
        padding: 16,
        borderRadius: 8,
        textStyle: { fontFamily: "inherit", color: "#0f172a" },
        extraCssText: "box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);",
        formatter: (params: TooltipParam[]) => {
          if (!params || params.length === 0) return "";
          
          const day = params[0].axisValue;
          let html = `<div style="min-width: 220px; font-family: inherit;">`;
          html += `<div style="font-weight:700; font-size:14px; color:#475569; margin-bottom:12px; border-bottom:1px solid #e2e8f0; padding-bottom:6px;">Día ${day}</div>`;
          
          params.forEach((p) => {
            // Ignoramos valores nulos para no ensuciar el tooltip
            if (p.value == null) return; 

            html += `
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <span style="display:flex; align-items:center; gap:8px;">
                  <span style="display:block; width:10px; height:10px; border-radius:50%; background-color:${p.color}; box-shadow: 0 0 2px ${p.color};"></span>
                  <span style="color:#64748b; font-size:13px; font-weight:500;">${p.seriesName}:</span>
                </span>
                <span style="font-weight:800; font-size:14px; color:#0f172a;">${formatCLP(p.value)}</span>
              </div>
            `;
          });
          html += `</div>`;
          return html;
        },
      },
      
      // LEYENDA: Alineada abajo y clara
      legend: {
        bottom: 0,
        icon: "circle",
        itemGap: 24,
        textStyle: { color: "#64748b", fontWeight: 500, fontSize: 12 },
        data: ["Venta Real (Logrado)", "Proyección (Modelo)", "Meta Ideal Lineal"],
      },
      
      // GRID: Optimizando el Data-Ink Ratio
      grid: {
        top: 30,
        left: 10,
        right: 20,
        bottom: 40,
        containLabel: true,
      },
      
      xAxis: {
        type: "category",
        data: data.dias,
        name: "Días del mes actual",
        nameLocation: "middle",
        nameGap: 25,
        nameTextStyle: { color: "#94a3b8", fontSize: 11, fontWeight: 500 },
        boundaryGap: false,
        axisLine: { lineStyle: { color: "#cbd5e1" } }, // slate-300
        axisLabel: { 
          color: "#64748b", 
          fontSize: 11,
          interval: 1, // Muestra día por medio para no saturar si son 31 días
        },
        axisTick: { show: false },
        splitLine: { show: false },
      },
      
      yAxis: {
        type: "value",
        name: "Ingresos (CLP)",
        nameTextStyle: { color: "#94a3b8", fontSize: 11, fontWeight: 500, padding: [0, 0, 0, 30] },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: "#64748b",
          fontSize: 11,
          formatter: (val: number) => formatCompactCLP(val).replace(" CLP", ""), // Removemos "CLP" para ahorrar espacio en el eje
        },
        splitLine: { 
          lineStyle: { color: "#e2e8f0", type: "dashed" } // slate-200
        },
      },
      
      series: [
        {
          name: "Venta Real (Logrado)",
          type: "line",
          smooth: true,
          showSymbol: true,
          symbol: "circle",
          symbolSize: 6,
          data: data.ventaReal,
          lineStyle: { width: 3, color: "#485CC7" },
          itemStyle: { color: "#485CC7", borderColor: "#ffffff", borderWidth: 1.5 },
          z: 3, // Prioridad visual al frente
        },
        {
          name: "Proyección (Modelo)",
          type: "line",
          smooth: true,
          showSymbol: false, // Sin círculos para denotar inferencia
          data: data.proyeccion,
          lineStyle: { width: 3, color: "#00B8DE", type: "dashed" },
          itemStyle: { color: "#00B8DE" },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(0, 184, 222, 0.2)" },  // 20% alpha arriba
              { offset: 1, color: "rgba(0, 184, 222, 0.05)" }, // 5% alpha abajo
            ]),
          },
          z: 2,
        },
        {
          name: "Meta Ideal Lineal",
          type: "line",
          smooth: false,
          showSymbol: false,
          data: data.metaLineal,
          lineStyle: { width: 2, color: "#94a3b8", type: "dotted" },
          itemStyle: { color: "#94a3b8" },
          z: 1, // Al fondo
        },
      ],
    });

  const option = useMemo(() => getChartOption("350px"), [data]);
  const expandedOption = useMemo(() => getChartOption("70vh"), [data]);

 return (
    <>
      {/* VISTA NORMAL */}
      <div className={`flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8 ${className}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                Tendencia de Ventas: ¿Cómo vamos?
              </h2>
              <span title="Muestra el avance real vs la proyección del algoritmo ML." className="cursor-help flex items-center">
                <Info className="w-4 h-4 text-slate-400" />
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              Monitoreo del mes actual vs proyección predictiva.
            </p>
          </div>
          
          <button 
            onClick={() => setIsExpanded(true)}
            className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 transition-colors"
            title="Expandir gráfico"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        <div className="w-full mt-2">
          <ReactECharts 
            option={option} 
            style={{ height: "350px", width: "100%" }} 
            opts={{ renderer: "svg" }} 
          />
        </div>
      </div>

      {/* VISTA EXPANDIDA (MODAL PANTALLA COMPLETA CON DIFUMINADO) */}
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
                    Tendencia de Ventas: ¿Cómo vamos? (Vista Detallada)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Monitoreo ampliado del mes actual vs proyección predictiva.
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
                  option={expandedOption} 
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