import Link from "next/link";

import { BotonCotizar } from "@/components/marco/BotonCotizar";
import { CabeceraFija } from "@/components/marco/CabeceraFija";
import { CompartirEncabezado } from "@/components/marco/CompartirEncabezado";
import { EnlacesNavegacion } from "@/components/marco/EnlacesNavegacion";
import { obtenerContenido } from "@/lib/contenido/cargar";

/**
 * Encabezado de todas las páginas.
 * - Celular: firma + (en la página de un evento) compartir + "Cotizar"; la navegación va
 *   en la barra inferior.
 * - Desde sm: la firma por altura. Desde lg: enlaces en línea.
 */
export function Encabezado() {
  const { sitio } = obtenerContenido();

  return (
    <CabeceraFija>
      <div className="contenedor flex h-16 items-center justify-between gap-3 transition-[height] duration-300 group-data-compacta:h-14 lg:h-20 lg:group-data-compacta:h-16">
        <Link
          href="/"
          aria-label={`${sitio.nombre}, inicio`}
          className="flex min-h-11 min-w-0 shrink items-center"
        >
          {/* PRUEBA (2026-10-16): la firma completa también en celular (antes solo el
              monograma). Sin hamburguesa hay espacio: en celular el ancho escala con la
              pantalla (168 px a 320, ~187 a 390) y desde sm manda la altura. */}
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG del logo: no necesita optimizador */}
          <img
            src="/marca/logo-firma.svg"
            alt=""
            width={908}
            height={126}
            className="block h-auto w-[clamp(10.5rem,48vw,13rem)] max-w-full transition-[filter] duration-300 group-data-sobre-foto:brightness-0 group-data-sobre-foto:invert sm:h-8 sm:w-auto lg:h-9"
          />
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <EnlacesNavegacion disposicion="barra" />
        </nav>

        {/* PRUEBA (2026-10-16): en celular la navegación pasa a la barra inferior
            (BarraInferior); aquí queda solo "Cotizar". El menú hamburguesa (MenuMovil) se
            retiró del encabezado, pero el componente sigue en el repo por si se vuelve. */}
        <div className="flex shrink-0 items-center gap-1">
          <CompartirEncabezado />
          <BotonCotizar compacto />
        </div>
      </div>
    </CabeceraFija>
  );
}
