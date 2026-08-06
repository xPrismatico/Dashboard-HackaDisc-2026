"use client";

import { useDashboardStore, Sucursal, Modalidad, Financiamiento } from "@/store/use-dashboard-store";
import { Filter, Calendar, MapPin, MonitorPlay, Briefcase, Users } from "lucide-react";

export function FiltrosGlobales() {
  const { 
    sucursal, periodoAnio, periodoMes, modalidad, financiamiento, soloActivos, 
    setFiltro 
  } = useDashboardStore();

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return (
    <div className="flex flex-col gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm md:flex-row md:items-center md:flex-wrap">
      
      <div className="flex items-center gap-2 mr-4 text-sm font-bold text-slate-800 uppercase tracking-wide">
        <Filter className="w-4 h-4 text-[#485CC7]" />
        Filtros
      </div>

      {/* SUCURSAL */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
          <MapPin className="w-3 h-3" /> Sucursal
        </label>
        <select
          value={sucursal}
          onChange={(e) => setFiltro("sucursal", e.target.value as Sucursal)}
          className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-[#485CC7] focus:border-[#485CC7] block w-full p-2 outline-none transition-colors cursor-pointer hover:bg-slate-100"
        >
          <option value="Todas">Todas</option>
          <option value="Calama">Casa Matriz - Calama</option>
          <option value="Antofagasta">Antofagasta</option>
          <option value="Santiago">Santiago</option>
        </select>
      </div>

      {/* PERÍODO (MES) */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
          <Calendar className="w-3 h-3" /> Período
        </label>
        <div className="flex gap-2">
          <select
            value={periodoMes}
            onChange={(e) => setFiltro("periodoMes", Number(e.target.value))}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-[#485CC7] focus:border-[#485CC7] block w-32 p-2 outline-none transition-colors cursor-pointer hover:bg-slate-100"
          >
            {meses.map((mes, index) => (
              <option key={mes} value={index + 1}>{mes}</option>
            ))}
          </select>
          <select
            value={periodoAnio}
            onChange={(e) => setFiltro("periodoAnio", Number(e.target.value))}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-[#485CC7] focus:border-[#485CC7] block w-24 p-2 outline-none transition-colors cursor-pointer hover:bg-slate-100"
          >
            {[2023, 2024, 2025, 2026].map((anio) => (
              <option key={anio} value={anio}>{anio}</option>
            ))}
          </select>
        </div>
      </div>

      {/* MODALIDAD */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
          <MonitorPlay className="w-3 h-3" /> Modalidad
        </label>
        <select
          value={modalidad}
          onChange={(e) => setFiltro("modalidad", e.target.value as Modalidad)}
          className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-[#485CC7] focus:border-[#485CC7] block w-full p-2 outline-none transition-colors cursor-pointer hover:bg-slate-100"
        >
          <option value="Todas">Todas</option>
          <option value="Elearning Asincrono">E-Learning Asincrónico</option>
          <option value="Elearning Sincrono">E-Learning Sincrónico</option>
          <option value="Presencial">Presencial</option>
          <option value="Blend">Blend (Mixto)</option>
        </select>
      </div>

      {/* FINANCIAMIENTO */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
          <Briefcase className="w-3 h-3" /> Financiamiento
        </label>
        <select
          value={financiamiento}
          onChange={(e) => setFiltro("financiamiento", e.target.value as Financiamiento)}
          className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-[#485CC7] focus:border-[#485CC7] block w-full p-2 outline-none transition-colors cursor-pointer hover:bg-slate-100"
        >
          <option value="Todos">Todos</option>
          <option value="Sence">Franquicia SENCE</option>
          <option value="Costo Empresa">Costo Empresa</option>
        </select>
      </div>

      {/* CHECKBOX: SOLO ACTIVOS */}
      <div className="flex items-center ml-auto mt-2 md:mt-0 pl-4 border-l border-slate-200">
        <label className="flex items-center cursor-pointer group">
          <div className="relative">
            <input 
              type="checkbox" 
              checked={soloActivos}
              onChange={(e) => setFiltro("soloActivos", e.target.checked)}
              className="sr-only" 
            />
            <div className={`block w-10 h-6 rounded-full transition-colors ${soloActivos ? "bg-[#485CC7]" : "bg-slate-300"}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${soloActivos ? "transform translate-x-4" : ""}`}></div>
          </div>
          <div className="ml-3 flex flex-col">
            <span className="text-sm font-semibold text-slate-700 flex items-center gap-1">
              <Users className="w-4 h-4 text-slate-400" />
              Solo Ejecutivos Activos
            </span>
            <span className="text-[10px] text-slate-400 leading-tight">Evita distorsión por rotación histórica</span>
          </div>
        </label>
      </div>

    </div>
  );
}