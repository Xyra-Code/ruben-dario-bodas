import { Foto } from "@/components/ui/Foto";
import type { Evento } from "@/lib/contenido/cargar";

export type FotoCollage = {
  evento: Evento;
  foto: Evento["fotos"][number];
};

/**
 * Collage de la portada de la guía de lugares: 3 montajes en lugares distintos, uno grande
 * y dos pequeños al lado. Cada foto lleva el nombre del lugar y baja a su ficha (#slug).
 * El collage tiene proporción fija (4:3) para que no haya saltos al cargar; las fotos la
 * llenan con object-cover. La grande es la del LCP: carga con prioridad.
 */
export function CollageLugares({ fotos }: { fotos: FotoCollage[] }) {
  return (
    <ul className="grid aspect-[4/3] w-full grid-cols-3 grid-rows-2 gap-2 sm:gap-3">
      {fotos.map(({ evento, foto }, i) => (
        <li
          key={`${evento.slug}/${foto.archivo}`}
          className={`relative min-h-0 min-w-0 overflow-hidden rounded-sm ${i === 0 ? "col-span-2 row-span-2" : ""}`}
        >
          <a href={`#${evento.lugar.slug}`} className="group block h-full">
            <Foto
              evento={evento.slug}
              archivo={foto.archivo}
              alt={foto.alt}
              posicion={foto.encuadre}
              prioridad={i === 0}
              sizes={i === 0 ? "(min-width: 1024px) 38vw, 66vw" : "(min-width: 1024px) 19vw, 33vw"}
              className="h-full w-full object-cover transition-transform duration-700 ease-suave group-hover:scale-[1.03]"
            />
            <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(42,30,27,0.75),rgba(42,30,27,0))] px-2.5 pt-8 pb-2 text-xs leading-snug text-white [text-shadow:0_1px_2px_rgba(42,30,27,0.6)] sm:px-4 sm:pb-3 sm:text-sm">
              <span className={i === 0 ? "line-clamp-2" : "line-clamp-3"}>
                {evento.lugar.nombre}
                {i === 0 && <span className="text-white/80"> · {evento.lugar.municipio}</span>}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
