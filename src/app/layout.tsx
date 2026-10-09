import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Manrope } from "next/font/google";

import { Encabezado } from "@/components/marco/Encabezado";
import { Pie } from "@/components/marco/Pie";
import { WhatsAppFlotante } from "@/components/marco/WhatsAppFlotante";
import { obtenerContenido } from "@/lib/contenido/cargar";
import { MENSAJES, enlaceWhatsApp } from "@/lib/whatsapp";

import "./globals.css";

// Fuentes descargadas al compilar y servidas desde el propio sitio (sin peticiones a Google).
// Tipografía 3 · Alta Costura, elegida por la empresa: Bodoni Moda (títulos, con eje de
// tamaño óptico para que los trazos finos aguanten en tamaños pequeños) y Manrope (texto).
// La cursiva de Bodoni (citas) va sin precarga para no competir con la foto principal.
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  display: "swap",
  style: "normal",
  axes: ["opsz"],
  variable: "--f-bodoni",
});
const bodoniCursiva = Bodoni_Moda({
  subsets: ["latin"],
  display: "swap",
  style: "italic",
  axes: ["opsz"],
  variable: "--f-bodoni-cursiva",
  preload: false,
});
const manrope = Manrope({ subsets: ["latin"], display: "swap", variable: "--f-manrope" });

const { sitio } = obtenerContenido();

// Base de las URL absolutas (canonical, Open Graph). Cada página define el resto con
// `metadatos()` de src/lib/seo/metadatos.ts.
export const metadata: Metadata = {
  metadataBase: new URL(sitio.url),
  applicationName: sitio.nombre,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#fdfaf7",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-CO"
      className={`${bodoni.variable} ${bodoniCursiva.variable} ${manrope.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        <a
          href="#contenido"
          className="sr-only z-50 bg-terracota px-4 py-3 text-sobre-principal focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
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
