"use client";

import Link from "next/link";

import { irAlFormulario } from "@/components/marco/EnlacesNavegacion";
import { clasesBoton } from "@/components/ui/Boton";
import { IconoFecha } from "@/components/ui/Iconos";

/** "Cotizar" del encabezado: baja al formulario de la página (o al de la portada). */
export function BotonCotizar({
  className = "",
  compacto = false,
  replace = false,
  alNavegar,
}: {
  className?: string;
  compacto?: boolean;
  /** Desde el menú móvil: ocupa su paso del historial en vez de agregar otro. */
  replace?: boolean;
  alNavegar?: () => void;
}) {
  return (
    <Link
      href="/#contacto"
      replace={replace}
      onClick={(e) => irAlFormulario(e, alNavegar)}
      className={`${clasesBoton("principal", false, compacto)} ${className}`}
      data-origen="encabezado-cotizar"
    >
      <IconoFecha />
      Cotizar
    </Link>
  );
}
