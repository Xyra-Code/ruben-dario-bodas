import type { MetadataRoute } from "next";

import { obtenerContenido } from "@/lib/contenido/cargar";

export const dynamic = "force-static";

/** Nombre e ícono al "agregar a la pantalla de inicio" en Android. */
export default function manifest(): MetadataRoute.Manifest {
  const { sitio } = obtenerContenido();
  return {
    name: sitio.nombre,
    short_name: "Rubén Darío",
    description: sitio.lema,
    lang: "es-CO",
    start_url: "/",
    display: "browser",
    background_color: "#faf7f2",
    theme_color: "#faf7f2",
    icons: [
      { src: "/marca/icono-192.png", sizes: "192x192", type: "image/png" },
      { src: "/marca/icono-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
