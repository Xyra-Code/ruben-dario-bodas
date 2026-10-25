/**
 * Mensajes de WhatsApp del sitio (docs/mapa-del-sitio.md §3). El sitio es estático: el
 * formulario no envía nada, arma el texto y abre wa.me; el visitante confirma el envío.
 * Sin dependencias de servidor: se usa también en componentes de cliente.
 */
import type { TipoEvento } from "@/lib/contenido/esquemas";

export const MENSAJES = {
  /** Botón flotante y encabezado. */
  general: "Hola, quisiera información para decorar mi evento.",
  /** Tarjeta "Otros eventos". */
  otros: "Hola, quisiera cotizar la decoración de un evento.",
  /** Página de vestidos de novia: agendar la primera cita. */
  vestido: "Hola, quisiera una cita para diseñar mi vestido de novia.",
  /** Botón flotante en /bodas y /quince-anos. */
  boda: "Hola, quisiera cotizar el diseño de mi boda.",
  quince: "Hola, quisiera cotizar mi fiesta de 15 años.",
} as const;

/** Evento del portafolio, lo justo para armar el mensaje del botón flotante. */
export type EventoMensaje = { slug: string; titulo: string; tipo: TipoEvento };

/**
 * Mensaje y etiqueta del botón flotante según la página: la empresa recibe el contexto
 * desde el primer mensaje. En la página de un evento, el evento de referencia ("Hola, vi
 * la boda en Finca San Luis, Villavicencio y quisiera algo así.").
 */
export function flotanteSegunRuta(ruta: string, eventos: EventoMensaje[]) {
  const evento = eventos.find((e) => ruta === `/eventos/${e.slug}`);
  if (evento) {
    const titulo = evento.titulo.charAt(0).toLowerCase() + evento.titulo.slice(1);
    return {
      mensaje: `Hola, vi ${evento.tipo === "otro" ? "el" : "la"} ${titulo} y quisiera algo así.`,
      etiqueta: "¿Quieres algo así?",
    };
  }
  if (ruta.startsWith("/bodas")) return { mensaje: MENSAJES.boda, etiqueta: "¿Cotizamos tu boda?" };
  if (ruta.startsWith("/quince-anos"))
    return { mensaje: MENSAJES.quince, etiqueta: "¿Cotizamos tu fiesta de 15?" };
  if (ruta.startsWith("/vestidos-de-novia"))
    return { mensaje: MENSAJES.vestido, etiqueta: "¿Agendamos tu cita?" };
  return { mensaje: MENSAJES.general, etiqueta: "¿Cotizamos tu evento?" };
}

export const NOMBRE_TIPO_MENSAJE: Record<TipoEvento, string> = {
  boda: "Boda",
  quince: "15 años",
  otro: "Otro",
};

export function enlaceWhatsApp(numero: string, mensaje: string) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

export type DatosCotizacion = {
  nombre: string;
  tipo: TipoEvento;
  /** Valor de <input type="date">: "2027-03-14". */
  fecha: string;
  lugar?: string;
  invitados?: string;
  /** Rango elegido: "$20 a $30 millones". */
  presupuesto?: string;
  mensaje?: string;
  /** Desde una página de evento: "Boda en Hacienda El Caney, Restrepo". */
  referencia?: string;
};

/** "2027-03-14" → "14 de marzo de 2027" (sin desfase de zona horaria). */
export function fechaLegible(fecha: string) {
  const [anio, mes, dia] = fecha.split("-").map(Number);
  return new Intl.DateTimeFormat("es-CO", { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(Date.UTC(anio, mes - 1, dia)),
  );
}

/** Mensaje del formulario de cotización, con los campos vacíos omitidos. */
export function mensajeCotizacion(d: DatosCotizacion) {
  const lineas = [
    "Hola, quisiera cotizar la decoración de mi evento.",
    `• Nombre: ${d.nombre.trim()}`,
    `• Evento: ${NOMBRE_TIPO_MENSAJE[d.tipo]}`,
    `• Fecha: ${fechaLegible(d.fecha)}`,
    d.lugar?.trim() && `• Lugar: ${d.lugar.trim()}`,
    d.invitados?.trim() && `• Invitados: ${d.invitados.trim()}`,
    d.presupuesto?.trim() && `• Presupuesto: ${d.presupuesto.trim()}`,
    d.referencia && `• Referencia: ${d.referencia}`,
    d.mensaje?.trim() && `• Mensaje: ${d.mensaje.trim()}`,
  ];
  return lineas.filter(Boolean).join("\n");
}
