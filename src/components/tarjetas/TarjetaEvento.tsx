import Link from "next/link";

import { Etiqueta } from "@/components/ui/Etiqueta";
import { Foto } from "@/components/ui/Foto";
import type { Evento } from "@/lib/contenido/cargar";
import { rutaEvento } from "@/lib/rutas";

type Props = {
  evento: Evento;
  /** Ancho que ocupa la tarjeta en la grilla donde se usa (para elegir el archivo justo). */
  sizes: string;
  /** Nivel del título según la página (h2 en /eventos, h3 dentro de una sección). */
  nivel?: "h2" | "h3";
};

/**
 * Tarjeta de evento: foto 4:5, tipo, título ("Boda en Hacienda El Caney") y municipio · año.
 * Toda la tarjeta es un enlace; el hover acerca un poco la foto (es clicable de verdad).
 */
export function TarjetaEvento({ evento: e, sizes, nivel: Titulo = "h3" }: Props) {
  const portada = e.fotos.find((f) => f.archivo === e.portada)!;
  return (
    <article className="group relative min-w-0">
      <div className="relative overflow-hidden rounded-sm">
        <Foto
          evento={e.slug}
          archivo={portada.archivo}
          alt={portada.alt}
          sizes={sizes}
          className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-suave group-hover:scale-[1.03]"
        />
        <div className="absolute top-3 left-3">
          <Etiqueta tipo={e.tipo} sobreFoto />
        </div>
      </div>
      <Titulo className="mt-4 font-titulo text-[1.125rem] leading-snug sm:text-titulo-3">
        <Link
          href={rutaEvento(e.slug)}
          className="after:absolute after:inset-0 after:rounded-sm hover:text-terracota focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-terracota"
        >
          {e.titulo}
        </Link>
      </Titulo>
      <p className="mt-1 text-sm text-topo">
        {e.estilo} · {e.fecha.slice(0, 4)}
      </p>
    </article>
  );
}
