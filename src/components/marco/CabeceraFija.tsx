"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * <header> fijo arriba que se compacta (menos alto, con borde) al desplazarse.
 * El contenido lo pone Encabezado (servidor); aquí solo vive el estado del scroll.
 */
export function CabeceraFija({ children }: { children: ReactNode }) {
  const [compacta, setCompacta] = useState(false);

  useEffect(() => {
    const actualizar = () => setCompacta(window.scrollY > 24);
    actualizar();
    window.addEventListener("scroll", actualizar, { passive: true });
    return () => window.removeEventListener("scroll", actualizar);
  }, []);

  return (
    <header
      data-compacta={compacta || undefined}
      className="group sticky top-0 z-40 border-b border-transparent bg-marfil/95 backdrop-blur-sm transition-[border-color,box-shadow] duration-300 data-compacta:border-linea data-compacta:shadow-[0_1px_12px_rgba(43,39,36,0.06)]"
    >
      {children}
    </header>
  );
}
