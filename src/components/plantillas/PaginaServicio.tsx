import type { Metadata } from "next";

import { SeccionContacto } from "@/components/formulario/SeccionContacto";
import { Migas } from "@/components/navegacion/Migas";
import { JsonLd } from "@/components/seo/JsonLd";
import { TarjetaEvento } from "@/components/tarjetas/TarjetaEvento";
import { Acordeon } from "@/components/ui/Acordeon";
import { Boton } from "@/components/ui/Boton";
import { Cita } from "@/components/ui/Cita";
import { Foto } from "@/components/ui/Foto";
import { TituloSeccion } from "@/components/ui/TituloSeccion";
import { obtenerContenido, obtenerServicio } from "@/lib/contenido/cargar";
import type { TipoEvento } from "@/lib/contenido/esquemas";
import { OG_SITIO, ogEvento } from "@/lib/imagenes";
import { NOMBRE_SERVICIO, RUTA_SERVICIO } from "@/lib/rutas";
import { preguntasFrecuentes, servicio as servicioJsonLd } from "@/lib/seo/jsonld";
import { metadatos } from "@/lib/seo/metadatos";

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

const TEXTOS: Record<"boda" | "quince", { cotizar: string; galeria: string; testimonios: string }> =
  {
    boda: {
      cotizar: "Cotizar mi boda",
      galeria: "Bodas que hemos diseñado",
      testimonios: "Lo que dicen las parejas",
    },
    quince: {
      cotizar: "Cotizar mi fiesta",
      galeria: "Fiestas de 15 años que hemos diseñado",
      testimonios: "Lo que dicen las familias",
    },
  };

const seccion = "py-(--spacing-seccion)";

/**
 * Página de servicio (/bodas, /quince-anos): cada una compite por su búsqueda, con texto
 * propio y preguntas que no repiten las de la portada. Brief §7.2–7.3.
 */
export function PaginaServicio({ tipo }: { tipo: "boda" | "quince" }) {
  const s = obtenerServicio(tipo)!;
  const ruta = RUTA_SERVICIO[tipo]!;
  const { eventos: todos, testimonios: todosTestimonios } = obtenerContenido();
  const eventos = todos.filter((e) => e.tipo === tipo);
  const testimonios = todosTestimonios.filter((t) => t.tipo === tipo).slice(0, 3);
  const textos = TEXTOS[tipo];

  // Portada: la foto principal del evento más reciente; presentación: otra foto vertical.
  const principal = eventos[0];
  const fotoPortada = principal?.fotos.find((f) => f.archivo === principal.portada);
  const fotoPresentacion =
    eventos[1]?.fotos.find((f) => f.archivo === eventos[1].portada) ??
    principal?.fotos.find((f) => f.archivo !== principal.portada);
  const eventoPresentacion = eventos[1] && fotoPresentacion ? eventos[1] : principal;

  return (
    <main>
      <JsonLd datos={[servicioJsonLd(s, ruta), preguntasFrecuentes(s.preguntas)]} />

      {/* Migas + portada */}
      <section aria-labelledby="servicio-titulo" className="pt-4 pb-(--spacing-seccion)">
        <div className="contenedor">
          <Migas
            items={[
              { nombre: "Inicio", ruta: "/" },
              { nombre: NOMBRE_SERVICIO[tipo]!, ruta },
            ]}
          />
          <div className="mt-6 grid items-center gap-10 lg:mt-10 lg:grid-cols-2 lg:gap-12">
            <div className="min-w-0">
              <p className="antetitulo">{s.nombre}</p>
              <h1 id="servicio-titulo" className="mt-4 text-titulo-1">
                {s.h1}
              </h1>
              <p className="mt-6 max-w-md text-lg text-topo">{s.bajada}</p>
              <div className="mt-8">
                <Boton href="#contacto" origen={`${s.slug}-portada`}>
                  {textos.cotizar}
                </Boton>
              </div>
            </div>
            {principal && fotoPortada && (
              <div className="min-w-0">
                <Foto
                  evento={principal.slug}
                  archivo={fotoPortada.archivo}
                  alt={fotoPortada.alt}
                  prioridad
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="aspect-[4/5] w-full rounded-sm object-cover sm:aspect-[3/2] lg:aspect-[4/5]"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Presentación (texto propio de la empresa) */}
      <section aria-label="Presentación" className={`${seccion} border-t border-linea`}>
        <div className="contenedor grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="min-w-0 lg:col-span-7">
            <div className="lectura space-y-5">
              {s.introduccion.map((p, i) => (
                <p
                  key={p}
                  className={i === 0 ? "font-titulo text-titulo-3 text-carbon" : "text-topo"}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
          {eventoPresentacion && fotoPresentacion && (
            <div className="min-w-0 lg:col-span-5">
              <Foto
                evento={eventoPresentacion.slug}
                archivo={fotoPresentacion.archivo}
                alt={fotoPresentacion.alt}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="aspect-[4/5] w-full rounded-sm object-cover"
              />
            </div>
          )}
        </div>
      </section>

      {/* Tipos de boda / temáticas */}
      <section aria-labelledby="variantes-titulo" className={`${seccion} bg-rubor`}>
        <div className="contenedor">
          <TituloSeccion id="variantes-titulo" antetitulo={s.nombre} titulo={s.variantes.titulo} />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {s.variantes.items.map((v) => (
              <li key={v.nombre} className="min-w-0 border-t border-dorado/60 bg-marfil p-6">
                <h3 className="text-titulo-3">{v.nombre}</h3>
                <p className="mt-2 text-[0.9375rem] text-topo">{v.descripcion}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Qué incluye */}
      <section aria-labelledby="incluye-titulo" className={seccion}>
        <div className="contenedor grid gap-10 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-4">
            <p className="antetitulo">El servicio</p>
            <h2 id="incluye-titulo" className="mt-3 text-titulo-2">
              Qué incluye
            </h2>
          </div>
          <ul className="grid min-w-0 gap-x-10 sm:grid-cols-2 lg:col-span-8">
            {s.incluye.map((item, i) => (
              <li key={item} className="flex min-w-0 gap-4 border-b border-linea py-4">
                <span aria-hidden="true" className="font-titulo text-xl text-dorado-texto">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 pt-0.5">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Galería: eventos del tipo */}
      {eventos.length > 0 && (
        <section aria-labelledby="galeria-titulo" className={`${seccion} border-t border-linea`}>
          <div className="contenedor">
            <TituloSeccion
              id="galeria-titulo"
              antetitulo="Portafolio"
              titulo={textos.galeria}
              accion={
                <Boton href="/eventos" variante="secundario">
                  Ver todos los eventos
                </Boton>
              }
            />
            <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
              {eventos.slice(0, 9).map((e) => (
                <TarjetaEvento key={e.slug} evento={e} sizes="(min-width: 1024px) 33vw, 50vw" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Inversión */}
      <section aria-labelledby="inversion-titulo" className={`${seccion} bg-rubor`}>
        <div className="contenedor">
          <div className="mx-auto max-w-3xl text-center">
            <p className="antetitulo">Inversión</p>
            <h2 id="inversion-titulo" className="mt-3 text-titulo-2">
              Desde{" "}
              <span className="[overflow-wrap:anywhere] text-terracota">{s.inversion.desde}</span>
            </h2>
            <div className="mx-auto mt-6 filete-dorado w-24" />
            <p className="mx-auto mt-6 max-w-xl text-topo">{s.inversion.nota}</p>
            <div className="mt-8">
              <Boton href="#contacto" origen={`${s.slug}-inversion`}>
                {textos.cotizar}
              </Boton>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios del tipo */}
      {testimonios.length > 0 && (
        <section aria-labelledby="testimonios-titulo" className={seccion}>
          <div className="contenedor">
            <TituloSeccion
              id="testimonios-titulo"
              antetitulo="Testimonios"
              titulo={textos.testimonios}
            />
            <div className="mt-12 grid gap-6 md:grid-cols-[repeat(auto-fit,minmax(min(18rem,100%),1fr))]">
              {testimonios.map((t) => (
                <Cita
                  key={t.texto}
                  texto={t.texto}
                  autor={t.autor}
                  detalle={todos.find((e) => e.slug === t.evento)?.titulo}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Preguntas frecuentes propias */}
      <section aria-labelledby="preguntas-titulo" className={`${seccion} border-t border-linea`}>
        <div className="contenedor grid gap-10 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-4">
            <p className="antetitulo">Preguntas frecuentes</p>
            <h2 id="preguntas-titulo" className="mt-3 text-titulo-2">
              Sobre {tipo === "boda" ? "la decoración de su boda" : "la decoración de 15 años"}
            </h2>
          </div>
          <div className="min-w-0 lg:col-span-8">
            <Acordeon preguntas={s.preguntas} />
          </div>
        </div>
      </section>

      <SeccionContacto tipoInicial={tipo} origen={s.slug} />
    </main>
  );
}
