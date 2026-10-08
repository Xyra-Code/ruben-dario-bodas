import type { Evento } from "@/lib/contenido/cargar";
import { ubicacion } from "@/lib/rutas";

const NOMBRE_TIPO = { boda: "Boda", quince: "Fiesta de 15 años", otro: "Evento" } as const;

/**
 * Ficha del evento: tipo, lugar, municipio, estilo, fecha y la paleta como muestras de
 * color con su nombre (el color nunca va solo: lleva el nombre al lado).
 */
export function FichaEvento({ evento: e }: { evento: Evento }) {
  const filas = [
    ["Tipo", NOMBRE_TIPO[e.tipo]],
    ["Lugar", e.lugar.nombre],
    ["Municipio", ubicacion(e.lugar)],
    ["Estilo", e.estilo],
    ["Fecha", e.fechaTexto.charAt(0).toUpperCase() + e.fechaTexto.slice(1)],
  ] as const;

  return (
    <dl className="grid gap-x-8 gap-y-5 border-y border-linea py-6 sm:grid-cols-2 lg:grid-cols-3">
      {filas.map(([dato, valor]) => (
        <div key={dato} className="min-w-0">
          <dt className="antetitulo">{dato}</dt>
          <dd className="mt-1">{valor}</dd>
        </div>
      ))}
      <div className="min-w-0 sm:col-span-2 lg:col-span-3">
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
