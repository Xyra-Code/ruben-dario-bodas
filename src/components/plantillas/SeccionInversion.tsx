import { Boton } from "@/components/ui/Boton";
import { Foto } from "@/components/ui/Foto";
import {
  IconoFlecha,
  IconoFlor,
  IconoInvitados,
  IconoLugar,
  IconoTematica,
} from "@/components/ui/Iconos";
import { obtenerEvento } from "@/lib/contenido/cargar";
import type { Servicio } from "@/lib/contenido/esquemas";

const ICONOS = {
  invitados: IconoInvitados,
  lugar: IconoLugar,
  diseno: IconoFlor,
  tematica: IconoTematica,
} as const;

type Props = {
  inversion: Servicio["inversion"];
  /** Texto del botón: "Cotizar mi boda". */
  cotizar: string;
  /** Para la analítica: "bodas-inversion". */
  origen: string;
  /** Clase de fondo que le toca en el ritmo de la página (se ve en el celular). */
  fondo: string;
};

/**
 * Inversión de /bodas y /quince-anos: el precio "desde" en una tarjeta y, al lado, qué
 * hace variar el valor. Es la única sección de la página sobre foto, para que el precio
 * no pase de largo justo antes de los testimonios y el formulario.
 * - Celular: la foto como banda, la tarjeta montada sobre su borde y los factores debajo.
 * - Escritorio: la foto de fondo con un velo terracota; tarjeta a la izquierda, factores
 *   en marfil a la derecha.
 */
export function SeccionInversion({ inversion, cotizar, origen, fondo }: Props) {
  const evento = obtenerEvento(inversion.foto.evento);
  const foto = evento?.fotos.find((f) => f.archivo === inversion.foto.archivo);

  // "30 millones de pesos": la cifra grande y "de pesos" debajo, más pequeño.
  const partes = inversion.desde.match(/^(.*\S)\s+(de pesos)$/i);
  const cifra = partes ? partes[1] : inversion.desde;
  const unidad = partes ? partes[2] : null;

  return (
    <section
      aria-labelledby="inversion-titulo"
      className={`relative isolate overflow-hidden ${fondo} ${foto ? "" : "py-(--spacing-seccion)"}`}
    >
      {foto && (
        <div className="relative -z-10 aspect-[4/3] sm:aspect-[21/9] lg:absolute lg:inset-0 lg:aspect-auto">
          <Foto
            evento={inversion.foto.evento}
            archivo={foto.archivo}
            alt=""
            sizes="100vw"
            posicion={foto.encuadre}
            className="h-full w-full object-cover"
          />
          {/* Velo: oscuro detrás de la tarjeta, terracota profundo detrás de los factores
              (texto marfil, contraste AA sobre cualquier foto). */}
          <div
            aria-hidden="true"
            className="absolute inset-0 hidden bg-[linear-gradient(100deg,color-mix(in_oklab,var(--c-ink)_55%,transparent)_0%,color-mix(in_oklab,var(--c-primary-hover)_80%,transparent)_55%,color-mix(in_oklab,var(--c-primary-hover)_92%,transparent)_100%)] lg:block"
          />
        </div>
      )}

      <div
        className={`relative contenedor ${foto ? "pb-(--spacing-seccion) lg:py-(--spacing-seccion)" : ""}`}
      >
        <div className="grid gap-12 lg:grid-cols-[minmax(0,27rem)_minmax(0,1fr)] lg:items-center lg:gap-20">
          {/* Tarjeta del precio */}
          <div
            className={`relative mx-auto w-full max-w-md min-w-0 rounded-sm border border-linea bg-superficie px-6 py-10 text-center shadow-[0_24px_60px_-28px_rgba(42,30,27,0.45)] sm:px-10 ${
              foto ? "-mt-20 sm:-mt-28 lg:mt-0" : ""
            }`}
          >
            <p className="antetitulo">Inversión</p>
            <h2 id="inversion-titulo" className="mt-5 font-titulo text-carbon">
              <span className="block text-titulo-3 text-topo italic">Desde</span>{" "}
              <span className="mt-1 block text-[clamp(2.75rem,2rem+3.5vw,4.25rem)] leading-[1.02] [overflow-wrap:anywhere] text-terracota">
                {cifra}
              </span>
              {unidad && (
                <>
                  {" "}
                  <span className="mt-2 block text-titulo-3">{unidad}</span>
                </>
              )}
            </h2>
            <div className="mx-auto mt-7 filete-dorado w-24" />
            <p className="mx-auto mt-6 max-w-xs text-topo">{inversion.nota}</p>
            <div className="mt-8">
              <Boton href="#contacto" origen={origen} ancho>
                {cotizar}
                <IconoFlecha className="ml-1 inline size-4 align-[-0.15em]" />
              </Boton>
            </div>
          </div>

          {/* Qué hace variar el valor */}
          <div className={`min-w-0 ${foto ? "lg:text-marfil" : ""}`}>
            <p className={`antetitulo ${foto ? "lg:text-dorado" : ""}`}>Qué define el valor</p>
            <ul className="mt-8 space-y-8">
              {inversion.factores.map((f) => {
                const Icono = ICONOS[f.icono];
                return (
                  <li key={f.titulo} className="flex gap-5">
                    <span
                      className={`flex size-12 shrink-0 items-center justify-center rounded-full border border-dorado/70 text-terracota ${
                        foto ? "lg:border-dorado/60 lg:bg-white/5 lg:text-dorado" : ""
                      }`}
                    >
                      <Icono className="size-6" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-titulo text-titulo-3">{f.titulo}</h3>
                      <p className={`mt-1.5 max-w-md text-topo ${foto ? "lg:text-marfil/85" : ""}`}>
                        {f.descripcion}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
