"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";

import { IconoFlecha } from "@/components/ui/Iconos";

/**
 * Fila de testimonios estilo revista: sin barra de scroll, con contador "03 / 20", una
 * línea dorada que avanza y botones ‹ ›. Con mouse se puede arrastrar (manito de
 * arrastrar); en celular se desliza con el dedo como siempre. Las tarjetas (children,
 * <li>) llegan ya renderizadas desde el servidor.
 */
export function CarruselTestimonios({ total, children }: { total: number; children: ReactNode }) {
  const pista = useRef<HTMLUListElement>(null);
  const arrastre = useRef<{ x: number; scroll: number; movido: boolean } | null>(null);
  const recienArrastrado = useRef(false);
  const [actual, setActual] = useState(1);
  const [progreso, setProgreso] = useState(0);
  const [bordes, setBordes] = useState({ inicio: true, fin: false });

  const medir = useCallback(() => {
    const p = pista.current;
    if (!p) return;
    const max = p.scrollWidth - p.clientWidth;
    const tarjetas = Array.from(p.children) as HTMLElement[];
    const paso = tarjetas[1] ? tarjetas[1].offsetLeft - tarjetas[0].offsetLeft : p.clientWidth;
    // Al llegar al final, el contador marca la última aunque no quede alineada a la izquierda.
    const indice = p.scrollLeft >= max - 2 ? total : Math.round(p.scrollLeft / paso) + 1;
    setActual(Math.min(total, Math.max(1, indice)));
    setProgreso(max > 0 ? p.scrollLeft / max : 1);
    setBordes({ inicio: p.scrollLeft <= 2, fin: p.scrollLeft >= max - 2 });
  }, [total]);

  useEffect(() => {
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, [medir]);

  const suave = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

  const mover = (direccion: 1 | -1) => {
    const p = pista.current;
    const tarjeta = p?.children[0] as HTMLElement | undefined;
    if (!p || !tarjeta) return;
    const paso = tarjeta.getBoundingClientRect().width + parseFloat(getComputedStyle(p).columnGap);
    p.scrollBy({ left: direccion * paso, behavior: suave() });
  };

  // Arrastre con mouse (el dedo ya desliza de forma nativa). Durante el arrastre se apaga
  // el snap; al soltar, se alinea a la tarjeta más cercana.
  const alPresionar = (e: PointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0 || !pista.current) return;
    arrastre.current = { x: e.clientX, scroll: pista.current.scrollLeft, movido: false };
  };
  const alMover = (e: PointerEvent<HTMLUListElement>) => {
    const a = arrastre.current;
    const p = pista.current;
    if (!a || !p) return;
    const dx = e.clientX - a.x;
    if (!a.movido && Math.abs(dx) < 5) return;
    if (!a.movido) {
      a.movido = true;
      p.setPointerCapture(e.pointerId);
      p.style.scrollSnapType = "none";
      p.dataset.arrastrando = "true";
    }
    p.scrollLeft = a.scroll - dx;
  };
  const alSoltar = () => {
    const a = arrastre.current;
    const p = pista.current;
    arrastre.current = null;
    if (!a?.movido || !p) return;
    delete p.dataset.arrastrando;
    const tarjetas = Array.from(p.children) as HTMLElement[];
    const inicio = tarjetas[0]?.offsetLeft ?? 0;
    const cercana = tarjetas.reduce((mejor, t) =>
      Math.abs(t.offsetLeft - inicio - p.scrollLeft) <
      Math.abs(mejor.offsetLeft - inicio - p.scrollLeft)
        ? t
        : mejor,
    );
    p.scrollTo({ left: cercana.offsetLeft - inicio, behavior: suave() });
    // El snap vuelve cuando termina la animación, para que no la corte.
    window.setTimeout(() => (p.style.scrollSnapType = ""), 500);
    // Un arrastre no debe abrir el enlace sobre el que se soltó (el clic llega justo después).
    recienArrastrado.current = true;
    window.setTimeout(() => (recienArrastrado.current = false), 0);
  };

  const boton =
    "grid size-12 place-items-center rounded-full border border-carbon/20 text-carbon transition-colors duration-300 hover:border-terracota hover:bg-terracota hover:text-white disabled:pointer-events-none disabled:opacity-30";

  return (
    <div className="relative mt-12">
      <ul
        ref={pista}
        tabIndex={0}
        aria-label="Testimonios: desliza o usa las flechas para ver más"
        onScroll={medir}
        onPointerDown={alPresionar}
        onPointerMove={alMover}
        onPointerUp={alSoltar}
        onPointerCancel={alSoltar}
        onClickCapture={(e) => {
          if (recienArrastrado.current) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        // Sin barra (la posición la muestran el contador y la línea); con mouse, manito de arrastrar.
        className="-mx-(--gutter) flex snap-x snap-mandatory scroll-px-(--gutter) scrollbar-none gap-4 overflow-x-auto overscroll-x-contain px-(--gutter) pb-2 select-none data-arrastrando:cursor-grabbing sm:gap-6 [&_a]:cursor-pointer [&::-webkit-scrollbar]:hidden [@media(hover:hover)_and_(pointer:fine)]:cursor-grab"
      >
        {children}
      </ul>

      <div className="mt-8 flex items-center gap-5 sm:gap-8">
        <p className="shrink-0 font-titulo text-titulo-3 tabular-nums" aria-live="polite">
          {String(actual).padStart(2, "0")}
          <span className="text-topo"> / {String(total).padStart(2, "0")}</span>
        </p>
        <div className="relative h-px min-w-0 flex-1 bg-linea" aria-hidden="true">
          <div
            className="absolute top-1/2 left-0 h-0.75 -translate-y-1/2 bg-dorado transition-[width] duration-300 ease-suave"
            style={{ width: `${Math.max(progreso, 1 / total) * 100}%` }}
          />
        </div>
        <div className="hidden shrink-0 gap-3 md:flex">
          <button
            type="button"
            className={boton}
            onClick={() => mover(-1)}
            disabled={bordes.inicio}
            aria-label="Testimonio anterior"
          >
            <IconoFlecha className="size-5 rotate-180" />
          </button>
          <button
            type="button"
            className={boton}
            onClick={() => mover(1)}
            disabled={bordes.fin}
            aria-label="Testimonio siguiente"
          >
            <IconoFlecha className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
