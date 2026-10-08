import type { ReactNode } from "react";

import { Compartir } from "@/components/evento/Compartir";
import { FichaEvento } from "@/components/evento/FichaEvento";
import { SeccionContacto } from "@/components/formulario/SeccionContacto";
import { Galeria } from "@/components/galeria/Galeria";
import { Migas } from "@/components/navegacion/Migas";
import { TarjetaEvento } from "@/components/tarjetas/TarjetaEvento";
import { Acordeon } from "@/components/ui/Acordeon";
import { Boton } from "@/components/ui/Boton";
import { Cita } from "@/components/ui/Cita";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { Pasos } from "@/components/ui/Pasos";
import { obtenerContenido } from "@/lib/contenido/cargar";
import { metadatos, urlAbsoluta } from "@/lib/seo/metadatos";
import { rutaEvento } from "@/lib/rutas";

// Entregable del brief (§9): colores, tipografía y componentes, para aprobar la dirección
// visual sobre el preview. No se indexa ni está en el sitemap.
export const metadata = metadatos({
  titulo: "Guía de estilos | Rubén Darío Diseñador de Bodas",
  descripcion:
    "Guía de estilos del sitio de Rubén Darío Diseñador de Bodas: colores, tipografía y componentes para aprobar la dirección visual.",
  ruta: "/guia-de-estilos",
  noIndexar: true,
});

const COLORES = [
  ["Marfil", "bg-marfil", "#FAF7F2", "Fondo general"],
  ["Rubor", "bg-rubor", "#F4E9E5", "Fondo alterno"],
  ["Carbón", "bg-carbon", "#2B2724", "Texto · 13,9 : 1"],
  ["Topo", "bg-topo", "#6B5F59", "Texto secundario · 5,8 : 1"],
  ["Terracota", "bg-terracota", "#A45249", "Principal · 5,1 : 1"],
  ["Terracota profundo", "bg-terracota-profundo", "#8E4239", "Hover · 6,6 : 1"],
  ["Rosa", "bg-rosa", "#C2776E", "Decorativo / texto grande"],
  ["Dorado", "bg-dorado", "#B86B14", "Líneas y ornamentos"],
  ["Dorado texto", "bg-dorado-texto", "#9A5A10", "Antetítulos · 5,1 : 1"],
] as const;

function Bloque({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="border-t border-linea py-12 lg:py-16">
      <p className="antetitulo">{titulo}</p>
      <div className="mt-8">{children}</div>
    </section>
  );
}

export default function GuiaDeEstilos() {
  const { eventos, preguntasGenerales, proceso, testimonios } = obtenerContenido();
  const evento = eventos[0];

  return (
    <main>
      <div className="contenedor py-8 lg:py-12">
        <p className="antetitulo">Rubén Darío · Sitio web</p>
        <h1 className="mt-3 text-titulo-1">Guía de estilos</h1>
        <p className="mt-4 lectura text-topo">
          Colores, tipografía y componentes del sitio, con contenido real. Sirve para revisar y
          aprobar la dirección visual antes de componer las páginas finales.
        </p>

        <Bloque titulo="Colores (derivados del logo)">
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(10rem,100%),1fr))] gap-4">
            {COLORES.map(([nombre, clase, hex, uso]) => (
              <li key={nombre} className="min-w-0">
                <div className={`${clase} h-20 rounded-sm border border-carbon/10`} />
                <p className="mt-2 font-medium">{nombre}</p>
                <p className="text-sm text-topo">
                  {hex} · {uso}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="h-3 rounded-sm bg-(image:--degradado-terracota)" />
            <div className="h-3 rounded-sm bg-(image:--degradado-dorado)" />
          </div>
        </Bloque>

        <Bloque titulo="Tipografía">
          <div className="grid gap-6">
            <p className="antetitulo">Antetítulo · Cormorant Garamond, versalitas</p>
            <p className="font-titulo text-titulo-1">Decoración de bodas en Villavicencio</p>
            <p className="font-titulo text-titulo-2">Eventos destacados</p>
            <p className="font-titulo text-titulo-3">Boda en Hacienda El Caney, Restrepo</p>
            <p className="lectura">
              Texto de lectura en Jost, mínimo 16 px en celular. Cada evento se diseña con un estilo
              y una paleta propios, en salones, haciendas y fincas de los Llanos.
            </p>
            <p className="text-sm text-topo">Texto secundario: pies de foto y metadatos.</p>
          </div>
        </Bloque>

        <Bloque titulo="Botones y etiquetas">
          <div className="flex flex-wrap items-center gap-4">
            <Boton href="#contacto">Cotizar mi evento</Boton>
            <Boton href="/eventos" variante="secundario">
              Ver eventos
            </Boton>
            <Boton href="https://wa.me/" whatsapp origen="guia">
              Escríbanos
            </Boton>
            <Boton href="/bodas" variante="texto">
              Conozca el servicio
            </Boton>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Etiqueta tipo="boda" />
            <Etiqueta tipo="quince" />
            <Etiqueta tipo="otro" />
          </div>
        </Bloque>

        <Bloque titulo="Migas de pan">
          <Migas
            items={[
              { nombre: "Inicio", ruta: "/" },
              { nombre: "Eventos", ruta: "/eventos" },
              { nombre: evento.titulo, ruta: rutaEvento(evento.slug) },
            ]}
          />
        </Bloque>

        <Bloque titulo="Tarjetas de evento">
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-x-8">
            {eventos.map((e) => (
              <TarjetaEvento key={e.slug} evento={e} sizes="(min-width: 1024px) 33vw, 50vw" />
            ))}
          </div>
        </Bloque>

        <Bloque titulo="Cómo trabajamos · pasos numerados">
          <Pasos pasos={proceso} />
        </Bloque>

        <Bloque titulo="Testimonios">
          <div className="grid gap-6 md:grid-cols-[repeat(auto-fit,minmax(min(18rem,100%),1fr))]">
            {testimonios.map((t) => (
              <Cita
                key={t.texto}
                texto={t.texto}
                autor={t.autor}
                detalle={t.tipo === "boda" ? "Boda" : "15 años"}
              />
            ))}
          </div>
          {evento.testimonio && (
            <div className="mt-14">
              <Cita
                variante="destacada"
                texto={evento.testimonio.texto}
                autor={evento.testimonio.autor}
                detalle={evento.titulo}
              />
            </div>
          )}
        </Bloque>

        <Bloque titulo="Ficha del evento, galería y acciones">
          <FichaEvento evento={evento} />
          <div className="mt-8">
            <Galeria evento={evento} />
          </div>
          <div className="mt-8 flex flex-wrap items-start gap-4">
            <Boton href="#contacto">Quiero algo así</Boton>
            <Compartir titulo={evento.titulo} url={urlAbsoluta(rutaEvento(evento.slug))} />
          </div>
        </Bloque>

        <Bloque titulo="Preguntas frecuentes">
          <Acordeon preguntas={preguntasGenerales} />
        </Bloque>
      </div>

      <SeccionContacto origen="guia" referencia={evento.titulo} tipoInicial={evento.tipo} />
    </main>
  );
}
