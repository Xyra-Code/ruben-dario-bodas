import { FiltroEventos } from "@/components/eventos/FiltroEventos";
import { SeccionContacto } from "@/components/formulario/SeccionContacto";
import { Migas } from "@/components/navegacion/Migas";
import { JsonLd } from "@/components/seo/JsonLd";
import { TarjetaEvento } from "@/components/tarjetas/TarjetaEvento";
import { obtenerContenido } from "@/lib/contenido/cargar";
import { listaEventos } from "@/lib/seo/jsonld";
import { metadatos } from "@/lib/seo/metadatos";
import { PAGINAS } from "@/lib/seo/paginas";

const pagina = PAGINAS.eventos;

export const metadata = metadatos({
  titulo: pagina.titulo,
  descripcion: pagina.descripcion,
  ruta: pagina.ruta,
});

const NOMBRE_FILTRO = { boda: "Bodas", quince: "15 años", otro: "Otros" } as const;

/** Portafolio: todas las tarjetas en el HTML; los filtros solo ocultan (sin URLs nuevas). */
export default function Eventos() {
  const { eventos, sitio } = obtenerContenido();
  const unicos = (valores: string[]) => [...new Set(valores)];
  const tipos = unicos(eventos.map((e) => e.tipo)).map((t) => ({
    valor: t,
    nombre: NOMBRE_FILTRO[t as keyof typeof NOMBRE_FILTRO],
  }));
  // Municipios en el orden de la cobertura (sede primero); estilos en orden alfabético.
  const orden = sitio.cobertura.zonas.flatMap((z) => z.municipios);
  const municipios = unicos(eventos.map((e) => e.lugar.municipio)).sort(
    (a, b) => (orden.indexOf(a) + 1 || 99) - (orden.indexOf(b) + 1 || 99),
  );
  const estilos = unicos(eventos.map((e) => e.estilo)).sort((a, b) => a.localeCompare(b, "es"));

  return (
    <main>
      <JsonLd datos={[listaEventos(eventos)]} />
      <div className="contenedor pt-4 pb-(--spacing-seccion)">
        <Migas
          items={[
            { nombre: "Inicio", ruta: "/" },
            { nombre: "Eventos", ruta: pagina.ruta },
          ]}
        />
        <div className="mt-6 max-w-3xl lg:mt-10">
          <p className="antetitulo">Portafolio</p>
          <h1 className="mt-4 text-titulo-1">{pagina.h1}</h1>
          <p className="mt-5 text-lg text-topo">
            Cada evento, con su lugar, su estilo y su paleta. Toque uno para ver todas las fotos.
          </p>
        </div>

        <div className="mt-10">
          <FiltroEventos
            tipos={tipos}
            municipios={municipios}
            estilos={estilos}
            items={eventos.map((e) => ({
              tipo: e.tipo,
              municipio: e.lugar.municipio,
              estilo: e.estilo,
            }))}
          >
            <ul className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
              {eventos.map((e) => (
                <li
                  key={e.slug}
                  data-tipo={e.tipo}
                  data-municipio={e.lugar.municipio}
                  data-estilo={e.estilo}
                  className="min-w-0"
                >
                  <TarjetaEvento evento={e} nivel="h2" sizes="(min-width: 1024px) 33vw, 50vw" />
                </li>
              ))}
            </ul>
          </FiltroEventos>
        </div>
      </div>

      <SeccionContacto titulo="¿Le gustó lo que vio? Cuéntenos de su evento" origen="eventos" />
    </main>
  );
}
