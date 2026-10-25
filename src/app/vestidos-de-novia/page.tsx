import Link from "next/link";

import { PortadaConFoto } from "@/components/plantillas/PortadaConFoto";
import { JsonLd } from "@/components/seo/JsonLd";
import { Boton } from "@/components/ui/Boton";
import { Foto } from "@/components/ui/Foto";
import { IconoFlecha } from "@/components/ui/Iconos";
import { Pasos } from "@/components/ui/Pasos";
import { SeccionPreguntas } from "@/components/ui/SeccionPreguntas";
import { TituloSeccion } from "@/components/ui/TituloSeccion";
import { obtenerContenido, obtenerEvento } from "@/lib/contenido/cargar";
import { fondos } from "@/lib/fondos";
import { ogPagina } from "@/lib/imagenes";
import { RUTA_SERVICIO, RUTA_VESTIDOS, rutaEvento } from "@/lib/rutas";
import { preguntasFrecuentes, servicio } from "@/lib/seo/jsonld";
import { metadatos } from "@/lib/seo/metadatos";
import { MENSAJES, enlaceWhatsApp } from "@/lib/whatsapp";

const seo = obtenerContenido().vestidos;

export const metadata = metadatos({
  titulo: seo.seo.title,
  descripcion: seo.seo.description,
  ruta: RUTA_VESTIDOS,
  imagen: ogPagina("vestidos", seo.nombre),
});

const seccion = "py-(--spacing-seccion)";

/** Foto de un evento con su alt (las fotos de vestidos salen del portafolio). */
function fotoDe(slug: string, archivo: string) {
  const f = obtenerEvento(slug)!.fotos.find((x) => x.archivo === archivo)!;
  return { evento: slug, archivo, alt: f.alt };
}

/**
 * Vestidos de novia a medida: otra búsqueda que /bodas ("vestidos de novia
 * Villavicencio"), por eso tiene página propia. Cierra con WhatsApp y no con el formulario
 * de cotización, que pide datos de un evento (invitados, presupuesto del montaje).
 */
export default function Vestidos() {
  const { sitio, vestidos } = obtenerContenido();
  const portada = fotoDe(vestidos.portada.evento, vestidos.portada.archivo);
  const caso = vestidos.caso && {
    ...vestidos.caso,
    evento: obtenerEvento(vestidos.caso.evento)!,
    fotos: vestidos.caso.fotos.map((a) => fotoDe(vestidos.caso!.evento, a)),
  };
  const cita = enlaceWhatsApp(sitio.whatsapp, MENSAJES.vestido);

  // Fondos alternando; el vestido real (prueba de trabajo) en rubor (src/lib/fondos.ts).
  const tramo = fondos([{}, {}, ...(caso ? [{ prueba: true }] : []), {}, {}]);
  const fondo = {
    presentacion: tramo.shift()!,
    proceso: tramo.shift()!,
    caso: caso ? tramo.shift()! : "",
    inversion: tramo.shift()!,
    preguntas: tramo.shift()!,
  };

  return (
    <main>
      <JsonLd
        datos={[servicio(vestidos, RUTA_VESTIDOS), preguntasFrecuentes(vestidos.preguntas)]}
      />

      <PortadaConFoto
        idTitulo="vestidos-titulo"
        migas={[
          { nombre: "Inicio", ruta: "/" },
          { nombre: "Vestidos de novia", ruta: RUTA_VESTIDOS },
        ]}
        foto={portada}
      >
        <p className="antetitulo">Diseño de autor</p>
        <h1 id="vestidos-titulo" className="mt-4 text-titulo-1">
          {vestidos.h1}
        </h1>
        <p className="mt-6 max-w-md text-lg text-topo">{vestidos.bajada}</p>
        <div className="mt-8">
          <Boton href={cita} whatsapp origen="vestidos-portada">
            Agenda tu cita
          </Boton>
        </div>
      </PortadaConFoto>

      {/* Presentación: la formación en moda */}
      <section aria-label="Presentación" className={`${seccion} ${fondo.presentacion}`}>
        <div className="contenedor">
          <div className="lectura space-y-5">
            {vestidos.introduccion.map((p, i) => (
              <p
                key={p}
                className={i === 0 ? "font-titulo text-titulo-3 text-carbon" : "text-topo"}
              >
                {p}
              </p>
            ))}
          </div>
          <div className="mt-8">
            <Boton href="/sobre-ruben-dario" variante="texto">
              Conoce la historia de Rubén Darío
            </Boton>
          </div>
        </div>
      </section>

      {/* Proceso */}
      <section aria-labelledby="proceso-titulo" className={`${seccion} ${fondo.proceso}`}>
        <div className="contenedor">
          <TituloSeccion id="proceso-titulo" antetitulo="Paso a paso" titulo="Cómo es el proceso" />
          <div className="mt-12">
            <Pasos pasos={vestidos.proceso} />
          </div>
        </div>
      </section>

      {/* Un vestido real del portafolio */}
      {caso && (
        <section aria-labelledby="caso-titulo" className={`${seccion} ${fondo.caso}`}>
          <div className="contenedor">
            <TituloSeccion
              id="caso-titulo"
              antetitulo="Un vestido real"
              titulo={caso.titulo}
              intro={caso.texto}
              accion={
                <Boton href={rutaEvento(caso.evento.slug)} variante="secundario">
                  Mira la boda completa
                </Boton>
              }
            />
            <ul className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
              {caso.fotos.map((f) => (
                <li key={f.archivo} className="min-w-0">
                  <Foto
                    {...f}
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="aspect-[4/5] w-full rounded-sm object-cover"
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Inversión */}
      <section aria-labelledby="inversion-titulo" className={`${seccion} ${fondo.inversion}`}>
        <div className="contenedor">
          <div className="mx-auto max-w-3xl text-center">
            <p className="antetitulo">Inversión</p>
            <h2 id="inversion-titulo" className="mt-3 text-titulo-2">
              Desde{" "}
              <span className="[overflow-wrap:anywhere] text-terracota">
                {vestidos.inversion.desde}
              </span>
            </h2>
            <div className="mx-auto mt-6 filete-dorado w-24" />
            <p className="mx-auto mt-6 max-w-xl text-topo">{vestidos.inversion.nota}</p>
          </div>
        </div>
      </section>

      <SeccionPreguntas
        titulo="Sobre tu vestido"
        preguntas={vestidos.preguntas}
        className={fondo.preguntas}
      />

      {/* Cierre: #contacto, para que "Cotizar" del encabezado traiga aquí */}
      <section
        id="contacto"
        aria-labelledby="cita-titulo"
        className={`${seccion} bg-terracota grano text-sobre-principal`}
      >
        <div className="contenedor">
          <div className="mx-auto max-w-2xl text-center">
            <p className="antetitulo text-sobre-principal/85!">Tu vestido</p>
            <h2 id="cita-titulo" className="mt-3 text-titulo-2">
              Agenda tu primera cita
            </h2>
            <p className="mt-4 text-sobre-principal/85">
              Escríbenos con la fecha de tu boda y, si las tienes, fotos de vestidos que te gusten.
            </p>
            <div className="mt-8 flex justify-center">
              <Boton href={cita} whatsapp variante="claro" origen="vestidos-cierre">
                Escríbenos por WhatsApp
              </Boton>
            </div>
            <Link
              href={RUTA_SERVICIO.boda!}
              className="mt-8 inline-flex min-h-11 items-center gap-2 text-sobre-principal underline underline-offset-4"
            >
              ¿Y la decoración? Wedding planner y decoración de bodas
              <IconoFlecha className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
