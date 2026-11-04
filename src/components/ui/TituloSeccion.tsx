import type { ReactNode } from "react";

type Props = {
  antetitulo: string;
  titulo: string;
  /** id del h2, para aria-labelledby de la sección. */
  id: string;
  intro?: ReactNode;
  /** Botón o enlace a la derecha del título (desde md); debajo en celular. */
  accion?: ReactNode;
  /**
   * En celular la acción no va bajo el título sino al final de la sección, con
   * <AccionAlFinal>: "Ver todos" pide más justo después de ver las tarjetas.
   */
  accionAlFinal?: boolean;
  centrado?: boolean;
};

/** Encabezado de sección: antetítulo dorado + h2 + intro opcional + acción opcional. */
export function TituloSeccion({
  antetitulo,
  titulo,
  id,
  intro,
  accion,
  accionAlFinal = false,
  centrado = false,
}: Props) {
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
      {accion && (
        <div className={`shrink-0 ${accionAlFinal ? "hidden md:block" : ""}`}>{accion}</div>
      )}
    </div>
  );
}

/**
 * La acción del encabezado repetida al final de la sección, solo en celular (en escritorio
 * está junto al título). Va con `accionAlFinal` en TituloSeccion: nunca se ven las dos.
 */
export function AccionAlFinal({ children }: { children: ReactNode }) {
  return <div className="mt-10 flex justify-center md:hidden">{children}</div>;
}
