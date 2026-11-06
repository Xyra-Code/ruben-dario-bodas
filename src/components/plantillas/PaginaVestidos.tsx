import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import { PortadaConFoto } from "@/components/plantillas/PortadaConFoto";
import { JsonLd } from "@/components/seo/JsonLd";
import { FichaVestido } from "@/components/tarjetas/FichaVestido";
import { Boton } from "@/components/ui/Boton";
import { Foto } from "@/components/ui/Foto";
import { IconoFlecha } from "@/components/ui/Iconos";
import { Pasos } from "@/components/ui/Pasos";
import { SeccionPreguntas } from "@/components/ui/SeccionPreguntas";
import { TituloSeccion } from "@/components/ui/TituloSeccion";
import { obtenerContenido, obtenerEvento } from "@/lib/contenido/cargar";
import type { Vestidos } from "@/lib/contenido/esquemas";
import { fondos } from "@/lib/fondos";
import { obtenerImagen } from "@/lib/imagenes";
import { rutaEvento } from "@/lib/rutas";
import { preguntasFrecuentes, servicio } from "@/lib/seo/jsonld";
import { MENSAJES, MENSAJES_PREGUNTA, enlaceWhatsApp } from "@/lib/whatsapp";

const seccion = "py-(--spacing-seccion)";

/** Foto de un evento con su alt (las fotos de vestidos salen del portafolio). */
function fotoDe(slug: string, archivo: string) {
  const f = obtenerEvento(slug)!.fotos.find((x) => x.archivo === archivo)!;
  return { evento: slug, archivo, alt: f.alt, posicion: f.encuadre };
}

/** Enlace de cada vestido a su evento, con el nombre para distinguir los enlaces entre sí. */
function textoEnlace(slug: string) {
  const { tipo, nombres } = obtenerEvento(slug)!;
  const evento = tipo === "boda" ? "la boda" : "la fiesta";
  return nombres ? `Mira ${evento} de ${nombres}` : `Mira ${evento} completa`;
}

/**
 * Sección de foto y texto. Celular: título → foto → texto, para saber de qué trata antes de
 * ver la foto. Desde md: foto a la izquierda y título y texto centrados a su lado.
 */
function SeccionConFoto({
  id,
  idTitulo,
  antetitulo,
  titulo,
  foto,
  recorte,
  className,
  children,
}: {
  id?: string;
  idTitulo: string;
  antetitulo: string;
  titulo: string;
  foto: { evento: string; archivo: string; alt: string };
  /** Punto de un recorte 4:5, para fotos con espacio de sobra. Sin él, en su formato. */
  recorte?: string;
  className: string;
  children: ReactNode;
}) {
  const imagen = obtenerImagen(foto.evento, foto.archivo);
  const proporcion = recorte ? 4 / 5 : imagen.ancho / imagen.alto;

  return (
    <section id={id} aria-labelledby={idTitulo} className={`${seccion} ${className}`}>
      <div className="contenedor grid gap-y-6 [grid-template-areas:'titulo'_'foto'_'texto'] md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:grid-rows-[1fr_auto_auto_1fr] md:gap-x-8 md:gap-y-0 md:[grid-template-areas:'foto_.'_'foto_titulo'_'foto_texto'_'foto_.'] lg:gap-x-16">
        <div className="min-w-0 [grid-area:titulo]">
          <p className="antetitulo">{antetitulo}</p>
          <h2 id={idTitulo} className="mt-3 text-titulo-2">
            {titulo}
          </h2>
        </div>
        {/* En PC, el ancho sale de la altura disponible: la foto cabe completa sin bajar. */}
        <div
          className="mx-auto w-full max-w-md min-w-0 [grid-area:foto] lg:max-w-(--ancho-foto)"
          style={
            {
              "--ancho-foto": `min(28rem, calc((100dvh - 6rem) * ${proporcion.toFixed(4)}))`,
            } as CSSProperties
          }
        >
          <Foto
            {...foto}
            posicion={recorte}
            sizes="(min-width: 768px) 40vw, 100vw"
            className={`w-full rounded-sm ${recorte ? "aspect-[4/5] object-cover" : ""}`}
          />
        </div>
        <div className="min-w-0 [grid-area:texto] md:mt-5">{children}</div>
      </div>
    </section>
  );
}

type Props = {
  contenido: Vestidos;
  ruta: string;
  /** Nombre corto en las migas: "Vestidos de novia". */
  miga: string;
  mensaje: string;
  /** Prefijo de los botones en la analítica: "vestidos", "vestidos-quince". */
  origen: string;
  /** Elige la foto y el mensaje de las preguntas frecuentes. */
  origenPreguntas: keyof typeof MENSAJES_PREGUNTA;
  /** El menú lleva a novia: quien busca el otro vestido lo encuentra desde la portada. */
  otroVestido: { ruta: string; texto: string };
  cierre: { texto: string; enlace: { ruta: string; pregunta: string; texto: string } };
};

/**
 * Página de un tipo de vestido a medida (novia o 15 años). Cada una compite por su búsqueda,
 * con la misma estructura: los vestidos reales antes que el proceso, porque es lo primero
 * que viene a ver quien busca el suyo. Cierra con WhatsApp y no con el formulario de
 * cotización, que pide datos de un evento (invitados, presupuesto del montaje).
 */
export function PaginaVestidos({
  contenido,
  ruta,
  miga,
  mensaje,
  origen,
  origenPreguntas,
  otroVestido,
  cierre,
}: Props) {
  const { sitio } = obtenerContenido();
  const { galeria, presentacion, traje } = contenido;
  const portada = fotoDe(contenido.portada.evento, contenido.portada.archivo);
  const cita = enlaceWhatsApp(sitio.whatsapp, mensaje);

  // Fondos alternando; los vestidos reales (prueba de trabajo) en rubor (src/lib/fondos.ts).
  const tramo = fondos([{ prueba: true }, {}, {}, {}, ...(traje ? [{ prueba: true }] : []), {}]);
  const fondo = {
    galeria: tramo.shift()!,
    presentacion: tramo.shift()!,
    proceso: tramo.shift()!,
    inversion: tramo.shift()!,
    traje: traje ? tramo.shift()! : "",
    preguntas: tramo.shift()!,
  };

  return (
    <main>
      <JsonLd datos={[servicio(contenido, ruta), preguntasFrecuentes(contenido.preguntas)]} />

      <PortadaConFoto
        idTitulo="vestidos-titulo"
        migas={[
          { nombre: "Inicio", ruta: "/" },
          { nombre: miga, ruta },
        ]}
        foto={portada}
      >
        <p className="antetitulo">Diseño de autor</p>
        <h1 id="vestidos-titulo" className="mt-4 text-titulo-1">
          {contenido.h1}
        </h1>
        <p className="mt-4 max-w-md text-lg text-topo lg:mt-6">{contenido.bajada}</p>
        <div className="mt-6 lg:mt-8">
          <Boton href={cita} whatsapp origen={`${origen}-portada`}>
            Agenda tu cita
          </Boton>
        </div>
        <div className="mt-3">
          <Boton href={otroVestido.ruta} variante="texto">
            {otroVestido.texto}
          </Boton>
        </div>
      </PortadaConFoto>

      {/* Vestidos reales del portafolio */}
      <section aria-labelledby="galeria-titulo" className={`${seccion} ${fondo.galeria}`}>
        <div className="contenedor">
          <TituloSeccion
            id="galeria-titulo"
            antetitulo={galeria.antetitulo}
            titulo={galeria.titulo}
            intro={galeria.intro}
          />
          <div className="mt-12 space-y-8 lg:space-y-10">
            {galeria.items.map((v) => (
              <FichaVestido
                key={v.evento}
                titulo={v.titulo}
                texto={v.texto}
                cita={v.cita}
                fotos={v.fotos.map((a) => fotoDe(v.evento, a))}
                enlace={{ ruta: rutaEvento(v.evento), texto: textoEnlace(v.evento) }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quién lo diseña: después de los vestidos, la formación respalda lo que ya se vio */}
      <SeccionConFoto
        idTitulo="presentacion-titulo"
        antetitulo={presentacion.antetitulo}
        titulo={presentacion.titulo}
        foto={fotoDe(presentacion.foto.evento, presentacion.foto.archivo)}
        className={fondo.presentacion}
      >
        <p className="text-topo">{presentacion.texto}</p>
        <ul className="mt-6 border-b border-linea">
          {presentacion.credenciales.map((c) => (
            <li key={c} className="border-t border-linea py-3 text-carbon">
              {c}
            </li>
          ))}
        </ul>
        <div className="mt-5">
          <Boton href="/sobre-ruben-dario" variante="texto">
            Conoce su historia
          </Boton>
        </div>
      </SeccionConFoto>

      {/* Proceso */}
      <section aria-labelledby="proceso-titulo" className={`${seccion} ${fondo.proceso}`}>
        <div className="contenedor">
          <TituloSeccion id="proceso-titulo" antetitulo="Paso a paso" titulo="Cómo es el proceso" />
          <div className="mt-12">
            <Pasos pasos={contenido.proceso} />
          </div>
        </div>
      </section>

      {/* Inversión: antes del traje, para que el precio no parezca el del traje */}
      <section aria-labelledby="inversion-titulo" className={`${seccion} ${fondo.inversion}`}>
        <div className="contenedor">
          <div className="mx-auto max-w-3xl text-center">
            <p className="antetitulo">Inversión</p>
            <h2 id="inversion-titulo" className="mt-3 text-titulo-2">
              Tu vestido, desde{" "}
              <span className="[overflow-wrap:anywhere] text-terracota">
                {contenido.inversion.desde}
              </span>
            </h2>
            <div className="mx-auto mt-6 filete-dorado w-24" />
            <p className="mx-auto mt-6 max-w-xl text-topo">{contenido.inversion.nota}</p>
          </div>
        </div>
      </section>

      {/* Traje de novio: producto secundario, con su propio mensaje de WhatsApp */}
      {traje && (
        <SeccionConFoto
          id="traje-de-novio"
          idTitulo="traje-titulo"
          antetitulo={traje.antetitulo}
          titulo={traje.titulo}
          foto={fotoDe(traje.evento, traje.foto)}
          recorte="50% 12%"
          className={fondo.traje}
        >
          <p className="text-topo">{traje.texto}</p>
          {traje.cita && (
            <blockquote className="mt-5 border-l-2 border-terracota pl-4">
              <p className="text-carbon">“{traje.cita.texto}”</p>
              <footer className="mt-1 text-sm text-topo">{traje.cita.autor}</footer>
            </blockquote>
          )}
          <div className="mt-8 flex flex-col items-start gap-3">
            <Boton
              href={enlaceWhatsApp(sitio.whatsapp, MENSAJES.trajeNovio)}
              whatsapp
              variante="secundario"
              origen={`${origen}-traje`}
            >
              Agenda la cita para tu traje
            </Boton>
            <Boton href={rutaEvento(traje.evento)} variante="texto">
              {textoEnlace(traje.evento)}
            </Boton>
          </div>
        </SeccionConFoto>
      )}

      <SeccionPreguntas
        titulo="Sobre tu vestido"
        origen={origenPreguntas}
        preguntas={contenido.preguntas}
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
            <p className="mx-auto mt-4 max-w-md text-balance text-sobre-principal/85">
              {cierre.texto}
            </p>
            <div className="mt-8 flex justify-center">
              {/* Menos relleno en los celulares más angostos: el texto cabe en una línea. */}
              <Boton
                href={cita}
                whatsapp
                variante="blanco"
                origen={`${origen}-cierre`}
                className="max-[359px]:px-4"
              >
                Agenda tu cita por WhatsApp
              </Boton>
            </div>
            {/* El filete y la distancia lo separan de la cita: es otro servicio, no un paso más. */}
            <div className="mx-auto mt-12 filete-dorado w-24" />
            <p className="mt-8 text-sobre-principal/85">{cierre.enlace.pregunta}</p>
            <Link
              href={cierre.enlace.ruta}
              className="mt-1 inline-flex min-h-11 items-center text-sobre-principal focus-visible:outline-white"
            >
              {/* Flecha dentro del texto: si salta de línea, sigue pegada a la última palabra. */}
              <span className="min-w-0 text-balance">
                <span className="underline underline-offset-4">{cierre.enlace.texto}</span>
                <IconoFlecha className="ml-2 inline size-4 align-[-0.125em]" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
