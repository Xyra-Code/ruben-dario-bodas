import Link from "next/link";

import type { Lugar } from "@/lib/contenido/esquemas";
import { rutaLugar } from "@/lib/rutas";

/**
 * Nombre de un lugar (salón, finca, hacienda): siempre lleva a su ficha en la guía de
 * lugares, si el lugar está en ella (enGuia: dio permiso de nombrarlo). Si no, va como
 * texto. No usarlo dentro de otro enlace (p. ej. el título de una tarjeta de evento).
 */
export function EnlaceLugar({
  lugar,
  className = "",
  sobreOscuro = false,
}: {
  lugar: Lugar;
  className?: string;
  /** Sobre fondos oscuros (franja verde de la boda especial): el hover va en dorado. */
  sobreOscuro?: boolean;
}) {
  if (!lugar.enGuia) return <span className={className}>{lugar.nombre}</span>;
  const hover = sobreOscuro
    ? "hover:text-dorado hover:decoration-dorado"
    : "hover:text-terracota hover:decoration-terracota";
  return (
    <Link
      href={rutaLugar(lugar.slug)}
      className={`underline decoration-current/30 underline-offset-4 transition-colors ${hover} ${className}`}
    >
      {lugar.nombre}
    </Link>
  );
}
