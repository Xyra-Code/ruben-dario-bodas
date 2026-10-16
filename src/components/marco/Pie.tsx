import Link from "next/link";

import {
  IconoEstrella,
  IconoFacebook,
  IconoInstagram,
  IconoWhatsApp,
} from "@/components/ui/Iconos";
import { obtenerContenido } from "@/lib/contenido/cargar";
import { correoAscii, esEnlace, textoDias, textoHora } from "@/lib/formato";
import { NAVEGACION } from "@/lib/rutas";
import { PAGINAS } from "@/lib/seo/paginas";
import { MENSAJES, enlaceWhatsApp } from "@/lib/whatsapp";

const NOMBRE_RED: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  pinterest: "Pinterest",
};

// 44 px de área táctil en pantallas táctiles; con mouse (pointer-fine) las filas se compactan.
const enlaceClase =
  "inline-flex min-h-11 items-center text-carbon underline-offset-4 pointer-fine:min-h-9 hover:text-terracota hover:underline";

// Dos tamaños en todo el pie: 15 px para lo principal y text-sm (14 px) para lo secundario.
const textoPie = "text-[0.9375rem] leading-relaxed";

/**
 * Footer: nombre, contacto y horario escritos igual que en Google Business, enlaces a
 * todas las páginas, cobertura en texto (SEO local), redes y reseñas.
 */
export function Pie() {
  const { sitio } = obtenerContenido();
  const d = sitio.direccion;
  const redes = Object.entries(sitio.redes).filter(([, url]) => url);
  const anio = new Date().getFullYear();

  return (
    <footer className="border-t border-linea bg-rubor">
      <div className="contenedor pt-14 pb-6 lg:pt-20 lg:pb-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-16">
          <div className="min-w-0">
            {/* eslint-disable-next-line @next/next/no-img-element -- SVG del logo */}
            <img
              src="/marca/logo-vertical.svg"
              alt={sitio.nombre}
              width={770}
              height={664}
              loading="lazy"
              className="h-auto w-40 max-w-full lg:w-48"
            />
            <p className={`mt-5 max-w-xs text-topo ${textoPie}`}>{sitio.lema}</p>

            {/* Redes junto a la marca, con las reglas de Vuelo Carmesí: solo el logo oficial,
                sin círculo, y al pasar el cursor cambia de color y nada más. Cada enlace
                tiene 44 px de área táctil invisible (glifo de 20 px + p-3, con -m-3 para que
                no se separen a la vista); gap-6 = los dos -m-3, así las áreas de dos logos
                contiguos no se solapan. WhatsApp va en la fila porque también es un canal. */}
            <ul className="mt-6 flex flex-wrap items-center gap-6" aria-label="Síguenos">
              {redes.map(([red, url]) => (
                <li key={red}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${NOMBRE_RED[red] ?? red} de ${sitio.nombre}`}
                    title={NOMBRE_RED[red] ?? red}
                    className="-m-3 flex p-3 text-topo transition-colors hover:text-terracota"
                  >
                    {red === "instagram" ? (
                      <IconoInstagram />
                    ) : red === "facebook" ? (
                      <IconoFacebook />
                    ) : (
                      <span className="text-xs">{NOMBRE_RED[red] ?? red}</span>
                    )}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={enlaceWhatsApp(sitio.whatsapp, MENSAJES.general)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`WhatsApp de ${sitio.nombre}`}
                  title="WhatsApp"
                  className="-m-3 flex p-3 text-topo transition-colors hover:text-terracota"
                  data-evento="whatsapp"
                  data-origen="pie-redes"
                >
                  <IconoWhatsApp />
                </a>
              </li>
              {/* Reseñas en la misma fila: texto y no logo, porque lo que invita a hacer clic
                  es la palabra. */}
              {esEnlace(sitio.google.perfil) && (
                <li>
                  <a
                    href={sitio.google.perfil}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${enlaceClase} gap-2 text-sm`}
                  >
                    <IconoEstrella className="size-4 text-dorado-texto" />
                    Reseñas en Google
                  </a>
                </li>
              )}
            </ul>

            {esEnlace(sitio.google.escribirResena) && (
              <a
                href={sitio.google.escribirResena}
                target="_blank"
                rel="noopener noreferrer"
                className={`${enlaceClase} mt-2 text-sm`}
              >
                Déjanos una reseña
              </a>
            )}
          </div>

          {/* Bajo cada antetítulo: mt-2 en listas de enlaces (la fila de 44 px ya trae aire
              arriba) y mt-4 en texto suelto, para que el primer renglón quede a la misma
              distancia en las tres columnas. */}
          <div className="grid min-w-0 grid-cols-[repeat(auto-fit,minmax(min(13rem,100%),1fr))] gap-x-10 gap-y-10">
            <section className="min-w-0" aria-labelledby="pie-contacto">
              <h2 id="pie-contacto" className="antetitulo">
                Contacto
              </h2>
              <ul className={`mt-2 ${textoPie}`}>
                <li>
                  <a
                    href={enlaceWhatsApp(sitio.whatsapp, MENSAJES.general)}
                    target="_blank"
                    rel="noopener"
                    className={`${enlaceClase} gap-2`}
                    data-evento="whatsapp"
                    data-origen="pie"
                  >
                    <IconoWhatsApp className="size-4" /> WhatsApp
                  </a>
                </li>
                <li>
                  <a href={`tel:${sitio.telefono.e164}`} className={`${enlaceClase} wrap-anywhere`}>
                    {sitio.telefono.visible}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${correoAscii(sitio.correo)}`}
                    className={`${enlaceClase} py-1 text-sm leading-snug`}
                  >
                    {/* El correo es largo: en text-sm el dominio cabe entero en la columna, y
                        si no cabe todo en una línea corta solo después de la @. */}
                    <span className="min-w-0 wrap-anywhere">
                      {sitio.correo.split("@")[0]}@<wbr />
                      {sitio.correo.split("@")[1]}
                    </span>
                  </a>
                </li>
              </ul>
              <address className={`mt-4 text-topo not-italic ${textoPie}`}>
                {d.publica && <span className="block">{d.calle}</span>}
                <span className="block">
                  {d.ciudad}, {d.departamento}
                </span>
                {esEnlace(sitio.google.perfil) && (
                  <a
                    href={sitio.google.perfil}
                    target="_blank"
                    rel="noopener"
                    className={`${enlaceClase} underline`}
                  >
                    Cómo llegar
                  </a>
                )}
              </address>
              <dl className="mt-4 space-y-0.5 text-sm text-topo">
                {sitio.horario.map((h) => (
                  <div key={h.dias.join()} className="flex flex-wrap gap-x-2">
                    <dt>{textoDias(h.dias)}:</dt>
                    <dd>
                      {textoHora(h.abre)} – {textoHora(h.cierra)}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <nav className="min-w-0" aria-labelledby="pie-explorar">
              <h2 id="pie-explorar" className="antetitulo">
                Explorar
              </h2>
              <ul className={`mt-2 ${textoPie}`}>
                {NAVEGACION.map((n) => (
                  <li key={n.ruta}>
                    <Link href={n.ruta} className={enlaceClase}>
                      {n.nombre}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href={PAGINAS.lugares.ruta} className={enlaceClase}>
                    Lugares para bodas
                  </Link>
                </li>
              </ul>
            </nav>

            <section className="min-w-0" aria-labelledby="pie-cobertura">
              <h2 id="pie-cobertura" className="antetitulo">
                Dónde trabajamos
              </h2>
              <p className={`mt-4 text-topo ${textoPie}`}>
                Centro de operación en {sitio.cobertura.sede}.
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-topo">
                {sitio.cobertura.zonas.map((z) => (
                  <li key={z.nombre}>
                    <span className="text-carbon">{z.nombre}:</span> {z.municipios.join(", ")}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        <div className="mt-10 filete-dorado lg:mt-12" />
        {/* lg:pr-20: el botón flotante de WhatsApp (solo desde lg, 64 px) ocupa esa
            franja al llegar al final de la página; así no tapa esta línea. Desde 1440 px el
            contenedor ya deja margen de sobra a los lados y no hace falta. */}
        <div className="mt-4 flex flex-col gap-1 text-sm text-topo sm:flex-row sm:flex-wrap sm:items-center sm:justify-between lg:pr-20 min-[90rem]:pr-0">
          <p className="min-w-0">
            © {anio} {sitio.nombre}
          </p>
          <div className="flex min-w-0 flex-wrap items-center gap-x-6">
            <Link href={PAGINAS.politica.ruta} className={enlaceClase}>
              Política de datos
            </Link>
            <a href="https://xyracode.com" target="_blank" rel="noopener" className={enlaceClase}>
              Desarrollado por XyraCode
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
