"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

/**
 * <header> fijo arriba que se compacta (menos alto, con borde) al desplazarse.
 * El contenido lo pone Encabezado (servidor); aquí solo vive el estado del scroll.
 *
 * PRUEBA (2026-10-16): si la página tiene una portada con foto de fondo
 * ([data-foto-portada]) y aún no se ha bajado, el encabezado es transparente sobre la
 * foto (data-sobre-foto: logo y enlaces en blanco). Al bajar vuelve a su fondo normal.
 */
export function CabeceraFija({ children }: { children: ReactNode }) {
  const ruta = usePathname();
  const [compacta, setCompacta] = useState(false);
  const [hayFoto, setHayFoto] = useState(false);

  // Se repite al cambiar de página: la portada con foto solo existe en algunas.
  useEffect(() => {
    const actualizar = () => {
      setCompacta(window.scrollY > 24);
      setHayFoto(!!document.querySelector("[data-foto-portada]"));
    };
    actualizar();
    window.addEventListener("scroll", actualizar, { passive: true });
    return () => window.removeEventListener("scroll", actualizar);
  }, [ruta]);

  const sobreFoto = hayFoto && !compacta;

  return (
    <header
      data-compacta={compacta || undefined}
      data-sobre-foto={sobreFoto || undefined}
      className="group sticky top-0 z-40 border-b border-transparent bg-marfil/95 backdrop-blur-sm transition-[background-color,border-color,box-shadow] duration-300 data-compacta:border-linea data-compacta:shadow-[0_1px_12px_rgba(43,39,36,0.06)] data-sobre-foto:bg-transparent data-sobre-foto:backdrop-blur-none"
    >
      {children}
    </header>
  );
}
