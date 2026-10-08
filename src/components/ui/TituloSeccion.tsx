import type { ReactNode } from "react";

type Props = {
  antetitulo: string;
  titulo: string;
  /** id del h2, para aria-labelledby de la sección. */
  id: string;
  intro?: ReactNode;
  /** Botón o enlace a la derecha del título (desde md); debajo en celular. */
  accion?: ReactNode;
  centrado?: boolean;
};

/** Encabezado de sección: antetítulo dorado + h2 + intro opcional + acción opcional. */
export function TituloSeccion({ antetitulo, titulo, id, intro, accion, centrado = false }: Props) {
  return (
    <div
      className={`flex flex-col gap-6 md:flex-row md:items-end md:justify-between ${
        centrado ? "items-center text-center md:flex-col md:items-center" : ""
      }`}
    >
      <div className={`min-w-0 ${centrado ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>
        <p className="antetitulo">{antetitulo}</p>
        <h2 id={id} className="mt-3 text-titulo-2">
          {titulo}
        </h2>
        {intro && <div className="mt-4 text-topo">{intro}</div>}
      </div>
      {accion && <div className="shrink-0">{accion}</div>}
    </div>
  );
}
