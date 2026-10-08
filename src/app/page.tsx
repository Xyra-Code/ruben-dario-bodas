import Link from "next/link";

import { JsonLd } from "@/components/seo/JsonLd";
import { obtenerContenido } from "@/lib/contenido/cargar";
import { negocio, preguntasFrecuentes, sitioWeb } from "@/lib/seo/jsonld";
import { metadatos } from "@/lib/seo/metadatos";
import { PAGINAS } from "@/lib/seo/paginas";
import { RUTA_SERVICIO, rutaEvento } from "@/lib/rutas";

const pagina = PAGINAS.inicio;

export const metadata = metadatos({
  titulo: pagina.titulo,
  descripcion: pagina.descripcion,
  ruta: pagina.ruta,
});

// Esqueleto de la Fase 3 (estructura y SEO). Secciones y diseño finales: Fases 4 y 5.
export default function Inicio() {
  const { servicios, eventos, preguntasGenerales, sitio } = obtenerContenido();
  const destacados = eventos.filter((e) => e.destacado).slice(0, 6);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <JsonLd datos={[negocio(), sitioWeb(), preguntasFrecuentes(preguntasGenerales)]} />
      <h1 className="text-3xl">{pagina.h1}</h1>

      <section id="servicios" className="mt-8">
        <h2 className="text-xl">Servicios</h2>
        <ul>
          {servicios.map((s) => (
            <li key={s.slug}>
              <Link href={RUTA_SERVICIO[s.tipo]!}>{s.nombre}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="eventos" className="mt-8">
        <h2 className="text-xl">Eventos destacados</h2>
        <ul>
          {destacados.map((e) => (
            <li key={e.slug}>
              <Link href={rutaEvento(e.slug)}>{e.titulo}</Link>
            </li>
          ))}
        </ul>
        <Link href="/eventos">Ver todos los eventos</Link>
      </section>

      <section id="cobertura" className="mt-8">
        <h2 className="text-xl">Llegamos a {sitio.cobertura.resumen}</h2>
        <p>Centro de operación: {sitio.cobertura.sede}.</p>
        {sitio.cobertura.zonas.map((z) => (
          <p key={z.nombre}>
            <strong>{z.nombre}:</strong> {z.municipios.join(" · ")}
          </p>
        ))}
        <Link href="/lugares-para-bodas-villavicencio">Lugares para bodas en Villavicencio</Link>
      </section>

      <section id="preguntas" className="mt-8">
        <h2 className="text-xl">Preguntas frecuentes</h2>
        {preguntasGenerales.map((p) => (
          <details key={p.pregunta}>
            <summary>{p.pregunta}</summary>
            <p>{p.respuesta}</p>
          </details>
        ))}
      </section>

      <section id="contacto" className="mt-8">
        <h2 className="text-xl">Cuéntenos de su evento</h2>
      </section>
    </main>
  );
}
