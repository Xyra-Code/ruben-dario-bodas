import Link from "next/link";

import { BotonCotizar } from "@/components/marco/BotonCotizar";
import { CabeceraFija } from "@/components/marco/CabeceraFija";
import { EnlacesNavegacion } from "@/components/marco/EnlacesNavegacion";
import { MenuMovil } from "@/components/marco/MenuMovil";
import { obtenerContenido } from "@/lib/contenido/cargar";
import { MENSAJES, enlaceWhatsApp } from "@/lib/whatsapp";

/**
 * Encabezado de todas las páginas.
 * - Celular: monograma + "Cotizar" + menú (la firma con el nombre no cabe a 320px).
 * - Desde sm: firma (monograma + "Rubén Darío"). Desde lg: enlaces en línea, sin menú.
 */
export function Encabezado() {
  const { sitio } = obtenerContenido();
  const whatsapp = enlaceWhatsApp(sitio.whatsapp, MENSAJES.general);

  return (
    <CabeceraFija>
      <div className="contenedor flex h-16 items-center justify-between gap-3 transition-[height] duration-300 group-data-compacta:h-14 lg:h-20 lg:group-data-compacta:h-16">
        <Link
          href="/"
          aria-label={`${sitio.nombre}, inicio`}
          className="flex min-h-11 min-w-0 shrink items-center"
        >
          {/* eslint-disable @next/next/no-img-element -- SVG del logo: no necesita optimizador */}
          <img
            src="/marca/monograma.svg"
            alt=""
            width={406}
            height={407}
            className="size-10 sm:hidden"
          />
          <img
            src="/marca/logo-firma.svg"
            alt=""
            width={908}
            height={126}
            className="hidden h-8 w-auto max-w-full sm:block lg:h-9"
          />
          {/* eslint-enable @next/next/no-img-element */}
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <EnlacesNavegacion disposicion="barra" />
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <BotonCotizar className="min-h-11 px-4 sm:px-6" />
          <div className="lg:hidden">
            <MenuMovil enlaceWhatsApp={whatsapp} />
          </div>
        </div>
      </div>
    </CabeceraFija>
  );
}
