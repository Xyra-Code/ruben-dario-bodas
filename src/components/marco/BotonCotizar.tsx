"use client";

import Link from "next/link";

import { irAlFormulario } from "@/components/marco/EnlacesNavegacion";
import { clasesBoton } from "@/components/ui/Boton";

/** "Cotizar" del encabezado: baja al formulario de la página (o al de la portada). */
export function BotonCotizar({
  className = "",
  compacto = false,
  alNavegar,
}: {
  className?: string;
  compacto?: boolean;
  alNavegar?: () => void;
}) {
  return (
    <Link
      href="/#contacto"
      onClick={(e) => irAlFormulario(e, alNavegar)}
      className={`${clasesBoton("principal", false, compacto)} ${className}`}
      data-origen="encabezado-cotizar"
    >
      Cotizar
    </Link>
  );
}
