// src/store/use-dashboard-store.ts

import { create } from "zustand";

/**
 * Tipos estrictos para los filtros definidos en la regla de negocio de INSECAP.
 * Ayudan a prevenir errores de tipeo al actualizar el estado.
 */
export type Sucursal = "Todas" | "Calama" | "Antofagasta" | "Santiago";
export type Modalidad = "Todas" | "Elearning Asincrono" | "Elearning Sincrono" | "Presencial" | "Blend";
export type Financiamiento = "Todos" | "Sence" | "Costo Empresa";

interface DashboardState {
  // ==========================================
  // 1. FILTROS GLOBALES (Header Bar)
  // ==========================================
  sucursal: Sucursal;
  periodoAnio: number;
  periodoMes: number;
  modalidad: Modalidad;
  financiamiento: Financiamiento;
  soloActivos: boolean;

  // Acciones de mutación para filtros
  setFiltro: <K extends keyof DashboardState>(key: K, value: DashboardState[K]) => void;
  resetFiltros: () => void;

  // ==========================================
  // 2. ESTADO DE INTERACCIÓN Y NAVEGACIÓN
  // ==========================================
  // Soporte para "Semantic Zooming" y "Brushing & Linking"

  // ID del ejecutivo bajo inspección (Hover para Tooltip o Clic para Ficha 360°)
  ejecutivoFocusId: number | null; 
  setEjecutivoFocusId: (id: number | null) => void;

  // ID del cliente bajo inspección (Clic para Modal Estado de Cuenta B2B)
  clienteFocusId: number | null; 
  setClienteFocusId: (id: number | null) => void;

  // Manejo de la vista actual (útil si integramos un switch visual entre roles)
  vistaActiva: "gerencia" | "ejecutivo";
  setVistaActiva: (vista: "gerencia" | "ejecutivo") => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  // Valores iniciales seteados en el contexto del mes actual (Agosto 2026)
  sucursal: "Todas",
  periodoAnio: 2026,
  periodoMes: 8,
  modalidad: "Todas",
  financiamiento: "Todos",
  soloActivos: true, // Regla de negocio crítica: evitar distorsión por rotación histórica

  setFiltro: (key, value) => set((state) => ({ ...state, [key]: value })),
  
  resetFiltros: () => set({
    sucursal: "Todas",
    periodoAnio: 2026,
    periodoMes: 8,
    modalidad: "Todas",
    financiamiento: "Todos",
    soloActivos: true,
  }),

  // Estados nulos por defecto (ningún elemento seleccionado)
  ejecutivoFocusId: null,
  setEjecutivoFocusId: (id) => set({ ejecutivoFocusId: id }),

  clienteFocusId: null,
  setClienteFocusId: (id) => set({ clienteFocusId: id }),

  vistaActiva: "gerencia",
  setVistaActiva: (vista) => set({ vistaActiva: vista }),
}));