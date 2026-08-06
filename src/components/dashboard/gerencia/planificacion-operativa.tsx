"use client";

import { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { AlertCircle, Info } from "lucide-react";

interface PlanificacionData {
  meses: string[];
  mineria: number[];
  excel: number[];
  maquinaria: number[];
}

interface PlanificacionOperativaProps {
  data: PlanificacionData;
  alerta?: string | null;
  className?: string;
}

export function PlanificacionOperativa({ data, alerta, className = "" }: PlanificacionOperativaProps) {
  
  const option = useMemo(() => {
    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" }, // Sombra al hacer hover sobre la columna
        backgroundColor: "#ffffff",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        padding: 16,
        borderRadius: 8,
        textStyle: { fontFamily: "inherit", color: "#0f172a" },
        extraCssText: "box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);",
        formatter: (params: any[]) => {
          if (!params || params.length === 0) return "";
          
          const mes = params[0].axisValue;
          let totalHoras = 0;
          let html = `<div style="min-width: 180px; font-family: inherit;">`;
          html += `<div style="font-weight:700; font-size:14px; color:#475569; margin-bottom:12px; border-bottom:1px solid #e2e8f0; padding-bottom:6px;">Mes: ${mes}</div>`;
          
          // Renderizamos cada segmento de la barra apilada
          params.forEach((p) => {
            totalHoras += p.value;
            html += `
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <span style="display:flex; align-items:center; gap:8px;">
                  <span style="display:block; width:10px; height:10px; border-radius:2px; background-color:${p.color};"></span>
                  <span style="color:#64748b; font-size:13px; font-weight:500;">${p.seriesName}:</span>
                </span>
                <span style="font-weight:800; font-size:14px; color:#0f172a;">${p.value} hrs</span>
              </div>
            `;
          });
          
          // Agregamos el total arriba de todo
          html += `
            <div style="margin-top:12px; border-top:1px dashed #cbd5e1; padding-top:8px; display:flex; justify-content:space-between; align-items:center;">
              <span style="color:#0f172a; font-size:13px; font-weight:700;">Total Requerido:</span>
              <span style="font-weight:900; font-size:15px; color:#485CC7;">${totalHoras} hrs</span>
            </div>
          </div>`;
          
          return html;
        },
      },
      legend: {
        bottom: 0,
        icon: "roundRect",
        itemGap: 24,
        textStyle: { color: "#64748b", fontWeight: 500, fontSize: 12 },
        data: ["Minería", "Excel", "Maquinaria"],
      },
      grid: {
        top: 30,
        left: 10,
        right: 10,
        bottom: 40,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: data.meses,
        axisLine: { lineStyle: { color: "#cbd5e1" } },
        axisLabel: { color: "#64748b", fontSize: 12, fontWeight: 500, margin: 16 },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        name: "Horas de Relatoría",
        nameTextStyle: { color: "#94a3b8", fontSize: 11, fontWeight: 500, padding: [0, 0, 0, 20] },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: "#64748b", fontSize: 11 },
        splitLine: { lineStyle: { color: "#e2e8f0" } },
      },
      series: [
        {
          name: "Minería",
          type: "bar",
          stack: "total", // La clave para apilar
          barMaxWidth: 60,
          data: data.mineria,
          itemStyle: { color: "#f59e0b" }, // Ámbar
        },
        {
          name: "Excel",
          type: "bar",
          stack: "total",
          barMaxWidth: 60,
          data: data.excel,
          itemStyle: { color: "#10b981" }, // Verde
        },
        {
          name: "Maquinaria",
          type: "bar",
          stack: "total",
          barMaxWidth: 60,
          data: data.maquinaria,
          itemStyle: { color: "#6366f1", borderRadius: [4, 4, 0, 0] }, // Índigo (Bordes redondeados arriba)
        },
      ],
    };
  }, [data]);

  return (
    <div className={`flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8 ${className}`}>
      
      {/* CABECERA */}
      <div className="flex flex-col mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-slate-900">
            Planificación Operativa y Capacidad
          </h2>
          <span title="Proyección de demanda de horas de relatores según cotizaciones activas a 6 meses." className="cursor-help flex items-center">
            <Info className="w-4 h-4 text-slate-400" />
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-0.5">
          Proyección de demanda de relatores según cotizaciones en pipeline.
        </p>
      </div>

      {/* ALERTA PRESCRIPTIVA (Opcional) */}
      {alerta && (
        <div className="flex items-start gap-3 bg-red-50 text-red-800 p-4 rounded-xl border border-red-100 mb-6">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-red-700 uppercase tracking-wide">
              Alerta de Capacidad
            </span>
            <span className="text-sm mt-0.5 leading-relaxed text-red-600/90">
              {alerta}
            </span>
          </div>
        </div>
      )}

      {/* GRÁFICO ECHARTS */}
      <div className="w-full flex-1 min-h-[320px]">
        <ReactECharts 
          option={option} 
          style={{ height: "320px", width: "100%" }} 
          opts={{ renderer: "svg" }} 
        />
      </div>
      
    </div>
  );
}