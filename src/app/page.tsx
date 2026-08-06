/**
 * @fileoverview Punto de entrada principal de la aplicación (Ruta `/`).
 * Renderiza la vista principal del dashboard.
 */

import { Metadata } from "next";
import Link from "next/link";
import { Building2, UserCircle, ArrowRight, BarChart3 } from "lucide-react";

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
export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 relative overflow-hidden">
      
      {/* Elementos decorativos de fondo (Opcional, le da un toque moderno) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-[#485CC7]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full bg-[#00B8DE]/5 blur-3xl pointer-events-none" />

      <div className="z-10 flex w-full max-w-4xl flex-col items-center gap-10">
        
        {/* Logo / Cabecera Institucional */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-100 mb-2">
            <BarChart3 className="w-8 h-8 text-[#485CC7]" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            INSECAP <span className="text-[#485CC7]">Capacitaciones</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 max-w-md">
            Plataforma de Inteligencia Comercial. Seleccione su perfil de acceso para ingresar al sistema.
          </p>
        </div>

        {/* Tarjetas de Selección de Rol */}
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
          
          {/* Tarjeta 1: Acceso Gerencia */}
          <Link href="/gerencia" className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-[#485CC7]/50 hover:shadow-lg hover:shadow-[#485CC7]/5">
            <div>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#485CC7]/10 text-[#485CC7] transition-colors group-hover:bg-[#485CC7] group-hover:text-white">
                <Building2 className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Gerencia Comercial</h2>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Visión administrativa del equipo ejecutivo, proyección predictiva de cierre de mes, análisis de brechas ($) y matriz de riesgo de clientes y ejecutivos.
              </p>
            </div>
            <div className="mt-8 flex items-center text-sm font-bold text-[#485CC7]">
              Ingresar como Gerente
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Tarjeta 2: Acceso Ejecutivo de Ventas */}
          {/* Nota: Mandamos un ID estático (ej. 1) para simular el login de un vendedor específico */}
          <Link href="/ejecutivo/1" className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-[#00B8DE]/50 hover:shadow-lg hover:shadow-[#00B8DE]/5">
            <div>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#00B8DE]/10 text-[#00B8DE] transition-colors group-hover:bg-[#00B8DE] group-hover:text-white">
                <UserCircle className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Ejecutivo de Ventas</h2>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Panel de autogestión diaria. Cumplimiento personal de meta, Monitoreo de Ritmo de venta, Cálculo de comisiones y priorización de embudo de cotizaciones.
              </p>
            </div>
            <div className="mt-8 flex items-center text-sm font-bold text-[#00B8DE]">
              Ingresar como Ejecutivo
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

        </div>

        {/* Footer ligero */}
        <div className="text-center text-xs font-medium text-slate-400 mt-8">
          HackaDISC 2026 • Team MVPS
        </div>

      </div>
    </main>
  );
}