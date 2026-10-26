import Link from "next/link";

import { ConAmpersand } from "@/components/ui/ConAmpersand";
import { Foto } from "@/components/ui/Foto";
import type { Evento } from "@/lib/contenido/cargar";
import type { Testimonio } from "@/lib/contenido/esquemas";
import { rutaEvento } from "@/lib/rutas";
import { fotoDelTestimonio, fraseCorta } from "@/lib/testimonios";

/**
 * Testimonio corto del inicio: la foto de la pareja en vertical (4:5, con las esquinas de
 * todas las fotos del sitio), una frase (no el párrafo completo) y la firma, que lleva a
 * la boda. Toda la tarjeta es el enlace.
 */
export function TarjetaTestimonio({
  evento: e,
  testimonio: t,
}: {
  evento: Evento;
  testimonio: Testimonio;
}) {
  const foto = fotoDelTestimonio(e, t);
  return (
    <figure className="group relative flex h-full min-w-0 flex-col rounded-sm border border-linea bg-superficie/60 p-6 sm:p-7">
      <span aria-hidden="true" className="block font-titulo text-5xl leading-none text-dorado">
        “
      </span>
      <blockquote className="flex-1 font-titulo text-xl leading-snug text-carbon">
        <p>{fraseCorta(t)}</p>
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-4">
        <Foto
          evento={e.slug}
          archivo={foto.archivo}
          alt=""
          sizes="64px"
          className="aspect-[4/5] w-16 shrink-0 rounded-sm object-cover"
          posicion={foto.posicion}
        />
        <span className="min-w-0">
          <span className="block font-medium text-carbon">
            <ConAmpersand texto={t.autor} />
          </span>
          <Link
            href={rutaEvento(e.slug)}
            className="mt-0.5 block text-sm text-terracota group-hover:underline after:absolute after:inset-0 after:rounded-sm focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-terracota"
          >
            {e.titulo}
          </Link>
        </span>
      </figcaption>
    </figure>
  );
}
