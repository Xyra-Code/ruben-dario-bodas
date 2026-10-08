import { VisorGaleria, type FotoVisor } from "@/components/galeria/VisorGaleria";
import { Foto } from "@/components/ui/Foto";
import type { Evento } from "@/lib/contenido/cargar";
import { obtenerImagen } from "@/lib/imagenes";

/**
 * Galería del evento: foto principal grande + cuadrícula. Cada miniatura es un botón que
 * abre el visor a pantalla completa. Solo la primera foto carga con prioridad (LCP).
 */
export function Galeria({ evento: e }: { evento: Evento }) {
  const fotos: FotoVisor[] = e.fotos.map((f) => {
    const img = obtenerImagen(e.slug, f.archivo);
    return {
      src: img.variantes.at(-1)!.src,
      srcSet: img.variantes.map((v) => `${v.src} ${v.ancho}w`).join(", "),
      alt: f.alt,
      ancho: img.ancho,
      alto: img.alto,
    };
  });

  return (
    <VisorGaleria fotos={fotos}>
      <ul className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
        {e.fotos.map((f, i) => {
          const principal = i === 0;
          return (
            <li key={f.archivo} className={principal ? "col-span-2 lg:row-span-2" : "min-w-0"}>
              <button
                type="button"
                data-indice={i}
                aria-label={`Ver foto ${i + 1} de ${e.fotos.length}: ${f.alt}`}
                className="group block h-full w-full cursor-zoom-in overflow-hidden rounded-sm"
              >
                <Foto
                  evento={e.slug}
                  archivo={f.archivo}
                  alt=""
                  prioridad={principal}
                  sizes={
                    principal ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, 50vw"
                  }
                  className={`h-full w-full object-cover transition-transform duration-700 ease-suave group-hover:scale-[1.03] ${
                    principal ? "aspect-[4/5] sm:aspect-[3/2] lg:aspect-auto" : "aspect-[4/5]"
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </VisorGaleria>
  );
}
