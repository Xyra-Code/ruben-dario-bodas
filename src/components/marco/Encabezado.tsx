import Link from "next/link";

import { BotonCotizar } from "@/components/marco/BotonCotizar";
import { CabeceraFija } from "@/components/marco/CabeceraFija";
import { EnlacesNavegacion } from "@/components/marco/EnlacesNavegacion";
import { MenuMovil } from "@/components/marco/MenuMovil";
import { obtenerContenido } from "@/lib/contenido/cargar";
import { MENSAJES, enlaceWhatsApp } from "@/lib/whatsapp";

/**
 * Encabezado de todas las páginas.
 * - Celular: firma + botón del menú (MenuMovil). Compartir un evento flota sobre WhatsApp
 *   (CompartirFlotante).
 * - Desde sm: la firma por altura y "Cotizar" a la vista. Desde lg: enlaces en línea.
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
          {/* La firma completa también en celular: el ancho escala con la pantalla (168 px
              a 320, ~187 a 390) y desde sm manda la altura. "Cotizar" solo aparece desde
              sm para que quepa junto al menú. */}
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

        <div className="flex shrink-0 items-center gap-1">
          <BotonCotizar compacto className="max-sm:hidden" />
          <MenuMovil
            enlaceWhatsApp={enlaceWhatsApp(sitio.whatsapp, MENSAJES.general)}
            redes={sitio.redes}
            cobertura={sitio.cobertura.resumen}
          />
        </div>
      </div>
    </CabeceraFija>
  );
}
