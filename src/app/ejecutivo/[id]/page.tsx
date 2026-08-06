import Link from "next/link";
import { Info, LogOut, UserCircle } from "lucide-react";

// Importamos los componentes que creamos para el Ejecutivo
import { FiltrosGlobales } from "@/components/dashboard/gerencia/filtros-globales"; // Reutilizamos la barra de filtros
import { ProgresoPersonal } from "@/components/dashboard/ejecutivo/progreso-personal";
import { MetricasSecundarias } from "@/components/dashboard/ejecutivo/metricas-secundarias";
import { PriorizacionScatter } from "@/components/dashboard/ejecutivo/priorizacion-scatter";
import { MiPipelineActivo } from "@/components/dashboard/ejecutivo/mi-pipeline-activo";

import { DashboardEjecutivoResponseDTO, OportunidadPipelineDTO } from "@/types/api";

// --- MOCK DATA: RESPUESTA DEL BACKEND PARA MICHEL CARVAJAL ---
const mockDashboardEjecutivo: DashboardEjecutivoResponseDTO = {
  id_ejecutivo: 1,
  nombre_completo: "Michel Carvajal",
  periodo_anio: 2026,
  periodo_mes: 8,
  fecha_corte: "2026-08-15",
  ventas_acumuladas: 15_000_000,
  meta_mensual: 35_000_000,
  progreso_meta_pct: 42.9,
  monto_faltante_actual: 20_000_000,
  indice_avance_esperado: null,
  forecast_cierre_mensual: 31_000_000,
  gap_proyectado_meta: 4_000_000,
  pipeline_ponderado: 35_400_000,
  tasa_exito_pct: 18,
  nivel_riesgo_comercial: "Alto",
  recomendacion_accion_comercial: "Tu ritmo de venta (Pacing) es menor a 1.0. Necesitas generar más reuniones con clientes con buenos montos esta semana para asegurar tu comisión de fin de mes."
};

// --- MOCK DATA: PIPELINE ACTIVO ---
const mockOportunidades: OportunidadPipelineDTO[] = [
  {
    id_cotizacion: 405,
    codigo_cotizacion: "R13-405",
    cliente: "Mantos Copper",
    monto_ponderado: 10_500_000,
    probabilidad_cierre_pct: 30,
    margen_operacional_pct: 10, // Límite de peligro
    dias_sin_contacto: 15,
    estado_alerta: "Urgente",
    accion_sugerida: "Urgente: Retomar contacto."
  },
  {
    id_cotizacion: 401,
    codigo_cotizacion: "R13-401",
    cliente: "BHP",
    monto_ponderado: 7_500_000,
    probabilidad_cierre_pct: 60,
    margen_operacional_pct: 15,
    dias_sin_contacto: 12,
    estado_alerta: "Seguimiento",
    accion_sugerida: "Llamar a Jefe de Turno para feedback."
  },
  {
    id_cotizacion: 406,
    codigo_cotizacion: "R13-406",
    cliente: "Essbio",
    monto_ponderado: 5_400_000,
    probabilidad_cierre_pct: 90,
    margen_operacional_pct: 22,
    dias_sin_contacto: 1,
    estado_alerta: "Sano",
    accion_sugerida: "Esperando envío de Orden de Compra."
  },
  {
    id_cotizacion: 402,
    codigo_cotizacion: "R13-402",
    cliente: "Codelco",
    monto_ponderado: 4_400_000,
    probabilidad_cierre_pct: 20,
    margen_operacional_pct: 5, // Peligroso (< 10%)
    dias_sin_contacto: 20,
    estado_alerta: "Urgente",
    accion_sugerida: "Reunión agendada para mañana."
  },
  {
    id_cotizacion: 404,
    codigo_cotizacion: "R13-404",
    cliente: "Sierra Gorda SCM",
    monto_ponderado: 4_000_000,
    probabilidad_cierre_pct: 50,
    margen_operacional_pct: 18,
    dias_sin_contacto: 5,
    estado_alerta: "Seguimiento",
    accion_sugerida: "Revisar presupuesto con RRHH."
  },
  {
    id_cotizacion: 403,
    codigo_cotizacion: "R13-403",
    cliente: "Salfamantenciones",
    monto_ponderado: 3_600_000,
    probabilidad_cierre_pct: 80,
    margen_operacional_pct: 25,
    dias_sin_contacto: 2,
    estado_alerta: "Sano",
    accion_sugerida: "Enviar contrato firmado."
  }
];

export default async function EjecutivoPage({ params }: { params: { id: string } }) {
  // En un escenario real, aquí haríamos un fetch a la API con el `params.id`
  // const data = await dashboardService.getDashboardEjecutivo(Number(params.id), 2026, 8);
  
  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-[1400px] flex flex-col gap-6 pb-20">
        
        {/* HEADER Y NAVEGACIÓN */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center">
                <UserCircle className="w-7 h-7 text-[#485CC7]" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Hola, {mockDashboardEjecutivo.nombre_completo}
                </h1>
                <p className="text-xs font-medium text-slate-500">
                  Panel Personal de Autogestión
                </p>
              </div>
            </div>

            {/* BOTÓN SALIR */}
            <Link 
              href="/"
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </Link>
          </div>

          {/* FILTROS GLOBALES (Reutilizamos la barra pero ajustada a sus necesidades) */}
          <FiltrosGlobales />
        </div>

        {/* ALERTA PRESCRIPTIVA CENTRAL (Solo si existe recomendación en el DTO) */}
        {mockDashboardEjecutivo.recomendacion_accion_comercial && (
          <div className="flex items-start gap-3 bg-red-50 p-4 rounded-xl border border-red-200 shadow-sm">
            <div className="p-1.5 bg-red-100 rounded-full">
              <Info className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-red-700 uppercase tracking-wide">
                Alerta de Ritmo Comercial
              </span>
              <p className="text-sm text-red-600 mt-0.5 leading-relaxed font-medium">
                {mockDashboardEjecutivo.recomendacion_accion_comercial}
              </p>
            </div>
          </div>
        )}

        {/* MÓDULOS DE PROGRESO Y PROYECCIÓN */}
        <ProgresoPersonal data={mockDashboardEjecutivo} />

        {/* MÉTRICAS SECUNDARIAS (Pipeline, Éxito, Reuniones) */}
        <MetricasSecundarias 
          pipelinePonderado={mockDashboardEjecutivo.pipeline_ponderado || 0}
          tasaExito={mockDashboardEjecutivo.tasa_exito_pct}
          reuniones={4} // En un caso real vendría del endpoint de KPIs
        />

        {/* MATRIZ DE PRIORIZACIÓN DE OPORTUNIDADES (Scatterplot) */}
        <PriorizacionScatter oportunidades={mockOportunidades} />

        {/* TABLA DE PIPELINE ACTIVO Y TAREAS DIARIAS */}
        <MiPipelineActivo oportunidades={mockOportunidades} />

      </div>
    </main>
  );
}