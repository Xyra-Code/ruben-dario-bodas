"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

const textoVerMas = (ocultos: number) =>
  `Ver ${ocultos} ${ocultos === 1 ? "evento" : "eventos"} más`;

/**
 * Extiende una ficha de lugar en celular y escritorio: "Ver 2 eventos más" muestra las
 * miniaturas ocultas con `group-data-[abierta=true]/plegable`. Siguen en el HTML aunque estén
 * ocultas (Google ve los enlaces). En tablet se ven todas y no hay botón. En escritorio el
 * envoltorio desaparece (lg:contents) para que las miniaturas y el botón ocupen filas propias
 * en la ficha; `claseBoton` indica en qué columna va el botón. Allí las miniaturas nuevas
 * abren columnas que se deslizan, así que al abrir se lleva la lista hasta ellas.
 */
export function VerMasEventos({
  ocultos,
  ocultosEscritorio,
  claseBoton = "",
  children,
}: {
  ocultos: number;
  ocultosEscritorio: number;
  claseBoton?: string;
  children: ReactNode;
}) {
  const [abierta, setAbierta] = useState(false);
  const contenedor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierta) return;
    // En celular la lista no se desliza y esto no hace nada.
    const lista = contenedor.current?.querySelector("ul");
    const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    lista?.scrollTo({ left: lista.scrollWidth, behavior: sinMovimiento ? "auto" : "smooth" });
  }, [abierta]);

  return (
    <div ref={contenedor} data-abierta={abierta} className="group/plegable min-w-0 lg:contents">
      {children}
      <button
        type="button"
        aria-expanded={abierta}
        onClick={() => setAbierta(!abierta)}
        className={`mx-auto mt-2 block min-h-11 text-sm text-terracota underline-offset-4 transition-colors hover:text-terracota-profundo hover:underline sm:max-lg:hidden lg:col-span-4 lg:row-start-3 lg:-mt-2 lg:mx-0 lg:justify-self-start ${claseBoton}`}
      >
        {abierta ? (
          "Ver menos"
        ) : (
          <>
            <span className="lg:hidden">{textoVerMas(ocultos)}</span>
            <span className="hidden lg:inline">{textoVerMas(ocultosEscritorio)}</span>
          </>
        )}
      </button>
    </div>
  );
}
