import type { Metadata } from "next";
import Link from "next/link";

import { Migas } from "@/components/navegacion/Migas";
import { JsonLd } from "@/components/seo/JsonLd";
import { Foto } from "@/components/ui/Foto";
import { eventosRelacionados, obtenerContenido, obtenerEvento } from "@/lib/contenido/cargar";
import { ogEvento } from "@/lib/imagenes";
import { galeriaEvento } from "@/lib/seo/jsonld";
import { metadatos } from "@/lib/seo/metadatos";
import { NOMBRE_SERVICIO, RUTA_SERVICIO, rutaEvento, ubicacion } from "@/lib/rutas";
import { SeccionContacto } from "@/components/formulario/SeccionContacto";

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

// Esqueleto de la Fase 3. Visor a pantalla completa, compartir y diseño: Fases 4 y 5.
export default async function Evento({ params }: PageProps<"/eventos/[slug]">) {
  const e = obtenerEvento((await params).slug)!;
  const ruta = rutaEvento(e.slug);
  const rutaServicio = RUTA_SERVICIO[e.tipo];

  return (
    <main>
      <div className="contenedor py-8 lg:py-12">
        <JsonLd datos={[galeriaEvento(e, ruta)]} />
        <Migas
          items={[
            { nombre: "Inicio", ruta: "/" },
            { nombre: "Eventos", ruta: "/eventos" },
            { nombre: e.titulo, ruta },
          ]}
        />
        <h1 className="text-titulo-1">{e.titulo}</h1>
        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4">
          <dt>Lugar</dt>
          <dd className="min-w-0">{e.lugar.nombre}</dd>
          <dt>Municipio</dt>
          <dd className="min-w-0">{ubicacion(e.lugar)}</dd>
          <dt>Estilo</dt>
          <dd className="min-w-0">{e.estilo}</dd>
          <dt>Fecha</dt>
          <dd className="min-w-0 first-letter:uppercase">{e.fechaTexto}</dd>
          <dt>Paleta</dt>
          <dd className="min-w-0">{e.paleta.map((c) => c.nombre).join(", ")}</dd>
        </dl>

        <div className="mt-8 grid grid-cols-2 gap-2 lg:grid-cols-3">
          {e.fotos.map((f, i) => (
            <Foto
              key={f.archivo}
              evento={e.slug}
              archivo={f.archivo}
              alt={f.alt}
              sizes="(min-width: 1024px) 33vw, 50vw"
              prioridad={i === 0}
              className="aspect-[4/5] w-full object-cover"
            />
          ))}
        </div>

        <section className="mt-8">
          <h2 className="text-titulo-3">Sobre el diseño</h2>
          {e.descripcion.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </section>

        {e.testimonio && (
          <blockquote className="mt-8">
            {e.testimonio.texto} — {e.testimonio.autor}
          </blockquote>
        )}

        {e.proveedores.length > 0 && (
          <section className="mt-8">
            <h2 className="text-titulo-3">Proveedores</h2>
            <ul>
              {e.proveedores.map((p) => (
                <li key={p.rol}>
                  {p.rol}: {p.url ? <a href={p.url}>{p.nombre}</a> : p.nombre}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-8">
          <h2 className="text-titulo-3">Eventos relacionados</h2>
          <ul>
            {eventosRelacionados(e).map((r) => (
              <li key={r.slug}>
                <Link href={rutaEvento(r.slug)}>{r.titulo}</Link>
              </li>
            ))}
          </ul>
        </section>

        {rutaServicio && (
          <p className="mt-8">
            <Link href={rutaServicio}>
              Conozca nuestro servicio de decoración de {NOMBRE_SERVICIO[e.tipo]!.toLowerCase()}
            </Link>
          </p>
        )}
      </div>
      <SeccionContacto tipoInicial={e.tipo} referencia={e.titulo} origen="evento" />
    </main>
  );
}
