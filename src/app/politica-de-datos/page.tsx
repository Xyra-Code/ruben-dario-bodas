import { Migas } from "@/components/navegacion/Migas";
import { obtenerContenido } from "@/lib/contenido/cargar";
import { metadatos } from "@/lib/seo/metadatos";
import { PAGINAS } from "@/lib/seo/paginas";
import { fechaLegible } from "@/lib/whatsapp";

const pagina = PAGINAS.politica;

export const metadata = metadatos({
  titulo: pagina.titulo,
  descripcion: pagina.descripcion,
  ruta: pagina.ruta,
});

const ancla = (i: number) => `seccion-${i + 1}`;

/**
 * Política de datos (brief §7.8): sobria y legible. Índice de anclas (no acordeones: un
 * texto legal no se esconde), ancho de lectura ~70 caracteres.
 */
export default function Politica() {
  const { politica, sitio } = obtenerContenido();
  return (
    <main className="contenedor pt-4 pb-(--spacing-seccion)">
      <Migas
        items={[
          { nombre: "Inicio", ruta: "/" },
          { nombre: "Política de datos", ruta: pagina.ruta },
        ]}
      />
      <header className="mt-6 max-w-3xl lg:mt-10">
        <p className="antetitulo">{sitio.nombre}</p>
        <h1 className="mt-4 text-titulo-1">{pagina.h1}</h1>
        <p className="mt-4 text-sm text-topo">
          Conforme a la Ley 1581 de 2012. Última actualización: {fechaLegible(politica.actualizada)}
          .
        </p>
      </header>

      <div className="mt-12 grid gap-12 lg:grid-cols-12">
        <nav aria-label="Contenido" className="min-w-0 lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <p className="antetitulo">Contenido</p>
            <ol className="mt-4 space-y-1 border-l border-linea pl-4">
              {politica.secciones.map((s, i) => (
                <li key={s.titulo}>
                  <a
                    href={`#${ancla(i)}`}
                    className="inline-flex min-h-11 items-center text-topo hover:text-terracota"
                  >
                    {i + 1}. {s.titulo}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <div className="min-w-0 lg:col-span-8">
          {politica.secciones.map((s, i) => (
            <section
              key={s.titulo}
              id={ancla(i)}
              className="lectura border-t border-linea py-8 first:border-t-0 first:pt-0"
            >
              <h2 className="text-titulo-3">
                {i + 1}. {s.titulo}
              </h2>
              <div className="mt-4 space-y-4 text-topo">
                {s.parrafos.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
