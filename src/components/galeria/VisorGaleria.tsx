"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

import { IconoCerrar, IconoFlecha } from "@/components/ui/Iconos";

export type FotoVisor = { src: string; srcSet: string; alt: string; ancho: number; alto: number };

/**
 * Visor a pantalla completa para la galería. Las miniaturas (children) llegan ya
 * renderizadas desde el servidor como <button data-indice>; aquí solo vive el visor:
 * flechas, teclado (← → Esc), deslizar con el dedo y contador "3 / 18".
 */
export function VisorGaleria({ fotos, children }: { fotos: FotoVisor[]; children: ReactNode }) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [indice, setIndice] = useState<number | null>(null);
  const inicioToque = useRef<number | null>(null);

  const total = fotos.length;
  const mover = useCallback(
    (paso: number) => setIndice((i) => (i === null ? i : (i + paso + total) % total)),
    [total],
  );

  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    if (indice !== null && !d.open) d.showModal();
    if (indice === null && d.open) d.close();
    document.documentElement.style.overflow = indice !== null ? "hidden" : "";
  }, [indice]);

  useEffect(() => {
    if (indice === null) return;
    const teclas = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") mover(1);
      if (e.key === "ArrowLeft") mover(-1);
    };
    window.addEventListener("keydown", teclas);
    return () => window.removeEventListener("keydown", teclas);
  }, [indice, mover]);

  // Abre el visor desde cualquier miniatura (delegación: un solo manejador).
  const abrir = (e: MouseEvent<HTMLDivElement>) => {
    const boton = (e.target as HTMLElement).closest<HTMLElement>("[data-indice]");
    if (boton) setIndice(Number(boton.dataset.indice));
  };

  const alSoltar = (e: PointerEvent) => {
    if (inicioToque.current === null) return;
    const delta = e.clientX - inicioToque.current;
    inicioToque.current = null;
    if (Math.abs(delta) > 50) mover(delta < 0 ? 1 : -1);
  };

  const foto = indice !== null ? fotos[indice] : null;
  // Sin "display" en la base: cada uso decide (inline-flex o hidden sm:inline-flex), así
  // no compiten dos utilidades de display en el mismo elemento.
  const botonClase =
    "size-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20";

  return (
    <>
      <div onClick={abrir}>{children}</div>

      <dialog
        ref={dialogo}
        onClose={() => setIndice(null)}
        aria-label="Visor de fotos"
        className="m-0 h-dvh max-h-none w-full max-w-none bg-[#141210] p-0 text-white backdrop:bg-black/80"
      >
        {foto && (
          <div className="flex h-full flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
            <div className="flex h-16 shrink-0 items-center justify-between px-4">
              <p className="text-sm tracking-wide text-white/80" aria-live="polite">
                {indice! + 1} / {total}
              </p>
              <button
                type="button"
                onClick={() => setIndice(null)}
                aria-label="Cerrar visor"
                className={`inline-flex ${botonClase}`}
              >
                <IconoCerrar />
              </button>
            </div>

            <div
              className="relative flex min-h-0 flex-1 touch-pan-y items-center justify-center px-2 sm:px-20"
              onPointerDown={(e) => (inicioToque.current = e.clientX)}
              onPointerUp={alSoltar}
              onPointerCancel={() => (inicioToque.current = null)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- variantes WebP ya generadas */}
              <img
                key={foto.src}
                src={foto.src}
                srcSet={foto.srcSet}
                sizes="100vw"
                alt={foto.alt}
                width={foto.ancho}
                height={foto.alto}
                className="max-h-full max-w-full object-contain select-none"
                draggable={false}
              />
              {total > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => mover(-1)}
                    aria-label="Foto anterior"
                    className={`${botonClase} absolute left-2 hidden sm:inline-flex`}
                  >
                    <IconoFlecha className="size-5 rotate-180" />
                  </button>
                  <button
                    type="button"
                    onClick={() => mover(1)}
                    aria-label="Foto siguiente"
                    className={`${botonClase} absolute right-2 hidden sm:inline-flex`}
                  >
                    <IconoFlecha className="size-5" />
                  </button>
                </>
              )}
            </div>

            <div className="flex shrink-0 items-center justify-between gap-4 px-4 py-4">
              <p className="min-w-0 text-sm text-white/80">{foto.alt}</p>
              {total > 1 && (
                <div className="flex shrink-0 gap-2 sm:hidden">
                  <button
                    type="button"
                    onClick={() => mover(-1)}
                    aria-label="Foto anterior"
                    className={`inline-flex ${botonClase}`}
                  >
                    <IconoFlecha className="size-5 rotate-180" />
                  </button>
                  <button
                    type="button"
                    onClick={() => mover(1)}
                    aria-label="Foto siguiente"
                    className={`inline-flex ${botonClase}`}
                  >
                    <IconoFlecha className="size-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
