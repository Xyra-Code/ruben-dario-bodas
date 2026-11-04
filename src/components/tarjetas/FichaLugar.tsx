import Link from "next/link";

import { VerMasEventos } from "@/components/tarjetas/VerMasEventos";
import { Foto } from "@/components/ui/Foto";
import { IconoFlecha } from "@/components/ui/Iconos";
import type { Evento } from "@/lib/contenido/cargar";
import type { Lugar } from "@/lib/contenido/esquemas";
import { rutaEvento } from "@/lib/rutas";

const NOMBRE_TIPO: Record<Lugar["tipo"], string> = {
  hacienda: "Hacienda",
  finca: "Finca",
  salon: "Salón",
  club: "Club",
  hotel: "Hotel",
  iglesia: "Iglesia",
  "aire-libre": "Aire libre",
  otro: "", // Sin tipo claro: la ficha muestra solo el municipio.
};

/** Desde cuántos eventos la ficha se pliega y cuántos muestra plegada en celular y escritorio. */
const PLEGAR_DESDE = 5;
const VISIBLES_AL_PLEGAR = 3;
const VISIBLES_AL_PLEGAR_ESCRITORIO = 4;

const DE_QUIEN = { boda: "Boda de", quince: "15 años de", otro: "Evento de" } as const;

/** Nombre corto de un evento para su miniatura: "Boda de Isa & Carlos" o su título. */
const etiqueta = (e: Evento) => (e.nombres ? `${DE_QUIEN[e.tipo]} ${e.nombres}` : e.titulo);

/**
 * PRUEBA (2026-10-16): ficha de un lugar en la guía. Foto grande de un montaje allí (otra
 * que no sea la portada de un evento, para no repetirla en las miniaturas) y, al lado, el
 * tipo, el nombre, cuántas bodas y fiestas de 15 se diseñaron ahí y cada una como miniatura con foto
 * (long-tail "boda en [lugar]", "15 años en [lugar]"). Cada lugar va en su propia tarjeta (fondo, borde y aire)
 * para que no se confunda con el siguiente. La foto alterna de lado; en celular se apila.
 * Con un solo evento, en celular y escritorio su miniatura se monta sobre la foto grande, junto
 * al texto; en escritorio, sobre el borde que da al texto, sea cual sea el lado de la foto.
 */
export function FichaLugar({
  lugar,
  eventos,
  invertida = false,
}: {
  lugar: Lugar;
  eventos: Evento[];
  invertida?: boolean;
}) {
  // Foto grande: la fijada en el lugar (fotoFicha); si no, la primera horizontal del evento
  // más reciente que no sea la portada; si no hay, la portada.
  const fijada = lugar.fotoFicha;
  const primero = eventos.find((e) => e.slug === fijada?.evento) ?? eventos[0];
  const grande = fijada
    ? primero?.fotos.find((f) => f.archivo === fijada.archivo)
    : (primero?.fotos.find(
        (f) => f.archivo !== primero.portada && /salon|mesa|montaje|vista/.test(f.archivo),
      ) ?? primero?.fotos.find((f) => f.archivo === primero.portada));
  const cuantas = eventos.length;
  // "3 bodas · 2 fiestas de 15 diseñadas aquí": la guía sirve para los dos tipos de evento.
  const bodas = eventos.filter((e) => e.tipo === "boda").length;
  const quince = eventos.filter((e) => e.tipo === "quince").length;
  const resumen = [
    bodas && (bodas === 1 ? "1 boda" : `${bodas} bodas`),
    quince && (quince === 1 ? "1 fiesta de 15" : `${quince} fiestas de 15`),
  ]
    .filter(Boolean)
    .join(" · ");
  const participio =
    cuantas === 1
      ? resumen
        ? "diseñada aquí"
        : "diseñado aquí"
      : resumen
        ? "diseñadas aquí"
        : "diseñados aquí";

  const plegar = cuantas >= PLEGAR_DESDE;
  const unico = cuantas === 1;
  // Desde 4 eventos, las miniaturas 2×2 son más altas que la foto grande en 3:2. En escritorio
  // el título va en su propia fila y, debajo, la foto toma exactamente el alto de las tarjetas.
  // Si hay más de 4, el botón "Ver más" va en una tercera fila, fuera de ese alto, y los demás
  // eventos abren columnas nuevas del mismo ancho que se deslizan, sin cambiar el alto ni la
  // foto. Reparto de 8 + 4 columnas: con 7 + 5, la foto quedaba casi cuadrada y perdía lo horizontal.
  const fotoAlta = cuantas >= 4;

  // Miniaturas en cuadrícula fija, sin deslizar. Celular: filas de 2; con un número impar de
  // eventos, el primero va a todo el ancho para que no quede uno solo abajo. Con un solo
  // evento, en cambio, la miniatura sigue vertical y se monta sobre la foto grande, con el
  // texto al lado: dos fotos horizontales seguidas se veían planas. Con muchos eventos se ven
  // los primeros y un botón extiende la ficha (también en escritorio). Tablet: filas de 4, para
  // que no compitan con la foto grande. Escritorio: filas de 3; con 2 o desde 4 eventos, filas
  // de 2 del mismo ancho.
  const miniaturas = cuantas > 0 && (
    <ul
      className={`grid gap-2 sm:mt-6 sm:grid-cols-4 sm:gap-3 ${
        unico
          ? `relative z-10 col-span-5 -mt-20 grid-cols-1 lg:mt-0 lg:grid-cols-1 ${invertida ? "lg:-mr-24" : "lg:order-first lg:-ml-24"}`
          : `mt-6 grid-cols-2 ${
              plegar
                ? // Cada columna mide la mitad de la lista menos el espacio, como en 2×2. El margen
                  // negativo descuenta la barra de 8 px, para que el alto y la foto no cambien.
                  "min-w-0 lg:auto-cols-[calc((100%-0.75rem)/2)] lg:grid-flow-col lg:grid-cols-none lg:grid-rows-[auto_auto] group-data-[abierta=true]/plegable:lg:-mb-2 group-data-[abierta=true]/plegable:lg:overflow-x-auto group-data-[abierta=true]/plegable:lg:overflow-y-hidden group-data-[abierta=true]/plegable:lg:[&::-webkit-scrollbar]:h-2 group-data-[abierta=true]/plegable:lg:[&::-webkit-scrollbar-thumb]:rounded-full group-data-[abierta=true]/plegable:lg:[&::-webkit-scrollbar-thumb]:bg-linea"
                : cuantas === 2
                  ? "lg:max-w-sm lg:grid-cols-2"
                  : fotoAlta
                    ? "lg:grid-cols-2"
                    : "lg:grid-cols-3"
            }`
      } ${fotoAlta ? `lg:col-span-4 lg:row-start-2 lg:mt-0 ${invertida ? "lg:col-start-1" : "lg:col-start-9"}` : ""}`}
    >
      {eventos.map((e, i) => {
        const portada = e.fotos.find((f) => f.archivo === e.portada)!;
        const ancha = !unico && cuantas % 2 === 1 && i === 0;
        const plegada = plegar && i >= VISIBLES_AL_PLEGAR;
        const plegadaEscritorio = plegar && i >= VISIBLES_AL_PLEGAR_ESCRITORIO;
        return (
          <li
            key={e.slug}
            className={`min-w-0 ${ancha ? "col-span-2 sm:col-span-1" : ""} ${plegada ? "max-sm:hidden group-data-[abierta=true]/plegable:max-sm:block" : ""} ${plegadaEscritorio ? "lg:hidden group-data-[abierta=true]/plegable:lg:block" : ""}`}
          >
            <Link href={rutaEvento(e.slug)} className="group block min-w-0">
              <span
                className={`block overflow-hidden rounded-sm ${unico ? "border-4 border-superficie shadow-md sm:border-0 sm:shadow-none lg:border-4 lg:shadow-md" : ""}`}
              >
                <Foto
                  evento={e.slug}
                  archivo={portada.archivo}
                  alt=""
                  posicion={portada.encuadre}
                  sizes={
                    unico
                      ? "(min-width: 1024px) 260px, (min-width: 640px) 180px, 50vw"
                      : ancha
                        ? "(min-width: 640px) 180px, 100vw"
                        : "(min-width: 640px) 180px, 50vw"
                  }
                  className={`w-full object-cover transition-transform duration-700 ease-suave group-hover:scale-[1.04] ${ancha ? "aspect-[16/9] sm:aspect-[4/5]" : "aspect-[4/5]"}`}
                />
              </span>
              {/* En escritorio, la etiqueta empieza donde termina la foto grande, para no quedar encima. */}
              <span
                className={`mt-1.5 flex min-w-0 items-start gap-1 text-sm leading-snug text-carbon group-hover:text-terracota sm:mt-2 ${unico ? (invertida ? "lg:pr-14" : "lg:pl-16") : ""}`}
              >
                <span className="min-w-0">{etiqueta(e)}</span>
                <IconoFlecha className="mt-0.5 size-3.5 shrink-0" />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    // id = slug: cada mención del lugar en el sitio enlaza aquí (EnlaceLugar). Al llegar por
    // el enlace, el salto deja aire bajo el encabezado fijo y la ficha se marca en dorado.
    <article
      id={lugar.slug}
      className={`grid min-w-0 scroll-mt-28 items-center gap-6 rounded-sm border border-linea bg-superficie p-4 shadow-[0_1px_24px_rgba(43,39,36,0.05)] target:border-dorado target:ring-1 target:ring-dorado sm:p-6 lg:grid-cols-12 lg:gap-10 lg:p-8 ${fotoAlta ? "lg:items-stretch lg:gap-y-6" : ""}`}
    >
      {primero && grande && (
        <Link
          href={rutaEvento(primero.slug)}
          className={`group relative block min-w-0 overflow-hidden rounded-sm ${invertida ? "lg:order-2" : ""} ${fotoAlta ? `lg:col-span-8 lg:row-start-2 ${invertida ? "lg:col-start-5" : "lg:col-start-1"}` : "lg:col-span-7"}`}
          aria-label={`Ver ${primero.titulo}`}
        >
          <Foto
            evento={primero.slug}
            archivo={grande.archivo}
            alt={grande.alt}
            posicion={grande.encuadre}
            // Alta, la foto se recorta por los lados: el ancho que importa es el de su versión
            // completa en 3:2 (unos 530 px de alto × 1,5).
            sizes={fotoAlta ? "(min-width: 1024px) 800px, 100vw" : "(min-width: 1024px) 58vw, 100vw"}
            className={`aspect-[3/2] w-full object-cover transition-transform duration-700 ease-suave group-hover:scale-[1.03] ${fotoAlta ? "lg:absolute lg:inset-0 lg:aspect-auto lg:h-full" : ""}`}
          />
        </Link>
      )}

      <div
        className={`min-w-0 lg:col-span-5 ${unico ? "grid grid-cols-12 gap-x-4 sm:block lg:grid lg:items-center lg:gap-x-6" : ""} ${fotoAlta ? "lg:contents" : ""}`}
      >
        <div className={`col-span-7 min-w-0 ${fotoAlta ? "lg:col-span-12 lg:row-start-1" : ""}`}>
          <p className="antetitulo">
            {[NOMBRE_TIPO[lugar.tipo], lugar.municipio].filter(Boolean).join(" · ")}
          </p>
          <h3 className="mt-2 text-titulo-2">{lugar.nombre}</h3>
          {lugar.capacidad && <p className="mt-2 text-topo">{lugar.capacidad}</p>}
          {cuantas > 0 && (
            <p className="mt-3 text-topo">
              {resumen || (cuantas === 1 ? "1 evento" : `${cuantas} eventos`)} {participio}
            </p>
          )}
        </div>

        {plegar ? (
          <VerMasEventos
            ocultos={cuantas - VISIBLES_AL_PLEGAR}
            ocultosEscritorio={cuantas - VISIBLES_AL_PLEGAR_ESCRITORIO}
            claseBoton={invertida ? "lg:col-start-1" : "lg:col-start-9"}
          >
            {miniaturas}
          </VerMasEventos>
        ) : (
          miniaturas
        )}
      </div>
    </article>
  );
}
