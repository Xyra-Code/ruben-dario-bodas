import type { MetadataRoute } from "next";

import { obtenerContenido } from "@/lib/contenido/cargar";
import { obtenerImagen } from "@/lib/imagenes";
import { urlAbsoluta } from "@/lib/seo/metadatos";
import { PAGINAS } from "@/lib/seo/paginas";
import { RUTA_SERVICIO, rutaEvento } from "@/lib/rutas";

export const dynamic = "force-static";

/** Se regenera en cada build: un evento nuevo entra solo. Incluye las fotos (Google Imágenes). */
export default function sitemap(): MetadataRoute.Sitemap {
  const { eventos, servicios } = obtenerContenido();
  const fijas = [
    PAGINAS.inicio.ruta,
    ...servicios.map((s) => RUTA_SERVICIO[s.tipo]!),
    PAGINAS.eventos.ruta,
    PAGINAS.sobre.ruta,
    PAGINAS.lugares.ruta,
    PAGINAS.politica.ruta,
  ];

  return [
    ...fijas.map((ruta) => ({ url: urlAbsoluta(ruta) })),
    ...eventos.map((e) => ({
      url: urlAbsoluta(rutaEvento(e.slug)),
      images: e.fotos.map((f) => {
        const { variantes } = obtenerImagen(e.slug, f.archivo);
        return urlAbsoluta(variantes[variantes.length - 1].src);
      }),
    })),
  ];
}
