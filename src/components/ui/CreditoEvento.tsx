import Link from "next/link";

import { obtenerEvento } from "@/lib/contenido/cargar";
import { rutaEvento } from "@/lib/rutas";

type Props = {
  /** Slug del evento del que sale la foto. */
  evento: string;
  /**
   * Enlaza a la página del evento. No usarlo dentro de un elemento que ya es un enlace
   * (TarjetaServicio: toda la tarjeta lleva a su servicio).
   */
  enlace?: boolean;
};

/**
 * Pie de foto con el evento de donde sale, DENTRO de la foto (abajo, sobre un velo oscuro
 * para que se lea sobre cualquier imagen). El padre debe ser `relative`: un <figure> con
 * la foto. Se usa donde una foto del portafolio ilustra un servicio.
 */
export function CreditoEvento({ evento, enlace = false }: Props) {
  const e = obtenerEvento(evento);
  if (!e) return null;
  const clases =
    "block min-w-0 px-3 pt-8 pb-2.5 text-xs leading-snug text-white/90 [text-shadow:0_1px_2px_rgba(42,30,27,0.6)] sm:px-4 sm:pb-3 sm:text-sm";

  return (
    <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-sm bg-[linear-gradient(to_top,rgba(42,30,27,0.7),rgba(42,30,27,0))]">
      {enlace ? (
        <Link
          href={rutaEvento(e.slug)}
          className={`${clases} pointer-events-auto flex min-h-11 items-end underline-offset-2 hover:text-white hover:underline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white`}
        >
          <span className="line-clamp-2">{e.titulo}</span>
        </Link>
      ) : (
        <span className={clases}>
          <span className="line-clamp-2">{e.titulo}</span>
        </span>
      )}
    </figcaption>
  );
}
