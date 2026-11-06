import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { Encabezado } from "@/components/marco/Encabezado";
import { Pie } from "@/components/marco/Pie";
import { WhatsAppFlotante } from "@/components/marco/WhatsAppFlotante";
import { obtenerContenido } from "@/lib/contenido/cargar";

import "./globals.css";

// Fuentes guardadas en src/fuentes/ (subconjunto latino de Google Fonts, licencia OFL): ni el
// desarrollo ni la compilación dependen de la conexión con Google, y el sitio las sirve él mismo.
// Títulos en Poiret One, la letra de "Rubén Darío" en el logo; texto en Manrope.
const poiret = localFont({
  src: "../fuentes/poiret-one-latin.woff2",
  weight: "400",
  display: "swap",
  variable: "--f-poiret",
});
const manrope = localFont({
  src: "../fuentes/manrope-variable-latin.woff2",
  weight: "200 800",
  display: "swap",
  variable: "--f-manrope",
});
// Citas en la cursiva de Bodoni Moda, con eje de tamaño óptico para que los trazos finos aguanten
// en tamaños pequeños. Va sin precarga para no competir con la foto principal.
const bodoniCursiva = localFont({
  src: "../fuentes/bodoni-moda-cursiva-variable-latin.woff2",
  weight: "400 900",
  style: "italic",
  display: "swap",
  variable: "--f-bodoni-cursiva",
  preload: false,
  adjustFontFallback: "Times New Roman",
});

const { sitio, eventos } = obtenerContenido();

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
      className={`${poiret.variable} ${manrope.variable} ${bodoniCursiva.variable}`}
    >
      <body className="flex min-h-dvh flex-col grano">
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
        <WhatsAppFlotante
          numero={sitio.whatsapp}
          eventos={eventos.map((e) => ({ slug: e.slug, titulo: e.titulo, tipo: e.tipo }))}
        />
      </body>
    </html>
  );
}
