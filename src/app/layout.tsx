import type { Metadata, Viewport } from "next";

import { obtenerContenido } from "@/lib/contenido/cargar";

import "./globals.css";

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
    <html lang="es-CO">
      <body>{children}</body>
    </html>
  );
}
