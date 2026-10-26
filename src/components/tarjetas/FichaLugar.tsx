import Link from "next/link";

import { Foto } from "@/components/ui/Foto";
import { IconoFlecha } from "@/components/ui/Iconos";
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

const DE_QUIEN = { boda: "Boda de", quince: "15 años de", otro: "Evento de" } as const;

/** Nombre corto de un evento para su miniatura: "Boda de Isa & Carlos" o su título. */
const etiqueta = (e: Evento) => (e.nombres ? `${DE_QUIEN[e.tipo]} ${e.nombres}` : e.titulo);

/**
 * PRUEBA (2026-10-16): ficha de un lugar en la guía. Foto grande de un montaje allí (otra
 * que no sea la portada de un evento, para no repetirla en las miniaturas) y, al lado, el
 * tipo, el nombre, cuántas bodas se diseñaron ahí y cada una como miniatura con foto
 * (long-tail "boda en [lugar]"). Cada lugar va en su propia tarjeta (fondo, borde y aire)
 * para que no se confunda con el siguiente. La foto alterna de lado; en celular se apila.
 */
export function FichaLugar({
  lugar,
  eventos,
  invertida = false,
}: {
  lugar: Lugar;
  eventos: Evento[];
  invertida?: boolean;
}) {
  const primero = eventos[0];
  // Foto grande: la primera horizontal que no sea la portada; si no hay, la portada.
  const grande =
    primero?.fotos.find(
      (f) => f.archivo !== primero.portada && /salon|mesa|montaje|vista/.test(f.archivo),
    ) ?? primero?.fotos.find((f) => f.archivo === primero.portada);
  const cuantas = eventos.length;

  return (
    // id = slug: cada mención del lugar en el sitio enlaza aquí (EnlaceLugar). Al llegar por
    // el enlace, el salto deja aire bajo el encabezado fijo y la ficha se marca en dorado.
    <article
      id={lugar.slug}
      className="grid min-w-0 scroll-mt-28 items-center gap-6 rounded-sm border border-linea bg-superficie p-4 shadow-[0_1px_24px_rgba(43,39,36,0.05)] target:border-dorado target:ring-1 target:ring-dorado sm:p-6 lg:grid-cols-12 lg:gap-10 lg:p-8"
    >
      {primero && grande && (
        <Link
          href={rutaEvento(primero.slug)}
          className={`group block min-w-0 overflow-hidden rounded-sm lg:col-span-7 ${invertida ? "lg:order-2" : ""}`}
          aria-label={`Ver ${primero.titulo}`}
        >
          <Foto
            evento={primero.slug}
            archivo={grande.archivo}
            alt={grande.alt}
            posicion={grande.encuadre}
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="aspect-[3/2] w-full object-cover transition-transform duration-700 ease-suave group-hover:scale-[1.03]"
          />
        </Link>
      )}

      <div className="min-w-0 lg:col-span-5">
        <p className="antetitulo">
          {NOMBRE_TIPO[lugar.tipo]} · {lugar.municipio}
        </p>
        <h3 className="mt-2 text-titulo-2">{lugar.nombre}</h3>
        {lugar.capacidad && <p className="mt-2 text-topo">{lugar.capacidad}</p>}
        {cuantas > 0 && (
          <p className="mt-3 text-topo">
            {cuantas === 1 ? "1 boda diseñada aquí" : `${cuantas} bodas diseñadas aquí`}
          </p>
        )}

        {cuantas > 0 && (
          // Miniaturas en cuadrícula fija, sin deslizar: filas de 3; con 4 bodas, 2×2 para que
          // no quede una sola abajo.
          <ul
            className={`mt-6 grid gap-2 sm:gap-3 ${cuantas === 4 ? "max-w-xs grid-cols-2 sm:max-w-sm" : "grid-cols-3"}`}
          >
            {eventos.map((e) => {
              const portada = e.fotos.find((f) => f.archivo === e.portada)!;
              return (
                <li key={e.slug} className="min-w-0">
                  <Link href={rutaEvento(e.slug)} className="group block min-w-0">
                    <span className="block overflow-hidden rounded-sm">
                      <Foto
                        evento={e.slug}
                        archivo={portada.archivo}
                        alt=""
                        posicion={portada.encuadre}
                        sizes="(min-width: 640px) 180px, 128px"
                        className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-suave group-hover:scale-[1.04]"
                      />
                    </span>
                    <span className="mt-1.5 flex items-start gap-1 text-xs leading-snug text-carbon group-hover:text-terracota sm:mt-2 sm:text-sm">
                      <span className="min-w-0">{etiqueta(e)}</span>
                      <IconoFlecha className="mt-0.5 size-3.5 shrink-0" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </article>
  );
}
