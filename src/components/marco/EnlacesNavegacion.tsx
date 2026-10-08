"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";

import { NAVEGACION } from "@/lib/rutas";

/**
 * Lleva al formulario de la página actual si existe (#contacto); si no, al de la portada.
 * Así "Cotizar" en /bodas abre el formulario con "Boda" ya elegido.
 */
export function irAlFormulario(evento: MouseEvent<HTMLAnchorElement>, alNavegar?: () => void) {
  const formulario = document.getElementById("contacto");
  alNavegar?.();
  if (!formulario) return; // sigue el href: /#contacto
  evento.preventDefault();
  formulario.scrollIntoView({ behavior: "smooth", block: "start" });
  formulario
    .querySelector<HTMLInputElement>("input, select, textarea")
    ?.focus({ preventScroll: true });
  history.replaceState(null, "", "#contacto");
}

type Props = {
  /** "barra": horizontal en escritorio. "menu": vertical y grande, en el menú móvil. */
  disposicion: "barra" | "menu";
  alNavegar?: () => void;
};

/** Enlaces principales con el de la página actual marcado (aria-current). */
export function EnlacesNavegacion({ disposicion, alNavegar }: Props) {
  const ruta = usePathname();
  const barra = disposicion === "barra";
  const clase = barra
    ? "relative inline-flex min-h-11 items-center px-1 text-[0.9375rem] tracking-wide text-carbon transition-colors hover:text-terracota aria-[current=page]:text-terracota after:absolute after:inset-x-1 after:bottom-2 after:h-px after:origin-left after:scale-x-0 after:bg-terracota after:transition-transform hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
    : "flex min-h-14 items-center font-titulo text-[2rem] leading-tight text-carbon aria-[current=page]:text-terracota";

  return (
    <ul className={barra ? "flex items-center gap-6 xl:gap-8" : "flex flex-col gap-1"}>
      {NAVEGACION.map((item) => (
        <li key={item.ruta}>
          <Link
            href={item.ruta}
            aria-current={
              ruta === item.ruta || ruta.startsWith(`${item.ruta}/`) ? "page" : undefined
            }
            className={clase}
            onClick={alNavegar}
          >
            {item.nombre}
          </Link>
        </li>
      ))}
      <li>
        <Link href="/#contacto" className={clase} onClick={(e) => irAlFormulario(e, alNavegar)}>
          Contacto
        </Link>
      </li>
    </ul>
  );
}
