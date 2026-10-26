import { fotosVisor } from "@/components/galeria/Galeria";
import { VisorGaleria } from "@/components/galeria/VisorGaleria";
import { Foto } from "@/components/ui/Foto";
import type { Evento } from "@/lib/contenido/cargar";

/**
 * PRUEBA (2026-10-25): mosaico al entrar a un evento, para que lo primero que se vea sean
 * fotos (como las fichas de Airbnb o las revistas de bodas). La portada grande y las cuatro
 * fotos siguientes; cada una abre el visor en esa foto y la última dice "Ver las N fotos".
 * - Escritorio (md+): cuadrícula 4 × 2, la portada ocupa la mitad izquierda.
 * - Celular: la portada a lo ancho y las cuatro en una fila de miniaturas debajo.
 * Se activa con MOSAICO en src/app/eventos/[slug]/page.tsx.
 */
export function MosaicoEvento({ evento: e }: { evento: Evento }) {
  const fotos = fotosVisor(e);
  const iPortada = e.fotos.findIndex((f) => f.archivo === e.portada);
  const otras = e.fotos
    .map((f, i) => ({ f, i }))
    .filter(({ i }) => i !== iPortada)
    .slice(0, 4);
  const total = e.fotos.length;
  const boton = "group relative block h-full w-full cursor-zoom-in overflow-hidden rounded-sm";
  const zoom = "transition-transform duration-700 ease-suave group-hover:scale-[1.03]";

  return (
    <VisorGaleria fotos={fotos}>
      <ul className="grid grid-cols-4 gap-2 sm:gap-3 md:aspect-[2/1] md:max-h-[min(34rem,calc(100dvh-21rem))] md:w-full md:grid-rows-2">
        <li className="col-span-4 min-w-0 md:col-span-2 md:row-span-2">
          <button
            type="button"
            data-indice={iPortada}
            aria-label={`Ver foto 1 de ${total}: ${e.fotos[iPortada].alt}`}
            className={boton}
          >
            <Foto
              evento={e.slug}
              archivo={e.portada}
              alt=""
              posicion={e.fotos[iPortada].encuadre}
              prioridad
              sizes="(min-width: 768px) 50vw, 100vw"
              className={`aspect-[4/5] max-h-[60svh] w-full object-cover md:aspect-auto md:h-full md:max-h-none ${zoom}`}
            />
          </button>
        </li>
        {otras.map(({ f, i }, n) => {
          const ultima = n === otras.length - 1;
          return (
            <li key={f.archivo} className="min-w-0">
              <button
                type="button"
                data-indice={i}
                aria-label={
                  ultima ? `Ver las ${total} fotos` : `Ver foto ${n + 2} de ${total}: ${f.alt}`
                }
                className={boton}
              >
                <Foto
                  evento={e.slug}
                  archivo={f.archivo}
                  alt=""
                  posicion={f.encuadre}
                  sizes="(min-width: 768px) 25vw, 25vw"
                  className={`aspect-square w-full object-cover md:aspect-auto md:h-full ${zoom}`}
                />
                {ultima && (
                  <span className="absolute inset-0 flex items-center justify-center bg-carbon/45 px-1 text-center text-xs font-medium text-white sm:text-sm">
                    Ver las {total} fotos
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </VisorGaleria>
  );
}
