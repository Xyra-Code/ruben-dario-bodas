import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";

import { Encabezado } from "@/components/marco/Encabezado";
import { Pie } from "@/components/marco/Pie";
import { WhatsAppFlotante } from "@/components/marco/WhatsAppFlotante";
import { obtenerContenido } from "@/lib/contenido/cargar";
import { MENSAJES, enlaceWhatsApp } from "@/lib/whatsapp";

import "./globals.css";

// Fuentes descargadas al compilar y servidas desde el propio sitio (sin peticiones a Google).
// Títulos: serif editorial, como el descriptor del logo. Texto: sans geométrica, como el nombre.
const titulo = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--fuente-titulo",
  display: "swap",
});
const texto = Jost({ subsets: ["latin"], variable: "--fuente-texto", display: "swap" });

const { sitio } = obtenerContenido();

// Base de las URL absolutas (canonical, Open Graph). Cada página define el resto con
// `metadatos()` de src/lib/seo/metadatos.ts.
export const metadata: Metadata = {
  metadataBase: new URL(sitio.url),
  applicationName: sitio.nombre,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#faf7f2",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-CO" className={`${titulo.variable} ${texto.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#contenido"
          className="sr-only z-50 bg-terracota px-4 py-3 text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
        >
          Saltar al contenido
        </a>
        <Encabezado />
        <div id="contenido" className="flex-1">
          {children}
        </div>
        <Pie />
        <WhatsAppFlotante enlace={enlaceWhatsApp(sitio.whatsapp, MENSAJES.general)} />
      </body>
    </html>
  );
}
