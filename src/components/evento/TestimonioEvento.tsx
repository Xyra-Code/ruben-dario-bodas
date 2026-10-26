import Link from "next/link";

import { ConAmpersand } from "@/components/ui/ConAmpersand";
import { Foto } from "@/components/ui/Foto";
import type { Evento } from "@/lib/contenido/cargar";
import type { Testimonio } from "@/lib/contenido/esquemas";
import { rutaEvento } from "@/lib/rutas";
import { fotoDelTestimonio } from "@/lib/testimonios";

/**
 * Testimonio en dos columnas: una foto de la pareja en vertical (4:5, con un filete dorado
 * desplazado detrás; nunca la portada, ver fotoDelTestimonio) y la cita con la firma.
 * En celular la tarjeta de la cita se monta sobre el borde inferior de la foto.
 * En escritorio la foto va siempre a la derecha: en la página del evento, a la izquierda y
 * más arriba está la firma con la foto de Rubén Darío, y no deben quedar alineadas.
 * Lo usan la página del evento y el testimonio destacado del inicio (`corto`: el extracto;
 * `enlazar`: el nombre del evento lleva a su página).
 */
export function TestimonioEvento({
  evento: e,
  testimonio: t,
  corto = false,
  enlazar = false,
}: {
  evento: Evento;
  testimonio: Testimonio;
  corto?: boolean;
  enlazar?: boolean;
}) {
  const foto = fotoDelTestimonio(e, t);
  const texto = corto ? (t.extracto ?? t.texto) : t.texto;
  // Los testimonios rondan los 350 caracteres; uno mucho más largo baja de tamaño
  // para no convertirse en un muro de texto junto a la foto.
  const largo = texto.length > 600;

  return (
    <figure className="grid items-center lg:grid-cols-12 lg:gap-16">
      <div className="relative mx-auto w-full max-w-md min-w-0 lg:order-2 lg:col-span-5 lg:max-w-none">
        <span
          aria-hidden="true"
          className="absolute inset-0 translate-x-3 translate-y-3 border border-dorado sm:translate-x-4 sm:translate-y-4 lg:-translate-x-4"
        />
        <Foto
          evento={e.slug}
          archivo={foto.archivo}
          alt={foto.alt}
          sizes="(min-width: 1024px) 40vw, (min-width: 448px) 28rem, 100vw"
          className="relative aspect-[4/5] w-full rounded-sm object-cover"
          posicion={foto.posicion}
        />
      </div>

      <div className="relative z-10 mx-4 -mt-16 min-w-0 rounded-sm bg-superficie p-6 shadow-[0_12px_40px_-20px_rgb(0_0_0/0.25)] sm:mx-8 sm:p-8 lg:col-span-7 lg:mx-0 lg:mt-0 lg:bg-transparent lg:p-0 lg:shadow-none">
        <span
          aria-hidden="true"
          className="block font-titulo text-6xl leading-none text-dorado lg:text-7xl"
        >
          “
        </span>
        <blockquote
          className={`mt-2 font-titulo text-carbon ${
            largo ? "text-lg leading-snug sm:text-xl" : "text-titulo-3"
          }`}
        >
          <p>{texto}</p>
        </blockquote>
        <figcaption className="mt-8 flex items-center gap-4">
          <span aria-hidden="true" className="h-px w-10 shrink-0 bg-dorado" />
          <span className="min-w-0">
            <span className="block font-titulo text-titulo-3">
              <ConAmpersand texto={t.autor} />
            </span>
            {enlazar ? (
              <Link
                href={rutaEvento(e.slug)}
                className="mt-1 inline-flex min-h-11 items-center gap-1.5 text-sm text-terracota underline-offset-4 hover:underline"
              >
                <span className="min-w-0">{e.titulo}</span>
                <span aria-hidden="true">→</span>
              </Link>
            ) : (
              <span className="mt-1 block text-sm text-topo">{e.titulo}</span>
            )}
          </span>
        </figcaption>
      </div>
    </figure>
  );
}
