/**
 * Metadata por página: título, descripción, canonical, Open Graph (WhatsApp, Facebook) y
 * tarjeta de X. Las URL absolutas usan el dominio en punycode (content/sitio.json → url).
 *
 * Next mezcla la metadata de layout y página de forma superficial: si una página define
 * `openGraph`, reemplaza el del layout completo. Por eso cada página arma la suya entera
 * con esta función.
 */
import type { Metadata } from "next";

import { obtenerContenido } from "@/lib/contenido/cargar";
import { OG_SITIO, type ImagenOg } from "@/lib/imagenes";

/** URL absoluta canónica de una ruta del sitio ("/bodas" → "https://xn--…com/bodas"). */
export function urlAbsoluta(ruta: string) {
  const { url } = obtenerContenido().sitio;
  return ruta === "/" ? url : `${url}${ruta}`;
}

type Opciones = {
  titulo: string;
  descripcion: string;
  /** Ruta canónica, sin barra final: "/", "/bodas", "/eventos/boda-…". */
  ruta: string;
  /** Imagen para compartir; por defecto, la del sitio (logo sobre marfil). */
  imagen?: ImagenOg;
  /** true para páginas que no deben aparecer en Google (404). */
  noIndexar?: boolean;
};

export function metadatos({
  titulo,
  descripcion,
  ruta,
  imagen = OG_SITIO,
  noIndexar,
}: Opciones): Metadata {
  const { sitio } = obtenerContenido();
  const url = urlAbsoluta(ruta);
  const imagenes = [{ url: imagen.src, width: imagen.ancho, height: imagen.alto, alt: imagen.alt }];

  return {
    title: { absolute: titulo },
    description: descripcion,
    alternates: noIndexar ? undefined : { canonical: url },
    robots: noIndexar ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      locale: "es_CO",
      siteName: sitio.nombre,
      title: titulo,
      description: descripcion,
      url,
      images: imagenes,
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: descripcion,
      images: imagenes,
    },
  };
}
