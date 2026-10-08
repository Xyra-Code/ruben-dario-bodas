import type { CSSProperties } from "react";

import { obtenerImagen } from "@/lib/imagenes";

type Props = {
  /** Slug del evento y archivo de la foto, tal como están en evento.json. */
  evento: string;
  archivo: string;
  alt: string;
  /**
   * Ancho que ocupa la foto en pantalla, para que el navegador elija el archivo justo.
   * Ej.: tarjeta en 2/3 columnas → "(min-width: 1024px) 33vw, 50vw".
   */
  sizes: string;
  /** Solo la foto principal visible al cargar (LCP): carga inmediata y prioridad alta. */
  prioridad?: boolean;
  /** Para recortes (tarjetas 4:5, portadas) agregue aspect-* y object-cover. */
  className?: string;
};

/**
 * Foto de evento ya optimizada (WebP en varios anchos, generada al compilar).
 * Sin JavaScript en el navegador: es un <img> con srcset, medidas reales (no hay saltos
 * al cargar) y el color dominante + miniatura borrosa de fondo mientras llega.
 */
export function Foto({ evento, archivo, alt, sizes, prioridad = false, className = "" }: Props) {
  const imagen = obtenerImagen(evento, archivo);
  const mayor = imagen.variantes[imagen.variantes.length - 1];
  const fondo: CSSProperties = {
    backgroundColor: imagen.color,
    backgroundImage: `url("${imagen.lqip}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    // eslint-disable-next-line @next/next/no-img-element -- export estático: las fotos ya vienen optimizadas por scripts/imagenes.ts
    <img
      src={mayor.src}
      srcSet={imagen.variantes.map((v) => `${v.src} ${v.ancho}w`).join(", ")}
      sizes={sizes}
      width={imagen.ancho}
      height={imagen.alto}
      alt={alt}
      loading={prioridad ? "eager" : "lazy"}
      fetchPriority={prioridad ? "high" : "auto"}
      decoding={prioridad ? "sync" : "async"}
      className={`block h-auto max-w-full ${className}`}
      style={fondo}
    />
  );
}
