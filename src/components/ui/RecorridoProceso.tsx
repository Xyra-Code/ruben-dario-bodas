import type { ReactNode } from "react";

type Paso = { titulo: string; descripcion: string };

type Props = {
  pasos: Paso[];
  /** Se muestra dentro del último paso, bajo su texto: la foto de hacia dónde lleva todo. */
  final?: ReactNode;
};

/**
 * Pasos como un solo recorrido vertical: la línea une los números, de modo que se lee como
 * una secuencia y no como datos sueltos, y el texto tiene ancho cómodo aunque crezca. Es la
 * misma forma en celular y escritorio. El último número va lleno: es la meta del recorrido.
 * Lista ordenada: los lectores de pantalla ya anuncian el número, por eso el visible se oculta.
 */
export function RecorridoProceso({ pasos, final }: Props) {
  return (
    <ol className="max-w-2xl lg:max-w-none">
      {pasos.map((p, i) => {
        const ultimo = i === pasos.length - 1;
        return (
          <li
            key={p.titulo}
            className={`relative grid grid-cols-[3rem_minmax(0,1fr)] gap-x-4 sm:gap-x-6 ${
              ultimo ? "" : "pb-9 lg:pb-11"
            }`}
          >
            {!ultimo && (
              <span
                aria-hidden="true"
                className="absolute top-12 bottom-0 left-6 w-px -translate-x-1/2 bg-dorado/70"
              />
            )}
            <span
              aria-hidden="true"
              className={`flex size-12 items-center justify-center rounded-full border font-titulo text-xl ${
                ultimo
                  ? "border-terracota bg-terracota text-sobre-principal"
                  : "border-dorado text-dorado-texto"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 pt-2">
              <h3 className="text-titulo-3">{p.titulo}</h3>
              <p className="mt-2 text-topo">{p.descripcion}</p>
              {/* En celular sale a la columna del número (3rem + 1rem): ahí ya no hay línea. */}
              {ultimo && final && <div className="mt-6 -ml-16 sm:ml-0">{final}</div>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
