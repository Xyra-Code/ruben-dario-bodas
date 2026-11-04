"use client";

import { useRef, type ReactNode, type SyntheticEvent } from "react";

/**
 * Resalta una zona en el mapa y en la lista a la vez. Con mouse, al pasar por encima; con
 * el dedo, al tocar (y se queda fijada hasta tocar otra vez). Marca con data-on los
 * elementos [data-zona] de esa zona y con data-activa el contenedor; los estilos van en
 * las clases (variantes data-on y group-data-activa/mapa). Todo el contenido llega
 * renderizado desde el servidor: aquí solo hay unos atributos que cambian.
 */
export function ZonasInteractivas({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const raiz = useRef<HTMLDivElement>(null);
  const fijada = useRef<string | null>(null);

  const activar = (zona: string | null) => {
    const el = raiz.current;
    if (!el) return;
    if (zona) el.dataset.activa = zona;
    else delete el.dataset.activa;
    el.querySelectorAll<HTMLElement | SVGElement>("[data-zona]").forEach((n) =>
      n.toggleAttribute("data-on", n.dataset.zona === zona),
    );
  };

  const zonaDe = (e: SyntheticEvent) =>
    (e.target as Element).closest<HTMLElement | SVGElement>("[data-zona]")?.dataset.zona ?? null;

  return (
    <div
      ref={raiz}
      className={`group/mapa ${className}`}
      onPointerOver={(e) => {
        if (e.pointerType === "mouse") activar(zonaDe(e) ?? fijada.current);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") activar(fijada.current);
      }}
      onClick={(e) => {
        const zona = zonaDe(e);
        fijada.current = zona === fijada.current ? null : zona;
        activar(fijada.current);
      }}
    >
      {children}
    </div>
  );
}
