import type { Metadata } from "next";

import { CapitulosEspeciales, CierreEspecial } from "@/components/evento/CapitulosEspeciales";
import { Compartir } from "@/components/evento/Compartir";
import { FichaEvento, FichaEventoCompacta } from "@/components/evento/FichaEvento";
import { MosaicoEvento } from "@/components/evento/MosaicoEvento";
import { TestimonioEvento } from "@/components/evento/TestimonioEvento";
import { SeccionContacto } from "@/components/formulario/SeccionContacto";
import { Galeria } from "@/components/galeria/Galeria";
import { Migas } from "@/components/navegacion/Migas";
import { JsonLd } from "@/components/seo/JsonLd";
import { TarjetaEvento } from "@/components/tarjetas/TarjetaEvento";
import { Boton } from "@/components/ui/Boton";
import { ConAmpersand } from "@/components/ui/ConAmpersand";
import { EnlaceLugar } from "@/components/ui/EnlaceLugar";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { Foto } from "@/components/ui/Foto";
import { IconoFlecha } from "@/components/ui/Iconos";
import { eventosRelacionados, obtenerContenido, obtenerEvento } from "@/lib/contenido/cargar";
import { ogEvento } from "@/lib/imagenes";
import { fondos } from "@/lib/fondos";
import { RUTA_SERVICIO, rutaEvento } from "@/lib/rutas";
import { galeriaEvento } from "@/lib/seo/jsonld";
import { metadatos, urlAbsoluta } from "@/lib/seo/metadatos";

// Solo existen los eventos de content/eventos; cualquier otro slug es 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return obtenerContenido().eventos.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/eventos/[slug]">): Promise<Metadata> {
  const e = obtenerEvento((await params).slug)!;
  return metadatos({
    titulo: e.seo.title,
    descripcion: e.seo.description,
    ruta: rutaEvento(e.slug),
    imagen: ogEvento(e.slug, e.titulo),
  });
}

const ENLACE_SERVICIO = {
  boda: "Conoce nuestro servicio de wedding planner y decoración de bodas",
  quince: "Conoce nuestro servicio de decoración de 15 años",
} as const;

/** Subtítulo con los nombres: "La boda de Juan & Caro", "Los 15 años de Valentina". */
const DE_QUIEN = {
  boda: "La boda de ",
  quince: "Los 15 años de ",
  otro: "",
} as const;

const seccion = "py-(--spacing-seccion)";

/**
 * PRUEBA (2026-10-25): al entrar, título corto + mosaico de fotos (MosaicoEvento) + ficha
 * compacta, para que las fotos se vean en la primera pantalla. false = versión anterior
 * (título grande, ficha completa y la galería debajo), intacta abajo.
 */
const MOSAICO = true;

/** Página de un evento (brief §7.5): long-tail "boda en [lugar], [municipio]". */
export default async function Evento({ params }: PageProps<"/eventos/[slug]">) {
  const e = obtenerEvento((await params).slug)!;
  const ruta = rutaEvento(e.slug);
  const relacionados = eventosRelacionados(e);
  const rutaServicio = e.tipo === "otro" ? undefined : RUTA_SERVICIO[e.tipo];
  // La firma solo acompaña textos reales: sobre un [PENDIENTE] parecería que él lo escribió.
  const { sobre, testimonios } = obtenerContenido();
  const firma = e.descripcion.some((p) => p.includes("[PENDIENTE")) ? undefined : sobre.firma;
  // Los testimonios viven en content/testimonios.json (con su autorización); aquí, el de este evento.
  const testimonio = testimonios.find((t) => t.evento === e.slug);

  // Fondos después de "Sobre el diseño", según lo que tenga el evento (src/lib/fondos.ts).
  const capitulos = e.especial?.capitulos.length ?? 0;
  const conCierre = Boolean(e.especial?.cierre);
  const tramo = fondos([
    ...Array.from({ length: capitulos }, () => ({})),
    ...(testimonio ? [{ prueba: true }] : []),
    ...(conCierre ? [{}] : []),
    ...(relacionados.length ? [{}] : []),
  ]);
  const fondo = {
    capitulos: Array.from({ length: capitulos }, () => tramo.shift()!),
    testimonio: testimonio ? tramo.shift()! : "",
    cierre: conCierre ? tramo.shift()! : "",
    relacionados: relacionados.length ? tramo.shift()! : "",
  };

  return (
    <main>
      <JsonLd datos={[galeriaEvento(e, ruta)]} />

      <div className="contenedor pt-4 pb-(--spacing-seccion)">
        <Migas
          items={[
            { nombre: "Inicio", ruta: "/" },
            { nombre: "Eventos", ruta: "/eventos" },
            { nombre: e.titulo, ruta },
          ]}
        />

        {MOSAICO ? (
          <>
            {/* Título corto arriba y de inmediato el mosaico: fotos en la primera pantalla. */}
            <header className="mt-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 lg:mt-8">
              <div className="max-w-4xl min-w-0">
                <Etiqueta
                  tipo={e.tipo}
                  especial={e.especial && `${e.especial.etiqueta} · ${e.especial.anio}`}
                />
                <h1 className="mt-3 text-titulo-2">{e.titulo}</h1>
                {e.nombres && (
                  <p className="mt-2 font-titulo text-titulo-3 text-topo">
                    {DE_QUIEN[e.tipo]}
                    <ConAmpersand texto={e.nombres} />
                  </p>
                )}
              </div>
              {/* En celular, compartir flota sobre WhatsApp (CompartirFlotante). */}
              <div className="max-lg:hidden">
                <Compartir titulo={e.titulo} url={urlAbsoluta(ruta)} />
              </div>
            </header>
            <div className="mt-6">
              <MosaicoEvento evento={e} />
            </div>
            <div className="mt-6 flex flex-col gap-5 border-b border-linea pb-8 md:flex-row md:items-center md:justify-between md:gap-8">
              <FichaEventoCompacta evento={e} />
              <div className="shrink-0">
                <Boton href="#contacto" origen="evento-quiero-algo-asi">
                  Quiero algo así
                </Boton>
              </div>
            </div>

            <h2 className="mt-10 antetitulo">Todas las fotos ({e.fotos.length})</h2>
            <div className="mt-5">
              <Galeria evento={e} prioridad={false} />
            </div>

            <div className="mt-10 flex flex-wrap items-start gap-3">
              <Boton href="#contacto" origen="evento-quiero-algo-asi-galeria">
                Quiero algo así
              </Boton>
              <Compartir titulo={e.titulo} url={urlAbsoluta(ruta)} />
            </div>
          </>
        ) : (
          <>
            <header className="mt-6 max-w-4xl lg:mt-10">
              <Etiqueta
                tipo={e.tipo}
                especial={e.especial && `${e.especial.etiqueta} · ${e.especial.anio}`}
              />
              <h1 className="mt-4 text-titulo-1">{e.titulo}</h1>
              {e.nombres && (
                <p className="mt-3 font-titulo text-titulo-3 text-topo">
                  {DE_QUIEN[e.tipo]}
                  <ConAmpersand texto={e.nombres} />
                </p>
              )}
            </header>
            <div className="mt-8">
              <FichaEvento evento={e} />
            </div>

            <div className="mt-10">
              <Galeria evento={e} />
            </div>

            <div className="mt-10 flex flex-wrap items-start gap-3">
              <Boton href="#contacto" origen="evento-quiero-algo-asi">
                Quiero algo así
              </Boton>
              <Compartir titulo={e.titulo} url={urlAbsoluta(ruta)} />
            </div>
          </>
        )}
      </div>

      {/* Sobre el diseño + testimonio + proveedores */}
      <section aria-labelledby="diseno-titulo" className={`${seccion} border-t border-linea`}>
        <div className="contenedor grid gap-10 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-4">
            <p className="antetitulo">{e.estilo}</p>
            <h2 id="diseno-titulo" className="mt-3 text-titulo-2">
              Sobre el diseño
            </h2>
            {firma && (
              <a href="/sobre-ruben-dario" className="group mt-6 inline-flex items-center gap-4">
                <Foto
                  evento="sobre"
                  archivo={firma.archivo}
                  alt=""
                  sizes="64px"
                  className="size-16 shrink-0 rounded-full object-cover"
                />
                <span className="min-w-0">
                  <span className="block font-titulo text-titulo-3 group-hover:text-terracota">
                    Rubén Darío
                  </span>
                  <span className="block text-[0.9375rem] text-topo">Diseñador de bodas</span>
                </span>
              </a>
            )}
          </div>
          <div className="min-w-0 lg:col-span-8">
            <div className="lectura space-y-5">
              {e.descripcion.map((p, i) => (
                <p key={p} className={i === 0 ? "font-titulo text-titulo-3" : "text-topo"}>
                  {i === 0 ? <ConAmpersand texto={p} /> : p}
                </p>
              ))}
            </div>

            {e.proveedores.length > 0 && (
              <div className="mt-12 border-t border-linea pt-8">
                <h3 className="antetitulo">Proveedores</h3>
                <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {e.proveedores.map((p) => (
                    <div key={p.rol} className="flex min-w-0 flex-wrap items-baseline gap-x-2">
                      <dt className="text-topo">{p.rol}:</dt>
                      <dd className="min-w-0">
                        {p.rol === "Lugar" && !p.ruta && !p.url ? (
                          // El lugar del evento lleva a su ficha en la guía de lugares.
                          <EnlaceLugar
                            lugar={e.lugar}
                            className="inline-flex min-h-11 items-center text-terracota"
                          />
                        ) : p.ruta ? (
                          <a
                            href={p.ruta}
                            className="inline-flex min-h-11 items-center text-terracota underline underline-offset-4"
                          >
                            {p.nombre}
                          </a>
                        ) : p.url ? (
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noopener"
                            className="inline-flex min-h-11 items-center text-terracota underline underline-offset-4"
                          >
                            {p.nombre}
                          </a>
                        ) : (
                          p.nombre
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Solo la boda especial: capítulos con fotos ("Un sueño de tres", "El vestido…"). */}
      <CapitulosEspeciales evento={e} fondos={fondo.capitulos} />

      {testimonio && (
        <section aria-label="Testimonio" className={`${seccion} ${fondo.testimonio}`}>
          <div className="contenedor">
            <TestimonioEvento evento={e} testimonio={testimonio} />
          </div>
        </section>
      )}

      <CierreEspecial evento={e} firma={sobre.firma} fondo={fondo.cierre} />

      {/* Relacionados + enlace al servicio (cada evento enlaza a su servicio, no a la portada) */}
      {relacionados.length > 0 && (
        <section
          aria-labelledby="relacionados-titulo"
          className={`${seccion} ${fondo.relacionados}`}
        >
          <div className="contenedor">
            <p className="antetitulo">Portafolio</p>
            <h2 id="relacionados-titulo" className="mt-3 text-titulo-2">
              Eventos relacionados
            </h2>
            <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-x-8">
              {relacionados.map((r) => (
                <TarjetaEvento key={r.slug} evento={r} sizes="(min-width: 1024px) 33vw, 50vw" />
              ))}
            </div>
            {rutaServicio && e.tipo !== "otro" && (
              <a
                href={rutaServicio}
                className="mt-12 inline-flex min-h-11 items-center gap-2 font-titulo text-titulo-3 text-terracota hover:underline"
              >
                {ENLACE_SERVICIO[e.tipo]}
                <IconoFlecha className="size-5" />
              </a>
            )}
          </div>
        </section>
      )}

      <SeccionContacto
        tipoInicial={e.tipo}
        referencia={e.nombres ? `${e.titulo} (${e.nombres})` : e.titulo}
        origen="evento"
      />
    </main>
  );
}
