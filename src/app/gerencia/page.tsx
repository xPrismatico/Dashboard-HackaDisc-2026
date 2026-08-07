import { FiltrosGlobales } from "@/components/dashboard/gerencia/filtros-globales";
import { HeroPredictivo } from "@/components/dashboard/gerencia/hero-predictivo";
import { TarjetasKpi } from "@/components/dashboard/gerencia/tarjetas-kpi";
import { TendenciaVentasChart } from "@/components/dashboard/gerencia/tendencia-ventas-chart";
import { AtencionRequerida } from "@/components/dashboard/gerencia/atencion-requerida";
import { Building2, LogOut } from "lucide-react";
import { EjecutivoRiesgoResumenDTO } from "@/types/api";
import { PlanificacionOperativa } from "@/components/dashboard/gerencia/planificacion-operativa";
import { ClienteRiesgoData, ClientesRiesgo } from "@/components/dashboard/gerencia/clientes-riesgo";
import Link from "next/link";

// --- MOCK DATA PARA EL GRÁFICO ---
const mockDias = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
const mockVentaReal = mockDias.map((d, i) => 
  i <= 16 ? Math.round(15_000_000 + (i * 6_500_000) + Math.random() * 5_000_000) : null
);
const ultimoReal = mockVentaReal[16] as number;
const mockProyeccion = mockDias.map((d, i) => 
  i >= 16 ? Math.round(ultimoReal + ((i - 16) * 4_000_000) + Math.random() * 2_000_000) : null
);
const mockMetaLineal = mockDias.map((d, i) => Math.round((200_000_000 / 30) * i));

const mockTendencia = {
  dias: mockDias,
  ventaReal: mockVentaReal,
  proyeccion: mockProyeccion,
  metaLineal: mockMetaLineal,
};

// --- MOCK DATA PARA EL HERO PREDICTIVO ---
const mockResumenGerencia = {
  ventas_acumuladas: ultimoReal,
  meta_mensual: 200_000_000,
  progreso_meta_pct: 62.5,
  forecast_cierre_mensual: mockProyeccion[30],
  probabilidad_cumplimiento_pct: 82,
  gap_proyectado_meta: 200_000_000 - (mockProyeccion[30] as number),
  tasa_exito_pct: 28,
};

// --- MOCK DATA PARA LA TABLA DE RIESGO COMERCIAL ---
const mockEjecutivos: EjecutivoRiesgoResumenDTO[] = [
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
];

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
            
           {/* ← NUEVO BOTÓN PARA SALIR / CAMBIAR ROL → */}
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

        {/* MÓDULO HERO PREDICTIVO */}
        <HeroPredictivo data={mockResumenGerencia} />

        {/* TARJETAS KPI RESUMEN */}
        <TarjetasKpi tasaExito={28} clientesNuevos={12} />

        {/* GRÁFICOS Y TABLAS (GRID 1: Tendencia y Atención) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-7">
            <TendenciaVentasChart data={mockTendencia} className="h-full" />
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

      </div>
    </main>
  );
}