/**
 * @fileoverview Punto de entrada principal de la aplicación (Ruta `/`).
 * Renderiza la vista principal del dashboard.
 */

import { Metadata } from "next";
import { DashboardView } from "@/views/dashboard/dashboard-view";

/**
 * Metadatos estáticos para la optimización SEO y la pestaña del navegador.
 * Next.js 15 inyecta esto automáticamente en la etiqueta <head> del documento.
 */
export const metadata: Metadata = {
  title: "INSECAP | Dashboard Comercial",
  description:
    "Dashboard comercial interactivo sobre ventas, metas, gerencia y ejecutivos de INSECAP.",
  authors: [{ name: "Samuel Fuentes" }],
};

/**
 * Componente de página principal (Server Component por defecto, aunque delega
 * la lógica interactiva al Client Component `DashboardView`).
 * 
 * @returns {JSX.Element} Vista ensamblada del dashboard.
 */
export default function HomePage() {
  return <DashboardView />;
}