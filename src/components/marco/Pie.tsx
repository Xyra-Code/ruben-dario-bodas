import Link from "next/link";

import { IconoWhatsApp } from "@/components/ui/Iconos";
import { obtenerContenido } from "@/lib/contenido/cargar";
import { esEnlace, textoDias, textoHora } from "@/lib/formato";
import { NAVEGACION } from "@/lib/rutas";
import { PAGINAS } from "@/lib/seo/paginas";
import { MENSAJES, enlaceWhatsApp } from "@/lib/whatsapp";

const NOMBRE_RED: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  pinterest: "Pinterest",
};

const enlaceClase =
  "inline-flex min-h-11 items-center text-carbon underline-offset-4 hover:text-terracota hover:underline";

/**
 * Footer: nombre, contacto y horario escritos igual que en Google Business, enlaces a
 * todas las páginas, cobertura en texto (SEO local), redes y reseñas.
 */
export function Pie() {
  const { sitio } = obtenerContenido();
  const d = sitio.direccion;
  const redes = Object.entries(sitio.redes).filter(([, url]) => url);
  const anio = new Date().getFullYear();
  const hayRedes =
    redes.length > 0 || esEnlace(sitio.google.perfil) || esEnlace(sitio.google.escribirResena);

  return (
    <footer className="border-t border-linea bg-rubor">
      <div className="contenedor py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-16">
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
            <p className="mt-5 max-w-xs text-topo">{sitio.lema}</p>
          </div>

          <div className="grid min-w-0 grid-cols-[repeat(auto-fit,minmax(min(13rem,100%),1fr))] gap-x-10 gap-y-12">
            <section className="min-w-0" aria-labelledby="pie-contacto">
              <h2 id="pie-contacto" className="antetitulo">
                Contacto
              </h2>
              <ul className="mt-4 space-y-1">
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
                  <a
                    href={`tel:${sitio.telefono.e164}`}
                    className={`${enlaceClase} [overflow-wrap:anywhere]`}
                  >
                    {sitio.telefono.visible}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${sitio.correo}`}
                    className={`${enlaceClase} [overflow-wrap:anywhere]`}
                  >
                    {sitio.correo}
                  </a>
                </li>
              </ul>
              <address className="mt-4 text-topo not-italic">
                {d.publica && <span className="block">{d.calle}</span>}
                <span className="block">
                  {d.ciudad}, {d.departamento}
                </span>
              </address>
              {esEnlace(sitio.google.perfil) && (
                <a
                  href={sitio.google.perfil}
                  target="_blank"
                  rel="noopener"
                  className={enlaceClase}
                >
                  Cómo llegar
                </a>
              )}
              <dl className="mt-4 text-sm text-topo">
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
              <ul className="mt-4">
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
              <p className="mt-4 text-sm text-topo">
                Centro de operación en {sitio.cobertura.sede}.
              </p>
              <ul className="mt-2 space-y-2 text-sm text-topo">
                {sitio.cobertura.zonas.map((z) => (
                  <li key={z.nombre}>
                    <span className="text-carbon">{z.nombre}:</span> {z.municipios.join(", ")}
                  </li>
                ))}
              </ul>
            </section>

            {hayRedes && (
              <section className="min-w-0" aria-labelledby="pie-redes">
                <h2 id="pie-redes" className="antetitulo">
                  Síganos
                </h2>
                <ul className="mt-4">
                  {redes.map(([red, url]) => (
                    <li key={red}>
                      <a href={url} target="_blank" rel="noopener" className={enlaceClase}>
                        {NOMBRE_RED[red] ?? red}
                      </a>
                    </li>
                  ))}
                  {esEnlace(sitio.google.perfil) && (
                    <li>
                      <a
                        href={sitio.google.perfil}
                        target="_blank"
                        rel="noopener"
                        className={enlaceClase}
                      >
                        Vea nuestras reseñas en Google
                      </a>
                    </li>
                  )}
                  {esEnlace(sitio.google.escribirResena) && (
                    <li>
                      <a
                        href={sitio.google.escribirResena}
                        target="_blank"
                        rel="noopener"
                        className={enlaceClase}
                      >
                        Déjenos una reseña
                      </a>
                    </li>
                  )}
                </ul>
              </section>
            )}
          </div>
        </div>

        <div className="mt-14 filete-dorado" />
        {/* pb extra en celular: el botón flotante de WhatsApp no tapa esta línea. */}
        <div className="mt-6 flex flex-col gap-2 pb-16 text-sm text-topo sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:pb-0">
          <p className="min-w-0">
            © {anio} {sitio.nombre}
          </p>
          <div className="flex min-w-0 flex-wrap items-center gap-x-6">
            <Link href={PAGINAS.politica.ruta} className={enlaceClase}>
              Política de datos
            </Link>
            <a href="https://xyracode.com" target="_blank" rel="noopener" className={enlaceClase}>
              Sitio por XyraCode
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
