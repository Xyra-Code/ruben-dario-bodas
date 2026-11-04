import type { Metadata } from "next";
import Link from "next/link";

import { TestimonioEvento } from "@/components/evento/TestimonioEvento";
import { SeccionContacto } from "@/components/formulario/SeccionContacto";
import { GrillaConMas } from "@/components/galeria/GrillaConMas";
import {
  CLASES_IMG_PORTADA,
  MEDIDAS_FOTO_PORTADA,
  PortadaConFoto,
  SIZES_FOTO_PORTADA,
} from "@/components/plantillas/PortadaConFoto";
import { SeccionInversion } from "@/components/plantillas/SeccionInversion";
import { JsonLd } from "@/components/seo/JsonLd";
import { TarjetaEvento } from "@/components/tarjetas/TarjetaEvento";
import { TarjetaTestimonio } from "@/components/tarjetas/TarjetaTestimonio";
import { Boton } from "@/components/ui/Boton";
import { CreditoEvento } from "@/components/ui/CreditoEvento";
import { Foto } from "@/components/ui/Foto";
import { IconoFlecha } from "@/components/ui/Iconos";
import { SeccionPreguntas } from "@/components/ui/SeccionPreguntas";
import { AccionAlFinal, TituloSeccion } from "@/components/ui/TituloSeccion";
import { obtenerContenido, obtenerServicio } from "@/lib/contenido/cargar";
import type { TipoEvento } from "@/lib/contenido/esquemas";
import { esRubor, fondos } from "@/lib/fondos";
import { OG_SITIO, ogEvento } from "@/lib/imagenes";
import { NOMBRE_SERVICIO, RUTA_SERVICIO } from "@/lib/rutas";
import { preguntasFrecuentes, servicio as servicioJsonLd } from "@/lib/seo/jsonld";
import { metadatos } from "@/lib/seo/metadatos";
import { PAGINAS } from "@/lib/seo/paginas";
import { testimoniosDelServicio } from "@/lib/testimonios";

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

const TEXTOS: Record<
  "boda" | "quince",
  { cotizar: string; galeria: string; verMas: string; testimonios: string }
> = {
  boda: {
    cotizar: "Cotizar mi boda",
    galeria: "Bodas que hemos diseñado",
    verMas: "Ver más bodas",
    testimonios: "Lo que dicen las parejas",
  },
  quince: {
    cotizar: "Cotizar mi fiesta",
    galeria: "Fiestas de 15 años que hemos diseñado",
    verMas: "Ver más fiestas de 15 años",
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
  const testimonios = testimoniosDelServicio(tipo, todosTestimonios, todos);
  const textos = TEXTOS[tipo];

  // Portada: la foto principal del evento más reciente; presentación: otra foto vertical.
  const principal = eventos[0];
  const fotoPortada = principal?.fotos.find((f) => f.archivo === principal.portada);
  const fotoPresentacion =
    eventos[1]?.fotos.find((f) => f.archivo === eventos[1].portada) ??
    principal?.fotos.find((f) => f.archivo !== principal.portada);
  const eventoPresentacion = eventos[1] && fotoPresentacion ? eventos[1] : principal;

  // Fondos según las secciones que existen: galería y testimonios (la prueba de trabajo)
  // en rubor, el resto alternando (src/lib/fondos.ts).
  const conGaleria = eventos.length > 0;
  const conTestimonios = testimonios.cortos.length > 0;
  const tramo = fondos(
    [
      {}, // presentación
      ...(s.secciones ?? []).map(() => ({})),
      {}, // tipos de boda / temáticas
      {}, // qué incluye
      ...(conGaleria ? [{ prueba: true }] : []),
      {}, // inversión
      ...(conTestimonios ? [{ prueba: true }] : []),
      {}, // preguntas
    ],
    "marfil",
  );
  const fondo = {
    presentacion: tramo.shift()!,
    secciones: (s.secciones ?? []).map(() => tramo.shift()!),
    variantes: tramo.shift()!,
    incluye: tramo.shift()!,
    galeria: conGaleria ? tramo.shift()! : "",
    inversion: tramo.shift()!,
    testimonios: conTestimonios ? tramo.shift()! : "",
    preguntas: tramo.shift()!,
  };

  return (
    <main>
      <JsonLd datos={[servicioJsonLd(s, ruta), preguntasFrecuentes(s.preguntas)]} />

      <PortadaConFoto
        idTitulo="servicio-titulo"
        migas={[
          { nombre: "Inicio", ruta: "/" },
          { nombre: NOMBRE_SERVICIO[tipo]!, ruta },
        ]}
        foto={
          principal && fotoPortada
            ? { evento: principal.slug, archivo: fotoPortada.archivo, alt: fotoPortada.alt }
            : undefined
        }
      >
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
      </PortadaConFoto>

      {/* Presentación (texto propio de la empresa). En escritorio la foto va a la izquierda,
          al revés que en la portada (texto | foto), para que las dos secciones no se repitan.
          En el celular sigue texto → foto: la foto de la portada ya quedó arriba. */}
      <section aria-label="Presentación" className={`${seccion} ${fondo.presentacion}`}>
        <div className="contenedor grid items-center gap-10 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-16">
          <div className="min-w-0">
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
            <figure className={`relative min-w-0 lg:order-first lg:ml-0 ${MEDIDAS_FOTO_PORTADA}`}>
              <Foto
                evento={eventoPresentacion.slug}
                archivo={fotoPresentacion.archivo}
                alt={fotoPresentacion.alt}
                sizes={SIZES_FOTO_PORTADA}
                className={CLASES_IMG_PORTADA}
              />
              <CreditoEvento evento={eventoPresentacion.slug} enlace />
            </figure>
          )}
        </div>
      </section>

      {/* Secciones propias (bodas: wedding planner y especialidades), cada una con su H2 */}
      {s.secciones?.map((sec, n) => (
        <section
          key={sec.titulo}
          aria-labelledby={`seccion-${n}-titulo`}
          className={`${seccion} ${fondo.secciones[n]}`}
        >
          <div className="contenedor grid gap-10 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-4">
              <p className="antetitulo">{sec.antetitulo}</p>
              <h2 id={`seccion-${n}-titulo`} className="mt-3 text-titulo-2">
                {sec.titulo}
              </h2>
              {sec.intro && <p className="mt-4 text-topo">{sec.intro}</p>}
            </div>
            <ul className="grid min-w-0 gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-8">
              {sec.items.map((item) => (
                <li key={item.nombre} className="min-w-0 border-t border-dorado/60 pt-5">
                  <h3 className="text-titulo-3">{item.nombre}</h3>
                  <p className="mt-2 text-[0.9375rem] text-topo">{item.descripcion}</p>
                  {item.enlace && (
                    <Link
                      href={item.enlace.ruta}
                      className="mt-3 inline-flex min-h-11 items-center gap-2 text-terracota hover:underline"
                    >
                      {item.enlace.texto}
                      <IconoFlecha className="size-4" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      {/* Tipos de boda / temáticas */}
      <section aria-labelledby="variantes-titulo" className={`${seccion} ${fondo.variantes}`}>
        <div className="contenedor">
          <TituloSeccion id="variantes-titulo" antetitulo={s.nombre} titulo={s.variantes.titulo} />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {s.variantes.items.map((v) => (
              <li
                key={v.nombre}
                className={`min-w-0 border-t border-dorado/60 p-6 ${
                  esRubor(fondo.variantes) ? "bg-marfil" : "bg-rubor"
                }`}
              >
                <h3 className="text-titulo-3">{v.nombre}</h3>
                <p className="mt-2 text-[0.9375rem] text-topo">{v.descripcion}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Qué incluye */}
      <section aria-labelledby="incluye-titulo" className={`${seccion} ${fondo.incluye}`}>
        <div className="contenedor grid gap-10 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-4">
            <p className="antetitulo">El servicio</p>
            <h2 id="incluye-titulo" className="mt-3 text-titulo-2">
              Servicios a tu disposición
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
        <section aria-labelledby="galeria-titulo" className={`${seccion} ${fondo.galeria}`}>
          <div className="contenedor">
            <TituloSeccion
              id="galeria-titulo"
              antetitulo="Portafolio"
              titulo={textos.galeria}
              accionAlFinal
              accion={
                // La guía de lugares compite por "fincas y salones para bodas / 15 años".
                <Boton href={PAGINAS.lugares.ruta} variante="texto">
                  Lugares donde hemos decorado
                </Boton>
              }
            />
            {/* Todos los eventos del tipo en el HTML (enlaces internos a cada uno); los
                primeros a la vista y el resto tras "Ver más", sin salir del tema. */}
            <GrillaConMas
              className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14"
              textoMas={textos.verMas}
            >
              {eventos.map((e) => (
                <TarjetaEvento key={e.slug} evento={e} sizes="(min-width: 1024px) 33vw, 50vw" />
              ))}
            </GrillaConMas>
            <AccionAlFinal>
              <Boton href={PAGINAS.lugares.ruta} variante="texto">
                Lugares donde hemos decorado
              </Boton>
            </AccionAlFinal>
          </div>
        </section>
      )}

      {/* Inversión: precio "desde" sobre foto y qué hace variar el valor. */}
      <SeccionInversion
        inversion={s.inversion}
        cotizar={textos.cotizar}
        origen={`${s.slug}-inversion`}
        fondo={fondo.inversion}
      />

      {/* Testimonios del tipo: como en el inicio (uno grande con foto y tres cortos), con
          otro destacado y sin el pie de reseñas: el cierre de esta página es el formulario. */}
      {conTestimonios && (
        <section aria-labelledby="testimonios-titulo" className={`${seccion} ${fondo.testimonios}`}>
          <div className="contenedor">
            <TituloSeccion
              id="testimonios-titulo"
              antetitulo="Testimonios"
              titulo={textos.testimonios}
            />
            {testimonios.destacado && (
              <div className="mt-12">
                <TestimonioEvento
                  evento={testimonios.destacado.evento}
                  testimonio={testimonios.destacado.testimonio}
                  corto
                  enlazar
                />
              </div>
            )}
            <ul
              className={`-mx-(--gutter) flex snap-x snap-mandatory scroll-px-(--gutter) [scrollbar-width:none] gap-4 overflow-x-auto px-(--gutter) pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden ${
                testimonios.destacado ? "mt-16" : "mt-12"
              }`}
            >
              {testimonios.cortos.map(({ testimonio, evento }) => (
                <li
                  key={testimonio.texto}
                  className="w-[85%] max-w-sm min-w-0 shrink-0 snap-start md:w-auto md:max-w-none"
                >
                  <TarjetaTestimonio evento={evento} testimonio={testimonio} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Preguntas frecuentes propias */}
      <SeccionPreguntas
        titulo={tipo === "boda" ? "Sobre el diseño de tu boda" : "Sobre la decoración de 15 años"}
        preguntas={s.preguntas}
        origen={tipo === "boda" ? "boda" : "quince"}
        className={fondo.preguntas}
      />

      <SeccionContacto tipoInicial={tipo} origen={s.slug} />
    </main>
  );
}
