// src/types/api.ts

// ============================================================================
// DTOs COMBINADOS PARA EL FRONTEND (Adaptados del Backend de FastAPI)
// ============================================================================

export interface ResumenEquipoData {
  mes: number;
  anio: number;
  venta_real_acumulada: number;
  meta_global: number;
  progreso_meta_porcentaje: number;
  forecast_cierre_mes: number;
  gap_proyectado: number;
  probabilidad_llegar_meta: number;
  
  // Aliases requeridos directamente por el componente HeroPredictivo
  ventas_acumuladas: number;
  meta_mensual: number;
  progreso_meta_pct: number;
  forecast_cierre_mensual: number;
  gap_proyectado_meta: number;
  probabilidad_cumplimiento_pct: number;

  // Campos extra para las tarjetas KPI
  tasa_exito_pct: number;
  clientes_nuevos_totales: number;
}

export interface IndicadoresClaveData {
  actividad_reuniones: number;
  pacing_venta: number;
  tasa_exito: number;
  deuda_morosa: number;
}

export interface RiesgoEjecutivoData {
  vendedor_id: number;
  nombre_vendedor: string;
  iniciales: string;
  venta_real: number;
  meta: number;
  gap_proyectado: number;
  probabilidad_meta: number;
  nivel_riesgo: string;
  palancas: IndicadoresClaveData;
  
  // Propiedades añadidas para compatibilidad directa con el UI (AtencionRequerida)
  id_ejecutivo: number;
  nombre_completo: string;
  ventas_acumuladas: number;
  meta_mensual: number;
  progreso_meta_pct: number;
  forecast_cierre_mensual: number;
  gap_proyectado_meta: number;
  probabilidad_cumplimiento_pct: number;
  tasa_exito_pct: number;
  nivel_riesgo_comercial: string;
}

export interface DashboardGerenteResponseDTO {
  resumen_equipo: ResumenEquipoData;
  ejecutivos: RiesgoEjecutivoData[];
}

export interface DiaTendenciaDTO {
  dia: number;
  venta_real: number | null;
  proyeccion_ml: number | null;
  meta_ideal: number;
}

export interface TendenciaVentasData {
  mes: number;
  anio: number;
  dias: DiaTendenciaDTO[];
}

export interface MesPlanificacionDTO {
  mes_texto: string;
  mineria_hrs: number;
  excel_hrs: number;
  maquinaria_hrs: number;
}

export interface PlanificacionOperativaResponse {
  alerta: string | null;
  data: MesPlanificacionDTO[];
}

export interface ClienteRiesgoFrontendDTO {
  id_cliente: number;
  razon_social: string;
  volumen_compra_clp: number;
  magnitud_riesgo_clp: number;
  nivel_riesgo: string;
  ejecutivo_responsable: string;
  detalle_riesgo: string;
}

export interface ClientesRiesgoResponse {
  clientes: ClienteRiesgoFrontendDTO[];
}