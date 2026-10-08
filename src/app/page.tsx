import Link from "next/link";

import { SeccionContacto } from "@/components/formulario/SeccionContacto";
import { JsonLd } from "@/components/seo/JsonLd";
import { TarjetaEvento } from "@/components/tarjetas/TarjetaEvento";
import { TarjetaServicio } from "@/components/tarjetas/TarjetaServicio";
import { Acordeon } from "@/components/ui/Acordeon";
import { Boton } from "@/components/ui/Boton";
import { Cita } from "@/components/ui/Cita";
import { Foto } from "@/components/ui/Foto";
import { Pasos } from "@/components/ui/Pasos";
import { TituloSeccion } from "@/components/ui/TituloSeccion";
import { obtenerContenido } from "@/lib/contenido/cargar";
import { esEnlace } from "@/lib/formato";
import { RUTA_SERVICIO } from "@/lib/rutas";
import { negocio, preguntasFrecuentes, sitioWeb } from "@/lib/seo/jsonld";
import { metadatos } from "@/lib/seo/metadatos";
import { PAGINAS } from "@/lib/seo/paginas";
import { MENSAJES, enlaceWhatsApp } from "@/lib/whatsapp";

const pagina = PAGINAS.inicio;

export const metadata = metadatos({
  titulo: pagina.titulo,
  descripcion: pagina.descripcion,
  ruta: pagina.ruta,
});

const seccion = "py-(--spacing-seccion)";

/**
 * Portada: resume y enlaza (no compite con /bodas ni /quince-anos). Secciones del mapa del
 * sitio §4: portada, servicios, destacados, cómo trabajamos, sobre, testimonios,
 * cobertura, preguntas y contacto.
 */
export default function Inicio() {
  const { sitio, servicios, eventos, proceso, sobre, testimonios, preguntasGenerales } =
    obtenerContenido();
  const destacados = eventos.filter((e) => e.destacado).slice(0, 6);
  const portada = destacados.find((e) => e.tipo === "boda") ?? eventos[0];
  const fotoPortada = portada?.fotos.find((f) => f.archivo === portada.portada);
  // Foto de cada servicio: un evento del tipo distinto al de la portada; si solo hay uno,
  // otra foto de ese mismo evento. Así la portada y la tarjeta no repiten imagen.
  const fotoServicio = (tipo: "boda" | "quince") => {
    const otro = eventos.find((e) => e.tipo === tipo && e.slug !== portada?.slug);
    if (otro) {
      const f = otro.fotos.find((x) => x.archivo === otro.portada)!;
      return { evento: otro.slug, archivo: f.archivo, alt: f.alt };
    }
    const mismo = eventos.find((e) => e.tipo === tipo);
    const f = mismo?.fotos.find((x) => x.archivo !== mismo.portada) ?? mismo?.fotos[0];
    return mismo && f ? { evento: mismo.slug, archivo: f.archivo, alt: f.alt } : undefined;
  };
  const bodas = servicios.find((s) => s.tipo === "boda")!;
  const quince = servicios.find((s) => s.tipo === "quince")!;

  return (
    <main>
      <JsonLd datos={[negocio(), sitioWeb(), preguntasFrecuentes(preguntasGenerales)]} />

      {/* 1 · Portada */}
      <section
        id="inicio"
        aria-labelledby="inicio-titulo"
        className="pt-6 pb-(--spacing-seccion) lg:pt-10"
      >
        <div className="contenedor grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 lg:col-span-6">
            <p className="antetitulo">Rubén Darío · Diseñador de bodas</p>
            <h1 id="inicio-titulo" className="mt-4 text-titulo-1">
              {pagina.h1}
            </h1>
            <p className="mt-6 max-w-md text-lg text-topo">{sitio.lema}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Boton href="#contacto" origen="portada-cotizar">
                Cotizar mi evento
              </Boton>
              <Boton href="/eventos" variante="secundario">
                Ver eventos
              </Boton>
            </div>
          </div>
          {portada && fotoPortada && (
            <div className="min-w-0 lg:col-span-6">
              <Foto
                evento={portada.slug}
                archivo={fotoPortada.archivo}
                alt={fotoPortada.alt}
                prioridad
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="aspect-[4/5] w-full rounded-sm object-cover sm:aspect-[3/2] lg:aspect-[4/5] xl:aspect-[5/6]"
              />
            </div>
          )}
        </div>
      </section>

      {/* 2 · Servicios */}
      <section
        id="servicios"
        aria-labelledby="servicios-titulo"
        className={`${seccion} border-t border-linea`}
      >
        <div className="contenedor">
          <TituloSeccion
            id="servicios-titulo"
            antetitulo="Servicios"
            titulo="Bodas y fiestas de 15 años con diseño de autor"
            intro="Cada evento se diseña con un estilo y una paleta propios: nada de decoración genérica de alquiler."
          />
          <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
            <TarjetaServicio
              titulo={bodas.nombre}
              texto={bodas.bajada}
              ruta={RUTA_SERVICIO.boda!}
              foto={fotoServicio("boda")}
              destacada
            />
            <div className="grid min-w-0 content-start gap-12">
              <TarjetaServicio
                titulo={quince.nombre}
                texto={quince.bajada}
                ruta={RUTA_SERVICIO.quince!}
                foto={fotoServicio("quince")}
              />
              <article className="min-w-0 rounded-sm bg-rubor p-6 sm:p-8">
                <h3 className="text-titulo-3">Otros eventos</h3>
                <p className="mt-2 text-topo">
                  Celebraciones especiales con el mismo cuidado en el diseño. Cuéntenos qué tiene en
                  mente.
                </p>
                <div className="mt-6">
                  <Boton
                    href={enlaceWhatsApp(sitio.whatsapp, MENSAJES.otros)}
                    whatsapp
                    variante="secundario"
                    origen="servicios-otros"
                  >
                    Escríbanos
                  </Boton>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* 3 · Eventos destacados */}
      {destacados.length > 0 && (
        <section id="eventos" aria-labelledby="eventos-titulo" className={`${seccion} bg-rubor`}>
          <div className="contenedor">
            <TituloSeccion
              id="eventos-titulo"
              antetitulo="Portafolio"
              titulo="Eventos destacados"
              accion={
                <Boton href="/eventos" variante="secundario">
                  Ver todos los eventos
                </Boton>
              }
            />
            <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
              {destacados.map((e) => (
                <TarjetaEvento key={e.slug} evento={e} sizes="(min-width: 1024px) 33vw, 50vw" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4 · Cómo trabajamos */}
      <section id="como-trabajamos" aria-labelledby="proceso-titulo" className={seccion}>
        <div className="contenedor">
          <TituloSeccion
            id="proceso-titulo"
            antetitulo="Cómo trabajamos"
            titulo="De la primera conversación a su día"
          />
          <div className="mt-12">
            <Pasos pasos={proceso} />
          </div>
        </div>
      </section>

      {/* 5 · Sobre Rubén Darío */}
      <section
        id="sobre"
        aria-labelledby="sobre-titulo"
        className={`${seccion} border-t border-linea`}
      >
        <div className="contenedor grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {sobre.retrato && (
            <div className="min-w-0">
              <Foto
                evento="sobre"
                archivo={sobre.retrato.archivo}
                alt={sobre.retrato.alt}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="aspect-[4/5] w-full rounded-sm object-cover"
              />
            </div>
          )}
          <div className={`min-w-0 ${sobre.retrato ? "" : "lg:col-span-2 lg:max-w-3xl"}`}>
            <p className="antetitulo">Sobre Rubén Darío</p>
            <h2 id="sobre-titulo" className="mt-3 text-titulo-2">
              Quién diseña su evento
            </h2>
            <p className="mt-5 text-topo">{sobre.resumen}</p>
            {sitio.cifras.length > 0 && (
              <dl className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(min(8rem,100%),1fr))] gap-6 border-y border-linea py-6">
                {sitio.cifras.map((c) => (
                  <div key={c.etiqueta} className="min-w-0">
                    <dt className="sr-only">{c.etiqueta}</dt>
                    <dd>
                      <span className="block font-titulo text-4xl [overflow-wrap:anywhere] text-terracota">
                        {c.valor}
                      </span>
                      <span className="mt-1 block text-sm text-topo" aria-hidden="true">
                        {c.etiqueta}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            <div className="mt-6">
              <Boton href={PAGINAS.sobre.ruta} variante="texto">
                Conozca su historia
              </Boton>
            </div>
          </div>
        </div>
      </section>

      {/* 6 · Testimonios */}
      {testimonios.length > 0 && (
        <section
          id="testimonios"
          aria-labelledby="testimonios-titulo"
          className={`${seccion} bg-rubor`}
        >
          <div className="contenedor">
            <TituloSeccion
              id="testimonios-titulo"
              antetitulo="Testimonios"
              titulo="Lo que dicen quienes celebraron con nosotros"
              accion={
                esEnlace(sitio.google.perfil) ? (
                  <Boton href={sitio.google.perfil} variante="texto">
                    Vea nuestras reseñas en Google
                  </Boton>
                ) : undefined
              }
            />
            <div className="mt-12 grid gap-6 md:grid-cols-[repeat(auto-fit,minmax(min(18rem,100%),1fr))]">
              {testimonios.slice(0, 3).map((t) => {
                const evento = eventos.find((e) => e.slug === t.evento);
                return (
                  <Cita
                    key={t.texto}
                    texto={t.texto}
                    autor={t.autor}
                    detalle={evento?.titulo ?? (t.tipo === "boda" ? "Boda" : "15 años")}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 7 · Cobertura */}
      <section id="cobertura" aria-labelledby="cobertura-titulo" className={seccion}>
        <div className="contenedor">
          <TituloSeccion
            id="cobertura-titulo"
            antetitulo="Cobertura"
            titulo={`Llegamos a ${sitio.cobertura.resumen}`}
            intro={`Nuestro centro de operación está en ${sitio.cobertura.sede}. Desde allí diseñamos y montamos eventos en salones, haciendas y fincas de toda la región.`}
            accion={
              <Boton href={PAGINAS.lugares.ruta} variante="texto">
                Lugares para bodas en Villavicencio
              </Boton>
            }
          />
          <ul className="mt-12 grid gap-6 md:grid-cols-[repeat(auto-fit,minmax(min(16rem,100%),1fr))]">
            {sitio.cobertura.zonas.map((z) => (
              <li key={z.nombre} className="min-w-0 border-t border-dorado/50 pt-5">
                <h3 className="text-titulo-3">{z.nombre}</h3>
                <p className="mt-2 text-topo">{z.municipios.join(" · ")}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 8 · Preguntas frecuentes */}
      <section
        id="preguntas"
        aria-labelledby="preguntas-titulo"
        className={`${seccion} border-t border-linea`}
      >
        <div className="contenedor grid gap-10 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-4">
            <p className="antetitulo">Preguntas frecuentes</p>
            <h2 id="preguntas-titulo" className="mt-3 text-titulo-2">
              Antes de cotizar
            </h2>
            <p className="mt-4 text-topo">
              ¿Su pregunta no está aquí?{" "}
              <Link href="#contacto" className="text-terracota underline underline-offset-4">
                Escríbanos
              </Link>
              .
            </p>
          </div>
          <div className="min-w-0 lg:col-span-8">
            <Acordeon preguntas={preguntasGenerales} />
          </div>
        </div>
      </section>

      {/* 9 · Contacto */}
      <SeccionContacto origen="inicio" />
    </main>
  );
}
