import { SeccionContacto } from "@/components/formulario/SeccionContacto";
import { Migas } from "@/components/navegacion/Migas";
import { CollageLugares, type FotoCollage } from "@/components/plantillas/CollageLugares";
import { JsonLd } from "@/components/seo/JsonLd";
import { FichaLugar } from "@/components/tarjetas/FichaLugar";
import { IconoCarro, IconoLluvia, IconoLugar, IconoReloj, IconoSol } from "@/components/ui/Iconos";
import { SeccionPreguntas } from "@/components/ui/SeccionPreguntas";
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

const ICONOS_VISITA = {
  luz: IconoSol,
  lluvia: IconoLluvia,
  horario: IconoReloj,
  parqueadero: IconoCarro,
  distancia: IconoLugar,
} as const;

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

  return elegidos.slice(0, 3).map(({ eventos }) => {
    const evento: Evento = eventos[0]!;
    // La grande de la ficha (FichaLugar): la primera de montaje que no es portada.
    const deLaFicha = evento.fotos.find(
      (f) => f.archivo !== evento.portada && /salon|mesa|montaje|vista/.test(f.archivo),
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
 * Guía de lugares (brief §7.7): haciendas, fincas y salones agrupados por municipio, con
 * montajes reales de bodas y fiestas de 15 años. Solo se nombran los lugares que dieron permiso (enGuia).
 */
export default function Lugares() {
  const { lugares, sitio, guiaLugares, eventos } = obtenerContenido();
  const enGuia = lugares.filter((l) => l.enGuia);
  // Orden de sitio.json (sede primero); solo municipios con lugares nombrables.
  const grupos = sitio.cobertura.zonas.flatMap((z) =>
    z.municipios
      .map((m) => ({
        titulo: ubicacion({ municipio: m, departamento: z.nombre }),
        lugares: enGuia.filter((l) => l.departamento === z.nombre && l.municipio === m),
      }))
      .filter((g) => g.lugares.length > 0),
  );

  // Collage de la portada: el de guia-lugares.json si lo hay; si no, automático.
  const collage: FotoCollage[] = guiaLugares.portada
    ? guiaLugares.portada.map((p) => {
        const evento = eventos.find((e) => e.slug === p.evento)!;
        return { evento, foto: evento.fotos.find((f) => f.archivo === p.archivo)! };
      })
    : collageAutomatico(enGuia);
  const cifra = [
    enGuia.length === 1 ? "1 lugar" : `${enGuia.length} lugares`,
    grupos.length === 1 ? "1 municipio" : `${grupos.length} municipios`,
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

      {/* Portada: collage de lugares reales, título, cifra y atajos a cada municipio. En
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
              <nav aria-label="Lugares por municipio" className="mt-8">
                <ul className="flex flex-wrap gap-2">
                  {grupos.map((g) => (
                    <li key={g.titulo} className="min-w-0">
                      <a
                        href={`#${ancla(g.titulo)}`}
                        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-linea bg-superficie px-4 text-sm text-carbon transition-colors hover:border-terracota hover:text-terracota"
                      >
                        {g.titulo.split(",")[0]}
                        <span className="text-topo">{g.lugares.length}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo elegir el lugar: la idea en grande y, al lado, qué revisar en la visita.
          Va después de ver los espacios, no antes. */}
      <section aria-labelledby="elegir-titulo" className={`${seccion} ${fondo.elegir}`}>
        <div className="contenedor grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="min-w-0 lg:col-span-6">
            <h2 id="elegir-titulo" className="antetitulo">
              Cómo elegir el lugar
            </h2>
            <p className="mt-5 font-titulo text-titulo-2 text-terracota">
              {guiaLugares.introduccion.entrada}
            </p>
            <div className="mt-6 filete-dorado w-24" />
            <p className="mt-6 lectura text-topo">{guiaLugares.introduccion.parrafo}</p>
          </div>

          <div className="min-w-0 rounded-sm border border-linea bg-superficie p-6 shadow-[0_1px_24px_rgba(43,39,36,0.05)] sm:p-8 lg:col-span-6">
            <h3 className="antetitulo">Antes de reservar, revisa</h3>
            <ul className="mt-6 space-y-5">
              {guiaLugares.introduccion.antesDeReservar.map((item) => {
                const Icono = ICONOS_VISITA[item.icono];
                return (
                  <li key={item.titulo} className="flex gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-dorado/70 text-terracota">
                      <Icono className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-carbon">{item.titulo}</p>
                      <p className="mt-0.5 text-topo">{item.texto}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {grupos.map((g, i) => (
        <section
          key={g.titulo}
          id={ancla(g.titulo)}
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
          <div className="mt-12 grid gap-8 md:grid-cols-[repeat(auto-fit,minmax(min(16rem,100%),1fr))]">
            {guiaLugares.consejos.map((c) => (
              <article key={c.tipo} className="min-w-0 border-t border-dorado/60 pt-6">
                <h3 className="text-titulo-3">{c.tipo}</h3>
                <p className="mt-3 text-topo">{c.texto}</p>
              </article>
            ))}
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
