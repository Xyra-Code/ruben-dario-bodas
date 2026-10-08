import Link from "next/link";

import { Foto } from "@/components/ui/Foto";
import type { Evento } from "@/lib/contenido/cargar";
import type { Lugar } from "@/lib/contenido/esquemas";
import { rutaEvento } from "@/lib/rutas";

const NOMBRE_TIPO: Record<Lugar["tipo"], string> = {
  hacienda: "Hacienda",
  finca: "Finca",
  salon: "Salón",
  club: "Club",
  hotel: "Hotel",
  iglesia: "Iglesia",
  "aire-libre": "Aire libre",
  otro: "Lugar",
};

/**
 * Lugar de la guía: foto de un montaje de la empresa allí (si hay), tipo, capacidad y
 * los eventos realizados en ese lugar, enlazados (long-tail "boda en [lugar]").
 */
export function TarjetaLugar({ lugar, eventos }: { lugar: Lugar; eventos: Evento[] }) {
  const conFoto = eventos[0];
  const portada = conFoto?.fotos.find((f) => f.archivo === conFoto.portada);
  return (
    <article className="flex min-w-0 flex-col">
      {conFoto && portada && (
        <Foto
          evento={conFoto.slug}
          archivo={portada.archivo}
          alt={portada.alt}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="aspect-[3/2] w-full rounded-sm object-cover"
        />
      )}
      <p className="mt-4 antetitulo">{NOMBRE_TIPO[lugar.tipo]}</p>
      <h3 className="mt-1 text-titulo-3">{lugar.nombre}</h3>
      {lugar.capacidad && <p className="mt-1 text-sm text-topo">{lugar.capacidad}</p>}
      {eventos.length > 0 && (
        <ul className="mt-3">
          {eventos.map((e) => (
            <li key={e.slug}>
              <Link
                href={rutaEvento(e.slug)}
                className="inline-flex min-h-11 items-center text-terracota underline decoration-terracota/40 underline-offset-4 hover:decoration-terracota"
              >
                {e.titulo}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
