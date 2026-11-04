"use client";

import { Children, useRef, useState, type ReactNode } from "react";

import { clasesBoton } from "@/components/ui/Boton";

type Props = {
  children: ReactNode;
  /** Clases de la grilla (columnas y espacios). */
  className: string;
  /** Tarjetas visibles al cargar en escritorio (3 columnas). En celular se muestra una
   *  menos si así la última fila queda completa a 2 columnas. */
  inicial?: number;
  /** Texto del botón: "Ver más bodas". */
  textoMas: string;
};

/**
 * Grilla que muestra las primeras tarjetas y deja el resto detrás de "Ver más". Todas las
 * tarjetas van en el HTML (Google ve todos los enlaces); las ocultas no cargan su foto
 * porque las imágenes diferidas dentro de display:none no se descargan.
 */
export function GrillaConMas({ children, className, inicial = 9, textoMas }: Props) {
  const [abierta, setAbierta] = useState(false);
  const primeraNueva = useRef<HTMLDivElement>(null);
  const items = Children.toArray(children);
  const total = items.length;
  // En celular (2 columnas) se evita una tarjeta sola en la última fila.
  const inicialCelular = inicial % 2 === 0 ? inicial : inicial - 1;
  const hayMas = total > inicialCelular;

  const abrir = () => {
    setAbierta(true);
    // Lleva el foco a la primera tarjeta que aparece (teclado y lector de pantalla).
    requestAnimationFrame(() => primeraNueva.current?.querySelector("a")?.focus());
  };

  return (
    <>
      <div className={className}>
        {items.map((item, i) => {
          let oculta = "";
          if (!abierta && i >= inicial) oculta = "hidden";
          else if (!abierta && i >= inicialCelular) oculta = "hidden lg:block";
          return (
            <div
              key={i}
              ref={i === inicialCelular ? primeraNueva : undefined}
              className={`min-w-0 ${oculta}`}
            >
              {item}
            </div>
          );
        })}
      </div>
      {hayMas && !abierta && (
        <div className={`mt-12 flex justify-center ${total > inicial ? "" : "lg:hidden"}`}>
          <button type="button" onClick={abrir} className={clasesBoton("secundario")}>
            {textoMas}
          </button>
        </div>
      )}
    </>
  );
}
