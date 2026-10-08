import { SeccionContacto } from "@/components/formulario/SeccionContacto";
import { Migas } from "@/components/navegacion/Migas";
import { JsonLd } from "@/components/seo/JsonLd";
import { TarjetaLugar } from "@/components/tarjetas/TarjetaLugar";
import { TituloSeccion } from "@/components/ui/TituloSeccion";
import { eventosEnLugar, obtenerContenido } from "@/lib/contenido/cargar";
import { ubicacion } from "@/lib/rutas";
import { listaLugares } from "@/lib/seo/jsonld";
import { metadatos } from "@/lib/seo/metadatos";
import { PAGINAS } from "@/lib/seo/paginas";

const pagina = PAGINAS.lugares;

export const metadata = metadatos({
  titulo: pagina.titulo,
  descripcion: pagina.descripcion,
  ruta: pagina.ruta,
});

const seccion = "py-(--spacing-seccion)";

/**
 * Guía de lugares (brief §7.7): haciendas, fincas y salones agrupados por municipio, con
 * montajes reales. Solo se nombran los lugares que dieron permiso (enGuia).
 */
export default function Lugares() {
  const { lugares, sitio, guiaLugares } = obtenerContenido();
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

  return (
    <main>
      <JsonLd datos={[listaLugares(enGuia)]} />

      <section aria-labelledby="lugares-titulo" className="pt-4 pb-(--spacing-seccion)">
        <div className="contenedor">
          <Migas
            items={[
              { nombre: "Inicio", ruta: "/" },
              { nombre: "Lugares para bodas", ruta: pagina.ruta },
            ]}
          />
          <div className="mt-6 grid gap-10 lg:mt-10 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-5">
              <p className="antetitulo">Guía de lugares</p>
              <h1 id="lugares-titulo" className="mt-4 text-titulo-1">
                {pagina.h1}
              </h1>
            </div>
            <div className="lectura min-w-0 space-y-5 text-topo lg:col-span-7 lg:pt-10">
              {guiaLugares.introduccion.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {grupos.map((g, i) => (
        <section
          key={g.titulo}
          aria-label={g.titulo}
          className={`${seccion} ${i % 2 === 0 ? "border-t border-linea" : "bg-rubor"}`}
        >
          <div className="contenedor">
            <h2 className="text-titulo-2">{g.titulo}</h2>
            <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {g.lugares.map((l) => (
                <TarjetaLugar key={l.slug} lugar={l} eventos={eventosEnLugar(l.slug)} />
              ))}
            </div>
          </div>
        </section>
      ))}

      <section aria-labelledby="consejos-titulo" className={`${seccion} border-t border-linea`}>
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

      <SeccionContacto tipoInicial="boda" origen="lugares" />
    </main>
  );
}
