import type { TipoEvento } from "@/lib/contenido/esquemas";

/** Página de servicio de cada tipo de evento ("otro" no tiene página propia). */
export const RUTA_SERVICIO: Partial<Record<TipoEvento, string>> = {
  boda: "/bodas",
  quince: "/quince-anos",
};

/** Nombre corto para migas y etiquetas. */
export const NOMBRE_SERVICIO: Partial<Record<TipoEvento, string>> = {
  boda: "Bodas",
  quince: "15 años",
};

/** Vestidos de novia a medida: no es un tipo de evento, tiene su propia página. */
export const RUTA_VESTIDOS = "/vestidos-de-novia";

export const rutaEvento = (slug: string) => `/eventos/${slug}`;

/** "Restrepo, Meta"; en Bogotá solo "Bogotá". */
export const ubicacion = (lugar: { municipio: string; departamento: string }) =>
  lugar.departamento.startsWith("Bogotá")
    ? lugar.municipio
    : `${lugar.municipio}, ${lugar.departamento}`;

/** Navegación principal (encabezado y menú móvil). Contacto lleva al formulario de la página. */
export const NAVEGACION = [
  { nombre: "Bodas", ruta: "/bodas" },
  { nombre: "15 años", ruta: "/quince-anos" },
  { nombre: "Vestidos", ruta: RUTA_VESTIDOS },
  { nombre: "Eventos", ruta: "/eventos" },
  { nombre: "Nosotros", ruta: "/sobre-ruben-dario" },
] as const;
