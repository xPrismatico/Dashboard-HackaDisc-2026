// src/types/api.ts

export type NivelRiesgo = "Bajo" | "Medio" | "Alto" | "Crítico" | "No disponible";

// ==========================================
// DTOs: GERENCIA
// ==========================================

export interface ResumenEquipoGerenteDTO {
  ventas_acumuladas: number;
  meta_mensual: number | null;
  progreso_meta_pct: number | null;
  forecast_cierre_mensual: number | null;
  probabilidad_cumplimiento_pct: number | null;
  gap_proyectado_meta: number | null;
  tasa_exito_pct: number;
}

export interface EjecutivoRiesgoResumenDTO {
  id_ejecutivo: number;
  nombre_completo: string;
  ventas_acumuladas: number;
  meta_mensual: number | null;
  progreso_meta_pct: number | null;
  forecast_cierre_mensual: number | null;
  probabilidad_cumplimiento_pct: number | null;
  gap_proyectado_meta: number | null;
  tasa_exito_pct: number;
  nivel_riesgo_comercial: NivelRiesgo;
}

export interface DashboardGerenteResponseDTO {
  periodo_anio: number;
  periodo_mes: number;
  fecha_corte: string | null;
  resumen_equipo: ResumenEquipoGerenteDTO;
  ejecutivos: EjecutivoRiesgoResumenDTO[];
}

// ==========================================
// DTOs: EJECUTIVO DE VENTAS
// ==========================================

export interface DashboardEjecutivoResponseDTO {
  id_ejecutivo: number;
  nombre_completo: string;
  periodo_anio: number;
  periodo_mes: number;
  fecha_corte: string | null;
  ventas_acumuladas: number;
  meta_mensual: number | null;
  progreso_meta_pct: number | null;
  monto_faltante_actual: number | null;
  indice_avance_esperado: number | null;
  forecast_cierre_mensual: number | null;
  gap_proyectado_meta: number | null;
  pipeline_ponderado: number | null;
  tasa_exito_pct: number;
  nivel_riesgo_comercial: NivelRiesgo;
  recomendacion_accion_comercial: string | null;
}

// ==========================================
// DTOs: COMPONENTES VISUALES (EJECUTIVO)
// ==========================================

export interface OportunidadPipelineDTO {
  id_cotizacion: number;
  codigo_cotizacion: string;
  cliente: string; // Razón Social
  monto_ponderado: number; // Precio Final * Probabilidad
  probabilidad_cierre_pct: number;
  margen_operacional_pct: number;
  dias_sin_contacto: number; // Eje Y del Scatterplot
  estado_alerta: "Urgente" | "Seguimiento" | "Sano";
  accion_sugerida: string; // Motor prescriptivo (Ej: "Llamar a Jefe de Turno")
}

export interface TendenciaPersonalDTO {
  dias: string[];
  venta_real: (number | null)[];
  proyeccion: (number | null)[];
  meta_lineal: number[];
}

// ==========================================
// DTOs: MAESTRO EJECUTIVOS
// ==========================================

export interface EjecutivoResumenDTO {
  id_ejecutivo: number;
  nombre_completo: string;
  email: string;
  cargo_categoria: string;
  estado_activo: boolean;
}

export interface EjecutivoListResponseDTO {
  total: number;
  items: EjecutivoResumenDTO[];
}

// ==========================================
// DTOs: KPIs ESPECÍFICOS
// ==========================================

export interface OficialDashboardKPIsDTO {
  id_ejecutivo: number;
  periodo_anio: number;
  periodo_mes: number;
  nivel_ventas: number;
  progreso_meta_pct: number | null;
  tasa_exito_pct: number;
  clientes_nuevos_count: number;
  clientes_recuperados_count: number;
  reuniones_count: number;
  tasa_cursos_ejecutados_pct: number;
  monto_terminadas_historico: number;
  facturadas_mes_pct: number;
  eficacia_r51_pct: number;
  post_venta_registrados_count: number;
  forecast_cierre_mensual: number;
  probabilidad_cumplimiento_pct: number;
  gap_proyectado_meta: number;
  indice_avance_esperado: number;
  health_score_comercial: number;
  nivel_riesgo_comercial: string;
  pipeline_ponderado: number;
  conversion_monto_cotizado_pct: number;
  ticket_promedio_vendido: number;
  recomendacion_accion_comercial: string;
}