"use client";

import { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts"; // ← SOLUCIÓN: Importamos echarts para poder usar el LinearGradient
import { Info } from "lucide-react";
import { formatCLP, formatCompactCLP } from "@/utils/formatters";

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

export function TendenciaVentasChart({ data, className = "" }: TendenciaVentasChartProps) {
  
  const option = useMemo(() => {
    return {
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
        formatter: (params: any[]) => {
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
    };
  }, [data]);

  return (
    <div className={`flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8 ${className}`}>
      
      {/* CABECERA DEL GRÁFICO */}
      <div className="flex flex-col mb-4">
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

      {/* CONTENEDOR ECHARTS */}
      <div className="w-full flex-1 min-h-[350px]">
        <ReactECharts 
          option={option}
          style={{ height: "350px", width: "100%" }} 
          opts={{ renderer: "svg" }} 
        />
      </div>
      
    </div>
  );
}