import Link from "next/link";

import { FormularioCotizacion } from "@/components/formulario/FormularioCotizacion";
import { ConAmpersand } from "@/components/ui/ConAmpersand";
import { Foto } from "@/components/ui/Foto";
import { IconoInstagram, IconoTelefono, IconoWhatsApp } from "@/components/ui/Iconos";
import { obtenerContenido } from "@/lib/contenido/cargar";
import type { TipoEvento } from "@/lib/contenido/esquemas";
import { rutaEvento } from "@/lib/rutas";
import { fotoDelTestimonio, fraseCorta, testimonioDeContacto } from "@/lib/testimonios";
import { MENSAJES, enlaceWhatsApp } from "@/lib/whatsapp";

type Props = {
  tipoInicial?: TipoEvento;
  referencia?: string;
  origen: string;
  /** En la página de un evento: su slug, para no repetir su testimonio ni su foto. */
  eventoActual?: string;
};

// Sobre terracota, el texto va en blanco (5,8 : 1) y la comilla en oro claro (decorativa).
const c = {
  seccion: "grano bg-terracota text-sobre-principal",
  suave: "text-sobre-principal/85",
  comilla: "text-[#f1d29b]",
  enlaceEvento:
    "inline-flex min-h-11 items-center text-sm text-sobre-principal/85 underline underline-offset-4 hover:text-sobre-principal",
  directo:
    "inline-flex min-h-11 items-center gap-1.5 underline underline-offset-4 transition-colors hover:text-sobre-principal/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sobre-principal",
};

/**
 * Cierre de casi todas las páginas (#contacto). En celular: formulario, con su título dentro, y
 * debajo una línea de contacto directo: quien toca "Cotizar" llega a llenar, no a leer. El
 * contacto va discreto para no competir con "Enviar por WhatsApp". En escritorio, a la izquierda,
 * foto y testimonio apilados; si el tipo de evento no tiene testimonios (hoy, 15 años), una foto
 * de un evento de ese tipo, sin cita. Es la única banda terracota de cada página
 * (src/lib/fondos.ts): en todas, terracota = aquí se cotiza. Los enlaces a #contacto llegan a la
 * tarjeta del formulario, no al inicio de la banda: el margen negativo descuenta el relleno
 * superior para que el formulario quepa completo en pantalla, con su botón.
 */
export function SeccionContacto({ tipoInicial, referencia, origen, eventoActual }: Props) {
  const { sitio, testimonios, eventos } = obtenerContenido();
  const elegido = testimonioDeContacto(testimonios, eventos, tipoInicial, eventoActual);
  const foto = elegido && fotoDelTestimonio(elegido.evento, elegido.testimonio);
  const eventoFoto = elegido
    ? undefined
    : eventos.find((e) => (!tipoInicial || e.tipo === tipoInicial) && e.slug !== eventoActual);
  const portada = eventoFoto?.fotos.find((f) => f.archivo === eventoFoto.portada);

  return (
    <section
      id="contacto"
      aria-labelledby="contacto-titulo"
      className={`${c.seccion} py-(--spacing-seccion) [scroll-margin-top:calc(-1_*_var(--spacing-seccion)_-_0.5rem)]`}
    >
      <div className="contenedor grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="hidden min-w-0 lg:block">
          {elegido && foto && (
            <figure>
              <Foto
                evento={elegido.evento.slug}
                archivo={foto.archivo}
                alt={foto.alt}
                posicion={foto.posicion}
                sizes="40vw"
                className="aspect-[4/3] w-full rounded-sm object-cover"
              />
              <span
                aria-hidden="true"
                className={`mt-5 block font-titulo text-5xl leading-none ${c.comilla}`}
              >
                “
              </span>
              <blockquote className="font-titulo text-xl leading-snug">
                <p>{fraseCorta(elegido.testimonio)}</p>
              </blockquote>
              <figcaption className="mt-3">
                <span className="block font-medium">
                  <ConAmpersand texto={elegido.testimonio.autor} />
                </span>
                <Link href={rutaEvento(elegido.evento.slug)} className={c.enlaceEvento}>
                  {elegido.evento.titulo}
                </Link>
              </figcaption>
            </figure>
          )}

          {eventoFoto && portada && (
            <figure>
              <Foto
                evento={eventoFoto.slug}
                archivo={portada.archivo}
                alt={portada.alt}
                posicion={portada.encuadre}
                sizes="40vw"
                className="aspect-square w-full rounded-sm object-cover"
              />
              <figcaption className="mt-1">
                <Link href={rutaEvento(eventoFoto.slug)} className={c.enlaceEvento}>
                  {eventoFoto.titulo}
                </Link>
              </figcaption>
            </figure>
          )}
        </div>

        <div className="grid min-w-0 content-start gap-4">
          <div className="min-w-0 rounded-sm bg-marfil p-4 text-carbon shadow-[0_1px_24px_rgba(43,39,36,0.06)] sm:p-6">
            <h2 id="contacto-titulo" className="mb-4 text-center text-titulo-2 sm:mb-5">
              Cotiza tu evento
            </h2>
            <FormularioCotizacion
              whatsapp={sitio.whatsapp}
              presupuestos={sitio.presupuestos}
              invitados={sitio.invitados}
              tipoInicial={tipoInicial}
              referencia={referencia}
              origen={origen}
            />
          </div>

          <div className="flex min-w-0 flex-wrap items-center justify-center gap-x-4 text-sm">
            <p className={`w-full text-center sm:w-auto ${c.suave}`}>¿Prefieres directo?</p>
            <ul className="flex min-w-0 flex-wrap justify-center gap-x-4">
              <li className="min-w-0">
                <a
                  href={enlaceWhatsApp(sitio.whatsapp, MENSAJES.general)}
                  target="_blank"
                  rel="noopener"
                  className={c.directo}
                  data-evento="whatsapp"
                  data-origen={`contacto-${origen}`}
                >
                  <IconoWhatsApp className="size-4" /> WhatsApp
                </a>
              </li>
              <li className="min-w-0">
                <a href={`tel:${sitio.telefono.e164}`} className={c.directo}>
                  <IconoTelefono className="size-4" /> {sitio.telefono.visible}
                </a>
              </li>
              {sitio.redes.instagram && (
                <li className="min-w-0">
                  <a
                    href={sitio.redes.instagram}
                    target="_blank"
                    rel="noopener"
                    className={c.directo}
                  >
                    <IconoInstagram className="size-4" /> Instagram
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
