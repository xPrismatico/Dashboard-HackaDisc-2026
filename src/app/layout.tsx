import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800"],
});


export const metadata: Metadata = {
  title: "INSECAP | Dashboard Comercial",
  description: "Plataforma de inteligencia y predicción comercial para INSECAP Capacitaciones.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="light">
      <body
        className={`${montserrat.variable} font-sans bg-slate-950 text-slate-100 min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
