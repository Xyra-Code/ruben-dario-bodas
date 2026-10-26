import { EnlaceLugar } from "@/components/ui/EnlaceLugar";
import type { Evento } from "@/lib/contenido/cargar";
import { ubicacion } from "@/lib/rutas";

/**
 * PRUEBA (2026-10-25, con MosaicoEvento): la misma ficha en dos líneas bajo el mosaico,
 * para que las fotos queden en la primera pantalla. Lugar (enlazado a la guía) ·
 * municipio · estilo y la paleta en muestras pequeñas con su nombre.
 */
export function FichaEventoCompacta({ evento: e }: { evento: Evento }) {
  return (
    <div className="min-w-0">
      <p className="text-carbon">
        <EnlaceLugar lugar={e.lugar} />
        <span className="text-topo"> · </span>
        {ubicacion(e.lugar)}
        <span className="text-topo"> · </span>
        {e.estilo}
      </p>
      {e.paleta.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2" aria-label="Paleta">
          {e.paleta.map((c) => (
            <li key={c.nombre} className="flex min-w-0 items-center gap-2">
              <span
                aria-hidden="true"
                className="size-5 shrink-0 rounded-full border border-carbon/10"
                style={{ backgroundColor: c.hex }}
              />
              <span className="text-sm text-topo">{c.nombre}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Ficha del evento: lugar (enlazado a la guía), municipio, estilo y la paleta como
 * muestras de color con su nombre (el color nunca va solo). El tipo ya lo muestra la
 * etiqueta sobre el H1. Sin fecha: decisión del 2026-10-19 (envejece el portafolio).
 */
export function FichaEvento({ evento: e }: { evento: Evento }) {
  const filas = [
    ["Lugar", <EnlaceLugar key="lugar" lugar={e.lugar} />],
    ["Municipio", ubicacion(e.lugar)],
    ["Estilo", e.estilo],
  ] as const;

  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-y border-linea py-6 lg:grid-cols-3">
      {filas.map(([dato, valor]) => (
        <div key={dato} className="min-w-0">
          <dt className="antetitulo">{dato}</dt>
          <dd className="mt-1">{valor}</dd>
        </div>
      ))}
      <div className="col-span-2 min-w-0 lg:col-span-3">
        <dt className="antetitulo">Paleta</dt>
        <dd className="mt-3">
          {e.paleta.length === 0 && <p>[PENDIENTE: paleta de colores]</p>}
          <ul className="flex flex-wrap gap-x-5 gap-y-3">
            {e.paleta.map((c) => (
              <li key={c.nombre} className="flex min-w-0 items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="size-8 shrink-0 rounded-full border border-carbon/10"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-[0.9375rem]">{c.nombre}</span>
              </li>
            ))}
          </ul>
        </dd>
      </div>
    </dl>
  );
}
