import Link from "next/link";
import type { Metadata } from "next";

import { Migas } from "@/components/navegacion/Migas";
import { JsonLd } from "@/components/seo/JsonLd";
import { Foto } from "@/components/ui/Foto";
import { obtenerContenido, obtenerServicio } from "@/lib/contenido/cargar";
import type { TipoEvento } from "@/lib/contenido/esquemas";
import { OG_SITIO, ogEvento } from "@/lib/imagenes";
import { preguntasFrecuentes, servicio as servicioJsonLd } from "@/lib/seo/jsonld";
import { metadatos } from "@/lib/seo/metadatos";
import { NOMBRE_SERVICIO, RUTA_SERVICIO, rutaEvento } from "@/lib/rutas";

/** Metadata de /bodas o /quince-anos; para compartir, la portada del evento más reciente del tipo. */
export function metadatosServicio(tipo: TipoEvento): Metadata {
  const s = obtenerServicio(tipo)!;
  const reciente = obtenerContenido().eventos.find((e) => e.tipo === tipo);
  return metadatos({
    titulo: s.seo.title,
    descripcion: s.seo.description,
    ruta: RUTA_SERVICIO[tipo]!,
    imagen: reciente ? ogEvento(reciente.slug, reciente.titulo) : OG_SITIO,
  });
}

// Esqueleto de la Fase 3 (estructura y SEO). Diseño final: Fases 4 y 5.
export function PaginaServicio({ tipo }: { tipo: TipoEvento }) {
  const s = obtenerServicio(tipo)!;
  const ruta = RUTA_SERVICIO[tipo]!;
  const eventos = obtenerContenido().eventos.filter((e) => e.tipo === tipo);
  const testimonios = obtenerContenido().testimonios.filter((t) => t.tipo === tipo);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <JsonLd datos={[servicioJsonLd(s, ruta), preguntasFrecuentes(s.preguntas)]} />
      <Migas
        items={[
          { nombre: "Inicio", ruta: "/" },
          { nombre: NOMBRE_SERVICIO[tipo]!, ruta },
        ]}
      />
      <h1 className="text-3xl">{s.h1}</h1>
      <p>{s.bajada}</p>

      <section className="mt-8">
        {s.introduccion.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </section>

      <section className="mt-8">
        <h2 className="text-xl">{s.variantes.titulo}</h2>
        <ul>
          {s.variantes.items.map((v) => (
            <li key={v.nombre}>
              <strong>{v.nombre}</strong>: {v.descripcion}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl">Qué incluye</h2>
        <ul>
          {s.incluye.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl">Galería</h2>
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
          {eventos.map((e) => (
            <Link key={e.slug} href={rutaEvento(e.slug)} className="min-w-0">
              <Foto
                evento={e.slug}
                archivo={e.portada}
                alt={e.fotos.find((f) => f.archivo === e.portada)!.alt}
                sizes="(min-width: 1024px) 33vw, 50vw"
                className="aspect-[4/5] w-full object-cover"
              />
              <span>{e.titulo}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl">Inversión</h2>
        <p>Desde {s.inversion.desde}</p>
        <p>{s.inversion.nota}</p>
      </section>

      {testimonios.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl">Testimonios</h2>
          {testimonios.map((t) => (
            <blockquote key={t.texto}>
              {t.texto} — {t.autor}
            </blockquote>
          ))}
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-xl">Preguntas frecuentes</h2>
        {s.preguntas.map((p) => (
          <details key={p.pregunta}>
            <summary>{p.pregunta}</summary>
            <p>{p.respuesta}</p>
          </details>
        ))}
      </section>
    </main>
  );
}
