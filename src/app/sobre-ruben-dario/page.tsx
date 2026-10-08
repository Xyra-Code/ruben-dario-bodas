import { SeccionContacto } from "@/components/formulario/SeccionContacto";
import { Migas } from "@/components/navegacion/Migas";
import { JsonLd } from "@/components/seo/JsonLd";
import { TarjetaEvento } from "@/components/tarjetas/TarjetaEvento";
import { Foto } from "@/components/ui/Foto";
import { LineaTiempo } from "@/components/ui/LineaTiempo";
import { TituloSeccion } from "@/components/ui/TituloSeccion";
import { obtenerContenido } from "@/lib/contenido/cargar";
import { paginaSobre } from "@/lib/seo/jsonld";
import { metadatos } from "@/lib/seo/metadatos";
import { PAGINAS } from "@/lib/seo/paginas";

const pagina = PAGINAS.sobre;

export const metadata = metadatos({
  titulo: pagina.titulo,
  descripcion: pagina.descripcion,
  ruta: pagina.ruta,
});

const seccion = "py-(--spacing-seccion)";

/** Sobre Rubén Darío (brief §7.6): historia, trayectoria, forma de diseñar y equipo. */
export default function Sobre() {
  const { sobre, eventos } = obtenerContenido();
  const marcaron = sobre.eventosQueMarcaron
    .map((s) => eventos.find((e) => e.slug === s))
    .filter((e) => e !== undefined);

  return (
    <main>
      <JsonLd datos={paginaSobre(pagina.ruta)} />

      {/* Portada */}
      <section aria-labelledby="sobre-titulo" className="pt-4 pb-(--spacing-seccion)">
        <div className="contenedor">
          <Migas
            items={[
              { nombre: "Inicio", ruta: "/" },
              { nombre: "Nosotros", ruta: pagina.ruta },
            ]}
          />
          <div
            className={`mt-6 grid items-center gap-10 lg:mt-10 lg:gap-16 ${
              sobre.retrato ? "lg:grid-cols-2" : ""
            }`}
          >
            {sobre.retrato && (
              <div className="min-w-0 lg:order-2">
                <Foto
                  evento="sobre"
                  archivo={sobre.retrato.archivo}
                  alt={sobre.retrato.alt}
                  prioridad
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="aspect-[4/5] w-full rounded-sm object-cover"
                />
              </div>
            )}
            <div className="max-w-3xl min-w-0">
              <p className="antetitulo">Nosotros</p>
              <h1 id="sobre-titulo" className="mt-4 text-titulo-1">
                {pagina.h1}
              </h1>
              <p className="mt-6 font-titulo text-titulo-3 text-topo italic">{sobre.frase}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo empezó */}
      <section aria-labelledby="historia-titulo" className={`${seccion} border-t border-linea`}>
        <div className="contenedor grid gap-10 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-4">
            <p className="antetitulo">Historia</p>
            <h2 id="historia-titulo" className="mt-3 text-titulo-2">
              Cómo empezó
            </h2>
          </div>
          <div className="min-w-0 lg:col-span-8">
            <div className="lectura space-y-5 text-topo first-letter:float-left first-letter:mt-1 first-letter:mr-3 first-letter:font-titulo first-letter:text-7xl first-letter:leading-[0.8] first-letter:text-terracota">
              {sobre.historia.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            {sobre.citaHistoria && (
              <blockquote className="mt-10 lectura border-l-2 border-dorado pl-6 font-titulo text-titulo-3 italic">
                <p>{sobre.citaHistoria}</p>
              </blockquote>
            )}
          </div>
        </div>
      </section>

      {/* Trayectoria */}
      <section aria-labelledby="trayectoria-titulo" className={`${seccion} bg-rubor`}>
        <div className="contenedor grid gap-10 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-4">
            <p className="antetitulo">Trayectoria</p>
            <h2 id="trayectoria-titulo" className="mt-3 text-titulo-2">
              Los momentos que lo trajeron hasta aquí
            </h2>
          </div>
          <div className="min-w-0 lg:col-span-8">
            <LineaTiempo hitos={sobre.hitos} />
          </div>
        </div>
      </section>

      {/* Su forma de diseñar */}
      <section aria-labelledby="principios-titulo" className={seccion}>
        <div className="contenedor">
          <TituloSeccion
            id="principios-titulo"
            antetitulo="Su forma de diseñar"
            titulo="Lo que guía cada diseño"
          />
          <ol className="mt-12 grid gap-8 md:grid-cols-[repeat(auto-fit,minmax(min(16rem,100%),1fr))]">
            {sobre.principios.map((p, i) => (
              <li key={p.titulo} className="min-w-0 border-t border-dorado/60 pt-6">
                <span aria-hidden="true" className="font-titulo text-4xl text-dorado-texto">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-titulo-3">{p.titulo}</h3>
                <p className="mt-2 text-topo">{p.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* El equipo */}
      {sobre.equipo.length > 0 && (
        <section aria-labelledby="equipo-titulo" className={`${seccion} border-t border-linea`}>
          <div className="contenedor">
            <TituloSeccion
              id="equipo-titulo"
              antetitulo="El equipo"
              titulo="Quiénes lo acompañan"
            />
            <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-8">
              {sobre.equipo.map((m) => (
                <li key={m.nombre} className="min-w-0">
                  {m.foto && (
                    <Foto
                      evento="sobre"
                      archivo={m.foto.archivo}
                      alt={m.foto.alt}
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="aspect-[4/5] w-full rounded-sm object-cover"
                    />
                  )}
                  <p className="mt-4 font-titulo text-xl">{m.nombre}</p>
                  <p className="text-sm text-topo">{m.rol}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Eventos que lo marcaron */}
      {marcaron.length > 0 && (
        <section aria-labelledby="marcaron-titulo" className={`${seccion} bg-rubor`}>
          <div className="contenedor">
            <TituloSeccion
              id="marcaron-titulo"
              antetitulo="Portafolio"
              titulo="Eventos que lo marcaron"
            />
            <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-x-8">
              {marcaron.map((e) => (
                <TarjetaEvento key={e.slug} evento={e} sizes="(min-width: 1024px) 33vw, 50vw" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reconocimientos */}
      {sobre.reconocimientos.length > 0 && (
        <section aria-labelledby="reconocimientos-titulo" className={seccion}>
          <div className="contenedor">
            <TituloSeccion
              id="reconocimientos-titulo"
              antetitulo="Reconocimientos"
              titulo="Publicaciones y reconocimientos"
            />
            <ul className="mt-8 grid gap-3">
              {sobre.reconocimientos.map((r) => (
                <li key={r} className="border-b border-linea pb-3">
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <SeccionContacto origen="sobre" />
    </main>
  );
}
