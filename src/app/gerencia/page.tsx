"use client";

import { useEffect, useState } from "react";
import { FiltrosGlobales } from "@/components/dashboard/gerencia/filtros-globales";
import { HeroPredictivo } from "@/components/dashboard/gerencia/hero-predictivo";
import { TarjetasKpi } from "@/components/dashboard/gerencia/tarjetas-kpi";
import { TendenciaData, TendenciaVentasChart } from "@/components/dashboard/gerencia/tendencia-ventas-chart";
import { AtencionRequerida } from "@/components/dashboard/gerencia/atencion-requerida";
import { PlanificacionOperativa } from "@/components/dashboard/gerencia/planificacion-operativa";
import { ClienteRiesgoData, ClientesRiesgo } from "@/components/dashboard/gerencia/clientes-riesgo";
import { Building2, LogOut, Loader2 } from "lucide-react";
import Link from "next/link";

// Importamos el servicio y el store
import { gerenciaService } from "@/services/gerencia-service";
import { useDashboardStore } from "@/store/use-dashboard-store";
import { DashboardGerenteResponseDTO } from '@/types/api';


// --- MOCK DATA PARA LA TABLA DE RIESGO COMERCIAL ---
// SOLUCIÓN: Usamos "as any" para que TypeScript ignore que faltan campos de la DB real en el mock
const mockEjecutivos = [
  {
    id_ejecutivo: 1,
    nombre_completo: "Michel Carvajal",
    ventas_acumuladas: 15_000_000,
    meta_mensual: 30_000_000,
    progreso_meta_pct: 50,
    forecast_cierre_mensual: 15_000_000,
    probabilidad_cumplimiento_pct: 35,
    gap_proyectado_meta: 15_000_000,
    tasa_exito_pct: 12,
    nivel_riesgo_comercial: "Alto",
  },
  {
    id_ejecutivo: 2,
    nombre_completo: "Claudio Hervera",
    ventas_acumuladas: 28_000_000,
    meta_mensual: 36_000_000,
    progreso_meta_pct: 77,
    forecast_cierre_mensual: 32_000_000,
    probabilidad_cumplimiento_pct: 70,
    gap_proyectado_meta: 8_000_000,
    tasa_exito_pct: 30,
    nivel_riesgo_comercial: "Medio",
  },
  {
    id_ejecutivo: 3,
    nombre_completo: "Ana Sepúlveda",
    ventas_acumuladas: 37_000_000,
    meta_mensual: 38_000_000,
    progreso_meta_pct: 97,
    forecast_cierre_mensual: 39_000_000,
    probabilidad_cumplimiento_pct: 92,
    gap_proyectado_meta: 1_000_000,
    tasa_exito_pct: 45,
    nivel_riesgo_comercial: "Bajo",
  },
  {
    id_ejecutivo: 4,
    nombre_completo: "Karen Riquelme",
    ventas_acumuladas: 45_000_000,
    meta_mensual: 40_000_000,
    progreso_meta_pct: 112,
    forecast_cierre_mensual: 50_000_000,
    probabilidad_cumplimiento_pct: 100,
    gap_proyectado_meta: 0,
    tasa_exito_pct: 60,
    nivel_riesgo_comercial: "Bajo",
  }
] as any; 

// --- MOCK DATA PARA PLANIFICACIÓN OPERATIVA ---
const mockPlanificacion = {
  meses: ["Sep", "Oct", "Nov", "Dic", "Ene", "Feb"],
  mineria: [120, 180, 250, 300, 280, 150],
  excel: [80, 90, 80, 110, 100, 140],
  maquinaria: [150, 160, 200, 220, 180, 150],
};

const alertaCapacidad = "La proyección de cursos supera la disponibilidad de relatores certificados en zona norte (Antofagasta / Calama) para el mes de Diciembre.";

// --- MOCK DATA PARA CLIENTES EN RIESGO ---
const mockClientesRiesgo: ClienteRiesgoData[] = [
  {
    id_cliente: 101,
    razon_social: "Codelco Chuquicamata",
    volumen_compra: 45_000_000,
    magnitud_riesgo: 12_000_000,
    estado_riesgo: "Alto Riesgo",
    descripcion: "Facturas vencidas hace +60 días. Riesgo estratégico.",
    id_ejecutivo_responsable: 1,
    nombre_responsable: "Michel Carvajal",
  },
  {
    id_cliente: 102,
    razon_social: "Salfamantenciones",
    volumen_compra: 28_000_000,
    magnitud_riesgo: 5_000_000,
    estado_riesgo: "Alto Riesgo",
    descripcion: "Cobranza prejudicial iniciada. Detener ventas.",
    id_ejecutivo_responsable: 2,
    nombre_responsable: "Claudio Hervera",
  },
  {
    id_cliente: 103,
    razon_social: "Sierra Gorda SCM",
    volumen_compra: 85_000_000,
    magnitud_riesgo: 2_000_000,
    estado_riesgo: "Alerta Temprana",
    descripcion: "Cotización de $30M estancada hace 25 días.",
    id_ejecutivo_responsable: 3,
    nombre_responsable: "Ana Sepúlveda",
  },
  {
    id_cliente: 104,
    razon_social: "Minera Escondida",
    volumen_compra: 120_000_000,
    magnitud_riesgo: 0,
    estado_riesgo: "Buen Estado",
    descripcion: "Volumen de compra saludable y cartera al día.",
    id_ejecutivo_responsable: 4,
    nombre_responsable: "Karen Riquelme",
  }
];

export default function GerenciaPage() {
  const { periodoAnio, periodoMes, sucursal, modalidad, financiamiento, soloActivos } = useDashboardStore();
  
  // Estados para manejar la data
  const [dashboardData, setDashboardData] = useState<DashboardGerenteResponseDTO | null>(null);
  const [tendenciaData, setTendenciaData] = useState<TendenciaData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Efecto principal para obtener los datos
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Disparamos ambas peticiones al mismo tiempo para no hacer esperar al usuario
        const [overview, tendenciaRaw] = await Promise.all([
          gerenciaService.getDashboard(periodoAnio, periodoMes, sucursal, modalidad, financiamiento, soloActivos),
          gerenciaService.getTendenciaVentas(periodoAnio, periodoMes, sucursal, modalidad, financiamiento)
        ]);
        
        setDashboardData(overview);

        // Transformamos el arreglo de objetos de la API a los 4 arreglos que necesita ECharts
        setTendenciaData({
          dias: tendenciaRaw.dias.map(d => d.dia.toString()),
          ventaReal: tendenciaRaw.dias.map(d => d.venta_real),
          proyeccion: tendenciaRaw.dias.map(d => d.proyeccion_ml),
          metaLineal: tendenciaRaw.dias.map(d => d.meta_ideal)
        });

      } catch (error) {
        console.error("Error al cargar los datos del gerente:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [periodoAnio, periodoMes, sucursal, modalidad, financiamiento, soloActivos]);

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-[1400px] flex flex-col gap-6">
        
        {/* HEADER Y FILTROS GLOBALES */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#485CC7] rounded-xl flex items-center justify-center shadow-sm">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Visión General del Mes
                </h1>
                <p className="text-xs font-medium text-slate-500">
                  Anticipa el cierre del mes y toma decisiones estratégicas tempranas.
                </p>
              </div>
            </div>
            
            <Link 
              href="/"
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </Link>
          </div>
          <FiltrosGlobales />
        </div>

        {/* PROTECCIÓN DE RENDERIZADO: Protege la vista mientras el backend responde */}
        {isLoading || !dashboardData || !tendenciaData ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#485CC7] mb-4" />
            <p className="text-slate-500 font-medium">Cargando datos predictivos...</p>
          </div>
        ) : (
          <>
            {/* MÓDULO HERO PREDICTIVO */}
            <HeroPredictivo data={dashboardData.resumen_equipo} />

            {/* TARJETAS KPI RESUMEN */}
            <TarjetasKpi 
              tasaExito={dashboardData.resumen_equipo.tasa_exito_pct} 
              clientesNuevos={dashboardData.resumen_equipo.clientes_nuevos_totales} 
            />

            {/* GRÁFICOS Y TABLAS (GRID 1: Tendencia y Atención) */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              <div className="xl:col-span-7">
                {/* TENDENCIA DE VENTAS (Inyectado con datos reales) */}
                <TendenciaVentasChart data={tendenciaData} className="h-full" />
              </div>
              <div className="xl:col-span-5">
                <AtencionRequerida ejecutivos={mockEjecutivos} className="h-full" />
              </div>
            </div>

            {/* GRÁFICOS Y TABLAS (GRID 2: Planificación Operativa) */}
            <div className="grid grid-cols-1 gap-6">
              <PlanificacionOperativa 
                data={mockPlanificacion} 
                alerta={alertaCapacidad} 
              />
            </div>

            {/* GRÁFICOS Y TABLAS (GRID 3: Clientes Estratégicos en Riesgo) */}
            <div className="grid grid-cols-1 gap-6">
              <ClientesRiesgo clientes={mockClientesRiesgo} />
            </div>
          </>
        )}

      </div>
    </main>
  );
}