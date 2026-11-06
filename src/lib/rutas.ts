import type { TipoEvento } from "@/lib/contenido/esquemas";

/** Página de servicio de cada tipo de evento ("otro" no tiene página propia). */
export const RUTA_SERVICIO: Partial<Record<TipoEvento, string>> = {
  boda: "/bodas",
  quince: "/fiestas-de-15",
};

/** Nombre corto para migas y etiquetas. */
export const NOMBRE_SERVICIO: Partial<Record<TipoEvento, string>> = {
  boda: "Bodas",
  quince: "15 años",
};

/** Vestidos a medida: no son un tipo de evento, cada uno tiene su propia página. */
export const RUTA_VESTIDOS = "/vestidos-de-novia";
export const RUTA_VESTIDOS_QUINCE = "/vestidos-de-15";

/** Enlace del menú marcado como actual. "Vestidos" lleva a novia, pero cubre las dos páginas. */
export const esRutaActual = (itemRuta: string, ruta: string) =>
  ruta === itemRuta ||
  ruta.startsWith(`${itemRuta}/`) ||
  (itemRuta === RUTA_VESTIDOS && ruta === RUTA_VESTIDOS_QUINCE);

export const rutaEvento = (slug: string) => `/eventos/${slug}`;

/** Ficha de un lugar en la guía de lugares (cada ficha tiene el slug del lugar como id). */
export const rutaLugar = (slug: string) => `/lugares-para-bodas-y-quince-villavicencio#${slug}`;

/** "Restrepo, Meta"; en Bogotá solo "Bogotá". */
export const ubicacion = (lugar: { municipio: string; departamento: string }) =>
  lugar.departamento.startsWith("Bogotá")
    ? lugar.municipio
    : `${lugar.municipio}, ${lugar.departamento}`;

/** Página de vestidos: el botón del encabezado invita a agendar cita, no a cotizar un evento. */
export const esPaginaVestidos = (ruta: string) =>
  ruta === RUTA_VESTIDOS || ruta === RUTA_VESTIDOS_QUINCE;

export type ItemNavegacion = {
  nombre: string;
  ruta: string;
  /** Solo se ve en el menú móvil (los ítems con `hijos` muestran los enlaces en su lugar). */
  descripcion: string;
  /** Con hijos, el ítem no es un enlace: despliega sus páginas. `corto` es para el menú móvil. */
  hijos?: { nombre: string; corto: string; ruta: string }[];
};

/** Navegación principal (encabezado y menú móvil). */
export const NAVEGACION: ItemNavegacion[] = [
  { nombre: "Bodas", ruta: "/bodas", descripcion: "Wedding planner, diseño y decoración" },
  { nombre: "Fiestas de 15", ruta: "/fiestas-de-15", descripcion: "Decoración y organización" },
  {
    nombre: "Vestidos",
    ruta: RUTA_VESTIDOS,
    descripcion: "De novia y de 15 años, a medida",
    hijos: [
      { nombre: "Vestidos de novia", corto: "De novia", ruta: RUTA_VESTIDOS },
      { nombre: "Vestidos de 15 años", corto: "De 15 años", ruta: RUTA_VESTIDOS_QUINCE },
      {
        nombre: "Trajes de novio",
        corto: "Trajes de novio",
        ruta: `${RUTA_VESTIDOS}#traje-de-novio`,
      },
    ],
  },
  { nombre: "Eventos", ruta: "/eventos", descripcion: "Bodas y fiestas que hemos diseñado" },
  { nombre: "Nosotros", ruta: "/sobre-ruben-dario", descripcion: "La historia de Rubén Darío" },
];

/**
 * "Explorar" del pie: más detallado que el menú, con una entrada por página de servicio. El
 * menú agrupa los vestidos; aquí cada uno lleva su nombre y su enlace directo.
 */
export const ENLACES_PIE = [
  { nombre: "Bodas", ruta: "/bodas" },
  { nombre: "Fiestas de 15 años", ruta: "/fiestas-de-15" },
  { nombre: "Vestidos de novia", ruta: RUTA_VESTIDOS },
  { nombre: "Vestidos de 15 años", ruta: RUTA_VESTIDOS_QUINCE },
  { nombre: "Trajes de novio", ruta: `${RUTA_VESTIDOS}#traje-de-novio` },
  { nombre: "Eventos", ruta: "/eventos" },
  { nombre: "Nosotros", ruta: "/sobre-ruben-dario" },
] as const;
