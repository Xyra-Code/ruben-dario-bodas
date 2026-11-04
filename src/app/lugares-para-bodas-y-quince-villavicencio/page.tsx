import { SeccionContacto } from "@/components/formulario/SeccionContacto";
import { Migas } from "@/components/navegacion/Migas";
import { CollageLugares, type FotoCollage } from "@/components/plantillas/CollageLugares";
import { JsonLd } from "@/components/seo/JsonLd";
import { FichaLugar } from "@/components/tarjetas/FichaLugar";
import { Foto } from "@/components/ui/Foto";
import { SeccionPreguntas } from "@/components/ui/SeccionPreguntas";
import { TextoConEventos } from "@/components/ui/TextoConEventos";
import { TituloSeccion } from "@/components/ui/TituloSeccion";
import { type Evento, eventosEnLugar, obtenerContenido } from "@/lib/contenido/cargar";
import type { Lugar } from "@/lib/contenido/esquemas";
import { fondos } from "@/lib/fondos";
import { ubicacion } from "@/lib/rutas";
import { listaLugares, preguntasFrecuentes } from "@/lib/seo/jsonld";
import { metadatos } from "@/lib/seo/metadatos";
import { PAGINAS } from "@/lib/seo/paginas";

const pagina = PAGINAS.lugares;

export const metadata = metadatos({
  titulo: pagina.titulo,
  descripcion: pagina.descripcion,
  ruta: pagina.ruta,
});

const seccion = "py-(--spacing-seccion)";

/** Un municipio tiene sección propia desde esta cantidad de lugares. */
const MINIMO_POR_SECCION = 3;

/** Ancla de la sección de un municipio: "Villavicencio, Meta" → "villavicencio-meta". */
const ancla = (titulo: string) =>
  titulo
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * Qué tanto muestra el lugar una foto, por su nombre: el salón o el techo montado más que
 * una mesa, y una mesa más que un retrato. 0 = no muestra el espacio.
 */
const PESO_LUGAR: [RegExp, number][] = [
  [/salon|techo/, 3],
  [/ventanal|pista|vista|montaje|jardin/, 2],
  [/mesa/, 1],
];
const pesoLugar = (archivo: string) => PESO_LUGAR.find(([re]) => re.test(archivo))?.[1] ?? 0;

/**
 * Collage automático: los lugares con más eventos, primero uno de cada tipo (salón,
 * finca, hacienda…) y luego los que falten. De cada uno, la foto que más muestra el
 * espacio, sin repetir la grande de su ficha ni la portada de sus miniaturas.
 */
function collageAutomatico(enGuia: Lugar[]): FotoCollage[] {
  const candidatos = enGuia
    .map((l) => ({ l, eventos: eventosEnLugar(l.slug) }))
    .filter((c) => c.eventos.length > 0)
    .sort((a, b) => b.eventos.length - a.eventos.length);
  const tipos = new Set<string>();
  const elegidos = candidatos.filter((c) => !tipos.has(c.l.tipo) && tipos.add(c.l.tipo));
  for (const c of candidatos) if (!elegidos.includes(c)) elegidos.push(c);

  return elegidos.slice(0, 3).map(({ l, eventos }) => {
    const evento: Evento = eventos[0]!;
    // La grande de la ficha (FichaLugar): la fijada en el lugar o la primera de montaje que no
    // es portada.
    const deLaFicha = evento.fotos.find((f) =>
      l.fotoFicha
        ? f.archivo === l.fotoFicha.archivo
        : f.archivo !== evento.portada && /salon|mesa|montaje|vista/.test(f.archivo),
    );
    const opciones = evento.fotos
      .filter((f) => f.archivo !== evento.portada && f !== deLaFicha && pesoLugar(f.archivo) > 0)
      .sort((a, b) => pesoLugar(b.archivo) - pesoLugar(a.archivo));
    const foto =
      opciones[0] ?? deLaFicha ?? evento.fotos.find((f) => f.archivo === evento.portada)!;
    return { evento, foto };
  });
}

/**
 * Guía de lugares (brief §7.7): haciendas, fincas y salones con montajes reales de bodas y
 * fiestas de 15 años. Solo se nombran los lugares que dieron permiso (enGuia). Van en una
 * sola lista, con el municipio en cada ficha; se separan por municipio cuando al menos dos
 * tienen MINIMO_POR_SECCION lugares, y los demás quedan en "Otros municipios".
 */
export default function Lugares() {
  const { lugares, sitio, guiaLugares, eventos } = obtenerContenido();
  const enGuia = lugares.filter((l) => l.enGuia);
  // Orden de sitio.json (sede primero); solo municipios con lugares nombrables.
  const municipios = sitio.cobertura.zonas.flatMap((z) =>
    z.municipios
      .map((m) => ({
        titulo: ubicacion({ municipio: m, departamento: z.nombre }),
        lugares: enGuia.filter((l) => l.departamento === z.nombre && l.municipio === m),
      }))
      .filter((g) => g.lugares.length > 0),
  );
  const conSeccion = municipios.filter((m) => m.lugares.length >= MINIMO_POR_SECCION);
  const sinSeccion = municipios
    .filter((m) => m.lugares.length < MINIMO_POR_SECCION)
    .flatMap((m) => m.lugares);
  const grupos: { id: string; titulo: string; atajo: string; cantidad?: number; lugares: Lugar[] }[] =
    conSeccion.length < 2
      ? [
          {
            id: "lugares",
            titulo: "Haciendas, fincas y salones en Villavicencio y el Meta",
            atajo: `Ver los ${enGuia.length} lugares`,
            lugares: enGuia,
          },
        ]
      : [
          ...conSeccion.map((m) => ({
            id: ancla(m.titulo),
            titulo: m.titulo,
            atajo: m.titulo.split(",")[0]!,
            cantidad: m.lugares.length,
            lugares: m.lugares,
          })),
          ...(sinSeccion.length > 0
            ? [
                {
                  id: "otros-municipios",
                  titulo: "Otros municipios",
                  atajo: "Otros municipios",
                  cantidad: sinSeccion.length,
                  lugares: sinSeccion,
                },
              ]
            : []),
        ];

  // Collage de la portada: el de guia-lugares.json si lo hay; si no, automático.
  const collage: FotoCollage[] = guiaLugares.portada
    ? guiaLugares.portada.map((p) => {
        const evento = eventos.find((e) => e.slug === p.evento)!;
        return { evento, foto: evento.fotos.find((f) => f.archivo === p.archivo)! };
      })
    : collageAutomatico(enGuia);
  const cifra = [
    enGuia.length === 1 ? "1 lugar" : `${enGuia.length} lugares`,
    municipios.length === 1 ? "1 municipio" : `${municipios.length} municipios`,
  ].join(" · ");

  // Fondos de municipios, consejos y preguntas, alternando (src/lib/fondos.ts).
  const tramo = fondos(
    [{}, ...grupos.map(() => ({})), {}, ...(guiaLugares.preguntas ? [{}] : [])],
    "rubor",
  );
  const fondo = {
    elegir: tramo.shift()!,
    grupos: grupos.map(() => tramo.shift()!),
    consejos: tramo.shift()!,
    preguntas: guiaLugares.preguntas ? tramo.shift()! : "",
  };

  return (
    <main>
      <JsonLd
        datos={[
          listaLugares(enGuia),
          ...(guiaLugares.preguntas ? [preguntasFrecuentes(guiaLugares.preguntas)] : []),
        ]}
      />

      {/* Portada: collage de lugares reales, título, cifra y atajos a la lista. En
          celular, el collage va primero: la guía vende con los espacios montados. */}
      <section aria-labelledby="lugares-titulo" className="pt-4 pb-(--spacing-seccion)">
        <div className="contenedor">
          <Migas
            items={[
              { nombre: "Inicio", ruta: "/" },
              { nombre: "Lugares para bodas y 15 años", ruta: pagina.ruta },
            ]}
          />
          <div className="mt-6 grid items-center gap-10 lg:mt-10 lg:grid-cols-12 lg:gap-14">
            {collage.length === 3 && (
              <div className="min-w-0 lg:order-2 lg:col-span-7">
                <CollageLugares fotos={collage} />
              </div>
            )}
            <div className="min-w-0 lg:col-span-5">
              <p className="antetitulo">Guía de lugares</p>
              <h1 id="lugares-titulo" className="mt-4 text-titulo-1">
                {pagina.h1}
              </h1>
              <p className="mt-5 text-titulo-3 text-terracota">{cifra}</p>
              <nav aria-label="Ir a los lugares" className="mt-8">
                <ul className="flex flex-wrap gap-2">
                  {grupos.map((g) => (
                    <li key={g.id} className="min-w-0">
                      <a
                        href={`#${g.id}`}
                        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-linea bg-superficie px-4 text-sm text-carbon transition-colors hover:border-terracota hover:text-terracota"
                      >
                        {g.atajo}
                        {g.cantidad && <span className="text-topo">{g.cantidad}</span>}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo elegir el lugar: arriba la idea y el contexto; debajo, una tarjeta con foto por
          cada punto de la visita (en celular y tablet se deslizan dentro de su contenedor).
          Va después de ver los espacios, no antes. */}
      <section aria-labelledby="elegir-titulo" className={`${seccion} ${fondo.elegir}`}>
        <div className="contenedor">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-16">
            <div className="min-w-0 lg:col-span-7">
              <h2 id="elegir-titulo" className="antetitulo">
                Cómo elegir el lugar
              </h2>
              <p className="mt-5 font-titulo text-titulo-2 text-terracota">
                {guiaLugares.introduccion.entrada}
              </p>
            </div>
            <p className="min-w-0 lectura text-topo lg:col-span-5">
              {guiaLugares.introduccion.parrafo}
            </p>
          </div>

          <h3 className="mt-12 antetitulo lg:mt-16">Antes de reservar, revisa</h3>
          <ul className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 xl:grid xl:grid-cols-5 xl:overflow-visible xl:pb-0">
            {guiaLugares.introduccion.antesDeReservar.map((item) => {
              const foto = eventos
                .find((e) => e.slug === item.foto.evento)!
                .fotos.find((f) => f.archivo === item.foto.archivo)!;
              return (
                <li
                  key={item.titulo}
                  className="w-[70vw] max-w-72 min-w-0 shrink-0 snap-start overflow-hidden rounded-sm border border-linea bg-superficie xl:w-auto xl:max-w-none"
                >
                  <Foto
                    evento={item.foto.evento}
                    archivo={foto.archivo}
                    alt={foto.alt}
                    posicion={foto.encuadre}
                    sizes="(min-width: 1280px) 18vw, (min-width: 412px) 288px, 70vw"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="p-4">
                    <p className="font-medium text-carbon">{item.titulo}</p>
                    <p className="mt-1 text-sm text-topo">{item.texto}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {grupos.map((g, i) => (
        <section
          key={g.id}
          id={g.id}
          aria-label={g.titulo}
          className={`${seccion} ${fondo.grupos[i]}`}
        >
          <div className="contenedor">
            <h2 className="text-titulo-2">{g.titulo}</h2>
            {/* PRUEBA (2026-10-16): fichas por lugar, una debajo de otra (antes, tarjetas en
                cuadrícula: TarjetaLugar). Primero los lugares con más eventos. */}
            <div className="mt-10 grid gap-6 lg:gap-10">
              {g.lugares
                .map((l) => ({ l, eventos: eventosEnLugar(l.slug) }))
                .sort((a, b) => b.eventos.length - a.eventos.length)
                .map(({ l, eventos }, k) => (
                  <FichaLugar key={l.slug} lugar={l} eventos={eventos} invertida={k % 2 === 1} />
                ))}
            </div>
          </div>
        </section>
      ))}

      <section aria-labelledby="consejos-titulo" className={`${seccion} ${fondo.consejos}`}>
        <div className="contenedor">
          <TituloSeccion
            id="consejos-titulo"
            antetitulo="Consejos de decoración"
            titulo="Cómo decorar según el lugar"
          />
          {/* Filas editoriales: título, texto y foto de referencia, separadas por filetes. En
              celular la foto va más baja y antes del texto, para no alargar la página. */}
          <div className="mt-10 border-t border-dorado/60 lg:mt-12">
            {guiaLugares.consejos.map((c) => {
              const foto = eventos
                .find((e) => e.slug === c.foto.evento)!
                .fotos.find((f) => f.archivo === c.foto.archivo)!;
              return (
                <article
                  key={c.tipo}
                  className="grid min-w-0 gap-5 border-b border-dorado/60 py-8 lg:grid-cols-12 lg:items-center lg:gap-10"
                >
                  <h3 className="min-w-0 text-titulo-2 lg:col-span-3">{c.tipo}</h3>
                  <div className="min-w-0 overflow-hidden rounded-sm lg:order-last lg:col-span-4">
                    <Foto
                      evento={c.foto.evento}
                      archivo={foto.archivo}
                      alt={foto.alt}
                      posicion={foto.encuadre}
                      sizes="(min-width: 1024px) 30vw, 100vw"
                      className="aspect-[16/9] w-full object-cover lg:aspect-[3/2]"
                    />
                  </div>
                  <p className="min-w-0 text-topo lg:col-span-5">
                    <TextoConEventos texto={c.texto} />
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {guiaLugares.preguntas && (
        <SeccionPreguntas
          titulo="Antes de elegir el lugar"
          origen="lugares"
          preguntas={guiaLugares.preguntas}
          className={fondo.preguntas}
        />
      )}

      <SeccionContacto origen="lugares" />
    </main>
  );
}
