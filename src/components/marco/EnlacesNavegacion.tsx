"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";

import { IconoFlecha } from "@/components/ui/Iconos";
import { NAVEGACION, esRutaActual, type ItemNavegacion } from "@/lib/rutas";

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
  // En páginas largas, lo que carga durante el recorrido mueve el destino: al terminar, se
  // realinea para que el formulario no quede bajo el encabezado.
  window.addEventListener(
    "scrollend",
    () => formulario.scrollIntoView({ behavior: "instant", block: "start" }),
    { once: true },
  );
  formulario
    .querySelector<HTMLInputElement>("input, select, textarea")
    ?.focus({ preventScroll: true });
  history.replaceState(null, "", "#contacto");
}

const CLASE_ENLACE =
  "relative inline-flex min-h-11 items-center px-1 text-[0.9375rem] tracking-wide text-carbon transition-colors hover:text-terracota aria-[current=page]:text-terracota after:absolute after:inset-x-1 after:bottom-2 after:h-px after:origin-left after:scale-x-0 after:bg-terracota after:transition-transform hover:after:scale-x-100 aria-[current=page]:after:scale-x-100 group-data-sobre-foto:text-white group-data-sobre-foto:after:bg-white group-data-sobre-foto:hover:text-white/80";

type Props = {
  /** "barra": horizontal en escritorio (el menú móvil tiene sus propios enlaces). */
  disposicion: "barra";
  alNavegar?: () => void;
};

/**
 * Ítem con páginas propias (Vestidos). Se abre con clic, toque o teclado, nunca solo con el
 * cursor; se cierra con Escape (devolviendo el foco), al hacer clic afuera, al salir con
 * Tab o al elegir una página.
 */
function Desplegable({
  item,
  ruta,
  alNavegar,
}: {
  item: ItemNavegacion;
  ruta: string;
  alNavegar?: () => void;
}) {
  const [abierto, setAbierto] = useState(false);
  const contenedor = useRef<HTMLLIElement>(null);
  const boton = useRef<HTMLButtonElement>(null);
  const idPanel = `submenu-${item.ruta.replace(/\W/g, "")}`;

  useEffect(() => {
    if (!abierto) return;
    const alPulsar = (e: PointerEvent) => {
      if (!contenedor.current?.contains(e.target as Node)) setAbierto(false);
    };
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setAbierto(false);
      boton.current?.focus();
    };
    document.addEventListener("pointerdown", alPulsar);
    document.addEventListener("keydown", alTeclear);
    return () => {
      document.removeEventListener("pointerdown", alPulsar);
      document.removeEventListener("keydown", alTeclear);
    };
  }, [abierto]);

  return (
    <li
      ref={contenedor}
      className="relative"
      onBlur={(e) => {
        // El foco salió del ítem (Tab). relatedTarget es null al cambiar de ventana: no cierra.
        if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget)) setAbierto(false);
      }}
    >
      <button
        ref={boton}
        type="button"
        onClick={() => setAbierto((a) => !a)}
        aria-expanded={abierto}
        aria-controls={idPanel}
        aria-current={esRutaActual(item.ruta, ruta) ? "page" : undefined}
        className={`${CLASE_ENLACE} gap-1.5`}
      >
        {item.nombre}
        <IconoFlecha
          className={`size-3.5 transition-transform duration-200 ${abierto ? "-rotate-90" : "rotate-90"}`}
        />
      </button>
      <ul
        id={idPanel}
        hidden={!abierto}
        className="absolute top-full left-1/2 mt-1 w-max min-w-52 -translate-x-1/2 rounded-sm border border-linea bg-superficie py-2 shadow-[0_12px_30px_-12px_rgba(42,30,27,0.35)]"
      >
        {item.hijos!.map((h) => (
          <li key={h.ruta}>
            <Link
              href={h.ruta}
              aria-current={h.ruta === ruta ? "page" : undefined}
              onClick={() => {
                setAbierto(false);
                alNavegar?.();
              }}
              className="flex min-h-11 items-center px-4 text-[0.9375rem] text-carbon transition-colors hover:bg-rubor hover:text-terracota aria-[current=page]:text-terracota"
            >
              {h.nombre}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

/** Enlaces principales con el de la página actual marcado (aria-current). */
export function EnlacesNavegacion({ alNavegar }: Props) {
  const ruta = usePathname();

  return (
    <ul className="flex items-center gap-6 xl:gap-8">
      {NAVEGACION.map((item) =>
        item.hijos ? (
          <Desplegable key={item.ruta} item={item} ruta={ruta} alNavegar={alNavegar} />
        ) : (
          <li key={item.ruta}>
            <Link
              href={item.ruta}
              aria-current={esRutaActual(item.ruta, ruta) ? "page" : undefined}
              className={CLASE_ENLACE}
              onClick={alNavegar}
            >
              {item.nombre}
            </Link>
          </li>
        ),
      )}
    </ul>
  );
}
