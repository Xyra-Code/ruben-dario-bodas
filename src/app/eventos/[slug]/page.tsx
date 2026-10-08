import type { Metadata } from "next";

import { Compartir } from "@/components/evento/Compartir";
import { FichaEvento } from "@/components/evento/FichaEvento";
import { SeccionContacto } from "@/components/formulario/SeccionContacto";
import { Galeria } from "@/components/galeria/Galeria";
import { Migas } from "@/components/navegacion/Migas";
import { JsonLd } from "@/components/seo/JsonLd";
import { TarjetaEvento } from "@/components/tarjetas/TarjetaEvento";
import { Boton } from "@/components/ui/Boton";
import { Cita } from "@/components/ui/Cita";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { IconoFlecha } from "@/components/ui/Iconos";
import { eventosRelacionados, obtenerContenido, obtenerEvento } from "@/lib/contenido/cargar";
import { ogEvento } from "@/lib/imagenes";
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
  boda: "Conozca nuestro servicio de decoración de bodas",
  quince: "Conozca nuestro servicio de decoración de 15 años",
} as const;

const seccion = "py-(--spacing-seccion)";

/** Página de un evento (brief §7.5): long-tail "boda en [lugar], [municipio]". */
export default async function Evento({ params }: PageProps<"/eventos/[slug]">) {
  const e = obtenerEvento((await params).slug)!;
  const ruta = rutaEvento(e.slug);
  const relacionados = eventosRelacionados(e);
  const rutaServicio = e.tipo === "otro" ? undefined : RUTA_SERVICIO[e.tipo];

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

        <header className="mt-6 max-w-4xl lg:mt-10">
          <Etiqueta tipo={e.tipo} />
          <h1 className="mt-4 text-titulo-1">{e.titulo}</h1>
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
      </div>

      {/* Sobre el diseño + testimonio + proveedores */}
      <section aria-labelledby="diseno-titulo" className={`${seccion} border-t border-linea`}>
        <div className="contenedor grid gap-10 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-4">
            <p className="antetitulo">{e.estilo}</p>
            <h2 id="diseno-titulo" className="mt-3 text-titulo-2">
              Sobre el diseño
            </h2>
          </div>
          <div className="min-w-0 lg:col-span-8">
            <div className="lectura space-y-5">
              {e.descripcion.map((p, i) => (
                <p key={p} className={i === 0 ? "font-titulo text-titulo-3" : "text-topo"}>
                  {p}
                </p>
              ))}
            </div>

            {e.proveedores.length > 0 && (
              <div className="mt-12 border-t border-linea pt-8">
                <h3 className="antetitulo">Proveedores</h3>
                <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {e.proveedores.map((p) => (
                    <div key={p.rol} className="flex min-w-0 flex-wrap gap-x-2">
                      <dt className="text-topo">{p.rol}:</dt>
                      <dd className="min-w-0">
                        {p.url ? (
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

      {e.testimonio && (
        <section aria-label="Testimonio" className={`${seccion} bg-rubor`}>
          <div className="contenedor">
            <Cita
              variante="destacada"
              texto={e.testimonio.texto}
              autor={e.testimonio.autor}
              detalle={e.titulo}
            />
          </div>
        </section>
      )}

      {/* Relacionados + enlace al servicio (cada evento enlaza a su servicio, no a la portada) */}
      {relacionados.length > 0 && (
        <section aria-labelledby="relacionados-titulo" className={seccion}>
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

      <SeccionContacto tipoInicial={e.tipo} referencia={e.titulo} origen="evento" />
    </main>
  );
}
