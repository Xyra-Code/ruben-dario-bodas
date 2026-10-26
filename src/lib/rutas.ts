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

/** Ficha de un lugar en la guía de lugares (cada ficha tiene el slug del lugar como id). */
export const rutaLugar = (slug: string) => `/lugares-para-bodas-villavicencio#${slug}`;

/** "Restrepo, Meta"; en Bogotá solo "Bogotá". */
export const ubicacion = (lugar: { municipio: string; departamento: string }) =>
  lugar.departamento.startsWith("Bogotá")
    ? lugar.municipio
    : `${lugar.municipio}, ${lugar.departamento}`;

/** Navegación principal (encabezado, menú móvil y pie). La descripción solo se ve en el menú móvil. */
export const NAVEGACION = [
  { nombre: "Bodas", ruta: "/bodas", descripcion: "Wedding planner, diseño y decoración" },
  { nombre: "15 años", ruta: "/quince-anos", descripcion: "Decoración, organización y vestido" },
  { nombre: "Vestidos", ruta: RUTA_VESTIDOS, descripcion: "De novia y de 15 años, a medida" },
  { nombre: "Eventos", ruta: "/eventos", descripcion: "Bodas y fiestas que hemos diseñado" },
  { nombre: "Nosotros", ruta: "/sobre-ruben-dario", descripcion: "La historia de Rubén Darío" },
] as const;
