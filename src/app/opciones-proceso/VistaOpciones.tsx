"use client";

import { type ReactNode, useState, useSyncExternalStore } from "react";

type Props = { letras: string[]; children: ReactNode };

const sinSuscripcion = () => () => {};
const RUTA = "/opciones-proceso";

/**
 * TEMPORAL. Barra para saltar entre opciones y verlas a 390 px dentro de un marco (la página
 * se carga a sí misma, así responde con sus estilos reales de celular). Dentro del marco se oculta.
 */
export function VistaOpciones({ letras, children }: Props) {
  const enMarco = useSyncExternalStore(
    sinSuscripcion,
    () => window.self !== window.top,
    () => false,
  );
  const [celular, setCelular] = useState(false);
  const [destino, setDestino] = useState(letras[0]);

  if (enMarco) return children;

  const baseBoton =
    "inline-flex min-h-11 min-w-11 items-center justify-center rounded-boton border border-terracota px-3 text-sm font-medium";
  const claseBoton = `${baseBoton} text-terracota`;
  const claseBotonActivo = `${baseBoton} bg-terracota text-sobre-principal`;

  return (
    <>
      <div className="sticky top-16 z-10 border-y border-linea bg-marfil lg:top-20">
        <div className="contenedor flex flex-wrap items-center gap-2 py-2">
          {letras.map((l) =>
            celular ? (
              <button
                key={l}
                type="button"
                onClick={() => setDestino(l)}
                aria-pressed={destino === l}
                className={destino === l ? claseBotonActivo : claseBoton}
              >
                {l}
              </button>
            ) : (
              <a key={l} href={`#opcion-${l.toLowerCase()}`} className={claseBoton}>
                {l}
              </a>
            ),
          )}
          <button
            type="button"
            onClick={() => setCelular((v) => !v)}
            className={`${claseBotonActivo} ml-auto`}
          >
            {celular ? "Ver como escritorio" : "Ver como celular"}
          </button>
        </div>
      </div>
      {celular ? (
        <div className="contenedor flex justify-center py-8">
          <iframe
            key={destino}
            title={`Opción ${destino} en un celular`}
            src={`${RUTA}#opcion-${destino.toLowerCase()}`}
            className="h-[min(844px,80dvh)] w-[390px] max-w-full rounded-sm border border-borde bg-marfil"
          />
        </div>
      ) : (
        children
      )}
    </>
  );
}
