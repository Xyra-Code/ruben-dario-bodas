import type { ReactNode } from "react";

import { Boton } from "@/components/ui/Boton";
import { Foto } from "@/components/ui/Foto";
import { RecorridoProceso } from "@/components/ui/RecorridoProceso";
import { AccionAlFinal, TituloSeccion } from "@/components/ui/TituloSeccion";
import { obtenerContenido } from "@/lib/contenido/cargar";
import { metadatos } from "@/lib/seo/metadatos";

import { VistaOpciones } from "./VistaOpciones";

// TEMPORAL (2026-11-04): comparar direcciones para "Cómo trabajamos". Se borra esta carpeta al
// elegir. No se indexa y no está en el sitemap.
export const metadata = metadatos({
  titulo: "Opciones de Cómo trabajamos | Rubén Darío Diseñador de Bodas",
  descripcion: "Página temporal para comparar opciones de diseño de la sección Cómo trabajamos.",
  ruta: "/opciones-proceso",
  noIndexar: true,
});

const TITULO = "De la primera conversación a tu día";
const INTRO =
  "Un camino claro, para que siempre sepas qué sigue. Lo ideal es escribirnos entre 6 y 12 meses antes de tu fecha.";
const NOTA = "Empieza con tu fecha y el lugar: te contamos si tenemos disponibilidad.";

const FOTO_TU_DIA = {
  evento: "boda-hacienda-las-marias-villavicencio",
  archivo: "boda-hacienda-las-marias-villavicencio-pareja-mesa-principal-flores-blancas.jpg",
  alt: "Novios sonriendo a cada lado de la mesa principal, cubierta de flores blancas",
  posicion: "50% 60%",
};

const FOTO_DETALLES = {
  evento: "boda-verde-menta-finca-los-pinos-villavicencio",
  archivo: "boda-verde-menta-finca-los-pinos-villavicencio-disenador-ultimos-detalles-del-salon.jpg",
  alt: "Rubén Darío enciende una vela en la mesa mientras da los últimos detalles al salón",
  posicion: "58% 60%",
};

/** Una foto por paso, en el mismo orden de content/proceso.json. */
const FOTOS_POR_PASO = [
  {
    evento: "boda-condominio-palma-real-villavicencio",
    archivo: "boda-condominio-palma-real-villavicencio-pareja-con-el-disenador.jpg",
    alt: "Rubén Darío junto a una pareja de novios, bajo un techo de telas en forma de rosa",
    posicion: "50% 62%",
  },
  {
    evento: "boda-la-topia-villavicencio",
    archivo: "boda-la-topia-villavicencio-disenador-ceremonia-jardin.jpg",
    alt: "Rubén Darío en un jardín con bancas de madera y arcos de ceremonia",
    posicion: "60% 62%",
  },
  {
    evento: "boda-hacienda-las-marias-villavicencio",
    archivo: "boda-hacienda-las-marias-villavicencio-detalle-puesto-plato-dorado.jpg",
    alt: "Puesto de mesa con plato dorado, servilleta marcada y una chiva en miniatura",
    posicion: "35% 50%",
  },
  FOTO_DETALLES,
  FOTO_TU_DIA,
];

function Accion({ ancho = false }: { ancho?: boolean }) {
  return (
    <Boton href="/#contacto" className={ancho ? "w-full sm:w-auto" : ""}>
      Cotizar mi evento
    </Boton>
  );
}

type OpcionProps = {
  letra: string;
  nombre: string;
  idea: string;
  aFavor: string[];
  enContra: string[];
  recomendada?: boolean;
  children: ReactNode;
};

/** Marco de cada opción: de qué se trata arriba, el diseño real en medio, pros y costos abajo. */
function Opcion({ letra, nombre, idea, aFavor, enContra, recomendada, children }: OpcionProps) {
  return (
    <article id={`opcion-${letra.toLowerCase()}`} className="scroll-mt-32 border-t-4 border-terracota">
      <div className="bg-rubor py-6">
        <div className="contenedor">
          <h2 className="text-titulo-3">
            Opción {letra} · {nombre}
            {recomendada && (
              <span className="ml-3 inline-block rounded-boton bg-terracota px-2 py-1 align-middle font-sans text-xs font-medium text-sobre-principal">
                Mi recomendación
              </span>
            )}
          </h2>
          <p className="mt-1 max-w-3xl text-topo">{idea}</p>
        </div>
      </div>
      {children}
      <div className="bg-rubor py-6">
        <div className="contenedor grid gap-6 md:grid-cols-2">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold">A favor</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-topo">
              {aFavor.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold">Lo que cuesta</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-topo">
              {enContra.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function OpcionesProceso() {
  const { proceso } = obtenerContenido();
  const seccion = "py-(--spacing-seccion)";

  return (
    <main>
      <VistaOpciones letras={["A", "B", "C", "D"]}>
        <div className="contenedor py-10">
          <h1 className="text-titulo-2">Cómo trabajamos: cuatro direcciones</h1>
          <p className="mt-3 max-w-3xl text-topo">
            Todas usan los mismos textos, colores y letras del sitio. Lo que cambia es la forma de
            contar el proceso. Las franjas de color son solo explicación: no van en el sitio.
          </p>
        </div>

        {/* A · Lo que ya está en el inicio */}
        <Opcion
          letra="A"
          nombre="Recorrido con meta"
          idea="La que está hoy en el inicio. Una línea une los pasos y termina en la foto de “Tu día”; en escritorio, el título y el botón acompañan al bajar."
          aFavor={[
            "Es la más cómoda de leer: textos anchos, aunque crezcan.",
            "Es igual en celular y escritorio, y el botón queda siempre a mano en escritorio.",
          ]}
          enContra={[
            "En escritorio queda un espacio vacío a la izquierda, junto a la foto.",
            "Es la más alta de las cuatro en escritorio.",
          ]}
        >
          <section className={seccion}>
            <div className="contenedor grid gap-10 lg:grid-cols-12 lg:gap-x-12">
              <div className="min-w-0 lg:sticky lg:top-40 lg:col-span-5 lg:self-start">
                <TituloSeccion id="titulo-a" antetitulo="Cómo trabajamos" titulo={TITULO} intro={INTRO} />
                <div className="mt-8 hidden lg:block">
                  <Accion />
                  <p className="mt-3 text-sm text-topo">{NOTA}</p>
                </div>
              </div>
              <div className="min-w-0 lg:col-span-7">
                <RecorridoProceso
                  pasos={proceso}
                  final={
                    <Foto
                      evento={FOTO_TU_DIA.evento}
                      archivo={FOTO_TU_DIA.archivo}
                      alt={FOTO_TU_DIA.alt}
                      sizes="(min-width: 1280px) 580px, (min-width: 1024px) 46vw, (min-width: 640px) 590px, 100vw"
                      className="aspect-[3/2] w-full rounded-sm object-cover"
                    />
                  }
                />
                <div className="mt-10 lg:hidden">
                  <Accion ancho />
                  <p className="mt-3 text-sm text-topo">{NOTA}</p>
                </div>
              </div>
            </div>
          </section>
        </Opcion>

        {/* B · Línea horizontal: la más cercana al diseño original */}
        <Opcion
          letra="B"
          nombre="Línea sobria"
          idea="La más cercana a la versión anterior: los cinco pasos en fila, unidos por una línea, sin fotos. En celular se vuelve vertical."
          aFavor={[
            "En escritorio se ve todo el proceso de una sola mirada y es la más corta.",
            "Da un descanso entre el portafolio y la foto de Rubén Darío, las secciones vecinas.",
          ]}
          enContra={[
            "Columnas angostas: los textos más largos ocupan varias líneas en escritorio.",
            "Es la menos emotiva: informa, pero no hace imaginar el resultado.",
          ]}
        >
          <section className={seccion}>
            <div className="contenedor">
              <TituloSeccion
                id="titulo-b"
                antetitulo="Cómo trabajamos"
                titulo={TITULO}
                intro={INTRO}
                accionAlFinal
                accion={<Accion />}
              />
              <ol className="mt-12 lg:grid lg:grid-cols-5 lg:gap-x-8">
                {proceso.map((p, i) => {
                  const ultimo = i === proceso.length - 1;
                  return (
                    <li
                      key={p.titulo}
                      className={`relative grid grid-cols-[3rem_minmax(0,1fr)] gap-x-4 lg:block lg:pb-0 ${ultimo ? "" : "pb-9"}`}
                    >
                      {!ultimo && (
                        <span
                          aria-hidden="true"
                          className="absolute top-12 bottom-0 left-6 w-px -translate-x-1/2 bg-dorado/70 lg:top-6 lg:right-[-2rem] lg:bottom-auto lg:left-12 lg:h-px lg:w-auto lg:translate-x-0"
                        />
                      )}
                      <span
                        aria-hidden="true"
                        className={`flex size-12 items-center justify-center rounded-full border font-titulo text-xl ${
                          ultimo
                            ? "border-terracota bg-terracota text-sobre-principal"
                            : "border-dorado text-dorado-texto"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 pt-2 lg:pt-5">
                        <h3 className="text-titulo-3">{p.titulo}</h3>
                        <p className="mt-2 text-topo lg:text-[0.9375rem]">{p.descripcion}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
              <AccionAlFinal>
                <Accion ancho />
              </AccionAlFinal>
            </div>
          </section>
        </Opcion>

        {/* C · Una foto real por paso */}
        <Opcion
          letra="C"
          nombre="Álbum del proceso"
          idea="Cada paso con su propia foto real: Rubén Darío con los novios, en el lugar, un detalle, encendiendo las velas y la pareja el gran día."
          aFavor={[
            "Es la más visual: muestra a la persona detrás del trabajo en cada etapa.",
            "En celular todos los pasos quedan a la vista, sin deslizar ni tocar nada.",
          ]}
          enContra={[
            "Suma cinco fotos justo después de las seis del portafolio: puede cansar y pesa más.",
            "Las fotos ilustran cada paso, pero son de eventos terminados, no de ese momento exacto.",
          ]}
        >
          <section className={seccion}>
            <div className="contenedor">
              <TituloSeccion
                id="titulo-c"
                antetitulo="Cómo trabajamos"
                titulo={TITULO}
                intro={INTRO}
                accionAlFinal
                accion={<Accion />}
              />
              <ol className="mt-12 grid gap-8 lg:grid-cols-5 lg:gap-6">
                {proceso.map((p, i) => {
                  const foto = FOTOS_POR_PASO[i];
                  const ultimo = i === proceso.length - 1;
                  return (
                    <li
                      key={p.titulo}
                      className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-4 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-x-6 lg:block"
                    >
                      <Foto
                        evento={foto.evento}
                        archivo={foto.archivo}
                        alt={foto.alt}
                        posicion={foto.posicion}
                        sizes="(min-width: 1024px) 18vw, (min-width: 640px) 9rem, 5.5rem"
                        className="aspect-[4/5] w-full rounded-sm object-cover"
                      />
                      <div className="min-w-0 lg:mt-4">
                        <span
                          aria-hidden="true"
                          className={`block font-titulo text-xl ${ultimo ? "text-terracota" : "text-dorado-texto"}`}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="mt-1 text-titulo-3">{p.titulo}</h3>
                        <p className="mt-2 text-[0.9375rem] text-topo">{p.descripcion}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
              <AccionAlFinal>
                <Accion ancho />
              </AccionAlFinal>
            </div>
          </section>
        </Opcion>

        {/* D · Foto a todo el ancho con el proceso en un panel */}
        <Opcion
          letra="D"
          nombre="Rubén Darío en acción"
          recomendada
          idea="Una gran foto a todo el ancho de Rubén Darío dando los últimos detalles, con el proceso en un panel claro encima. En celular, la foto arriba y el panel debajo."
          aFavor={[
            "Es la de más impacto: una sola imagen fuerte, y el texto se lee sobre fondo limpio.",
            "Responde “quién está detrás” antes de explicar los pasos, y cambia el ritmo de la página.",
          ]}
          enContra={[
            "Muestra a Rubén Darío justo antes de la sección “Sobre”, que también lleva su retrato.",
            "No termina en la pareja: la emoción la pone el trabajo, no el resultado.",
          ]}
        >
          <section className="relative isolate lg:py-20">
            <Foto
              evento={FOTO_DETALLES.evento}
              archivo={FOTO_DETALLES.archivo}
              alt={FOTO_DETALLES.alt}
              posicion={FOTO_DETALLES.posicion}
              sizes="100vw"
              className="aspect-[3/2] w-full object-cover lg:absolute lg:inset-0 lg:-z-10 lg:aspect-auto lg:h-full"
            />
            <div className="contenedor relative -mt-10 pb-(--spacing-seccion) lg:mt-0 lg:pb-0">
              <div className="rounded-sm bg-superficie p-6 shadow-sm sm:p-8 lg:w-[30rem] lg:max-w-[46%] lg:min-w-[26rem] lg:p-10">
                <TituloSeccion id="titulo-d" antetitulo="Cómo trabajamos" titulo={TITULO} intro={INTRO} />
                <ol className="mt-8 border-b border-linea">
                  {proceso.map((p, i) => (
                    <li
                      key={p.titulo}
                      className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 border-t border-linea py-4"
                    >
                      <span
                        aria-hidden="true"
                        className={`font-titulo text-xl ${i === proceso.length - 1 ? "text-terracota" : "text-dorado-texto"}`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-titulo text-xl">{p.titulo}</h3>
                        <p className="mt-1 text-[0.9375rem] text-topo">{p.descripcion}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="mt-6">
                  <Accion ancho />
                </div>
              </div>
            </div>
          </section>
        </Opcion>
      </VistaOpciones>
    </main>
  );
}
