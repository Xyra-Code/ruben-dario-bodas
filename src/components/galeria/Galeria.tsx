import type { CSSProperties } from "react";

import { FilasJustificadas } from "@/components/galeria/FilasJustificadas";
import { VisorGaleria, type FotoVisor } from "@/components/galeria/VisorGaleria";
import { Foto } from "@/components/ui/Foto";
import type { Evento } from "@/lib/contenido/cargar";
import { obtenerImagen } from "@/lib/imagenes";

/**
 * Galería del evento como un álbum: filas justificadas, cada foto completa en su formato
 * original (horizontal o vertical). El corte de las filas lo calcula FilasJustificadas
 * (todas de alto parecido, también la última). Antes de que cargue, acomodo solo con CSS:
 *   - Cada foto parte de un ancho = proporción × alto de fila (--alto-fila) y crece en la
 *     misma proporción, así todas las de una fila quedan con la misma altura.
 *   - El ::after con crecimiento enorme evita que la última fila se estire.
 * Las medidas reales vienen del manifiesto (no hay saltos al cargar). Cada foto es un botón
 * que abre el visor a pantalla completa. Solo la primera carga con prioridad (LCP).
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
      <FilasJustificadas className="flex flex-wrap gap-2 [--alto-fila:11rem] after:grow-[999999] after:content-[''] sm:gap-3 sm:[--alto-fila:13rem] lg:[--alto-fila:16rem]">
        {e.fotos.map((f, i) => {
          const proporcion = fotos[i].ancho / fotos[i].alto;
          const caja: CSSProperties = {
            flexGrow: proporcion,
            flexBasis: `calc(var(--alto-fila) * ${proporcion.toFixed(4)})`,
          };
          return (
            <li
              key={f.archivo}
              className="min-w-0"
              style={caja}
              data-proporcion={proporcion.toFixed(4)}
            >
              <button
                type="button"
                data-indice={i}
                aria-label={`Ver foto ${i + 1} de ${e.fotos.length}: ${f.alt}`}
                className="group block w-full cursor-zoom-in overflow-hidden rounded-sm"
              >
                <Foto
                  evento={e.slug}
                  archivo={f.archivo}
                  alt=""
                  prioridad={i === 0}
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="w-full transition-transform duration-700 ease-suave group-hover:scale-[1.03]"
                />
              </button>
            </li>
          );
        })}
      </FilasJustificadas>
    </VisorGaleria>
  );
}
