import type { Evento } from "@/lib/contenido/cargar";
import { ubicacion } from "@/lib/rutas";

/**
 * Ficha del evento: lugar, municipio, estilo, fecha y la paleta como muestras de color
 * con su nombre (el color nunca va solo). El tipo ya lo muestra la etiqueta sobre el H1.
 */
export function FichaEvento({ evento: e }: { evento: Evento }) {
  const filas = [
    ["Lugar", e.lugar.nombre],
    ["Municipio", ubicacion(e.lugar)],
    ["Estilo", e.estilo],
    ["Fecha", e.fechaTexto.charAt(0).toUpperCase() + e.fechaTexto.slice(1)],
  ] as const;

  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-y border-linea py-6 lg:grid-cols-4">
      {filas.map(([dato, valor]) => (
        <div key={dato} className="min-w-0">
          <dt className="antetitulo">{dato}</dt>
          <dd className="mt-1">{valor}</dd>
        </div>
      ))}
      <div className="col-span-2 min-w-0 lg:col-span-4">
        <dt className="antetitulo">Paleta</dt>
        <dd className="mt-3">
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
