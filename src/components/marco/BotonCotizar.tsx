"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { irAlFormulario } from "@/components/marco/EnlacesNavegacion";
import { clasesBoton } from "@/components/ui/Boton";
import { IconoFecha } from "@/components/ui/Iconos";
import { esPaginaVestidos } from "@/lib/rutas";

/**
 * Botón principal del encabezado. Baja al cierre de la página (o al formulario de la
 * portada) y nombra lo que hay allí: "Cotizar" lleva a un formulario de evento; en las
 * páginas de vestidos, "Agendar cita" lleva a la cita por WhatsApp.
 */
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
  const ruta = usePathname();
  const cita = esPaginaVestidos(ruta);

  return (
    <Link
      href={cita ? `${ruta}#contacto` : "/#contacto"}
      replace={replace}
      onClick={(e) => irAlFormulario(e, alNavegar)}
      className={`${clasesBoton("principal", false, compacto)} ${className}`}
      data-origen={cita ? "encabezado-cita" : "encabezado-cotizar"}
    >
      {/* En el menú de un celular de 320 px, sin ícono para que quepa en una línea. */}
      {cita && <IconoFecha className="size-5 max-[379px]:hidden" />}
      {cita ? "Agendar cita" : "Cotizar"}
    </Link>
  );
}
