import Link from "next/link";

import { Migas } from "@/components/navegacion/Migas";
import { JsonLd } from "@/components/seo/JsonLd";
import { Foto } from "@/components/ui/Foto";
import { obtenerContenido } from "@/lib/contenido/cargar";
import { listaEventos } from "@/lib/seo/jsonld";
import { metadatos } from "@/lib/seo/metadatos";
import { PAGINAS } from "@/lib/seo/paginas";
import { rutaEvento } from "@/lib/rutas";
import { SeccionContacto } from "@/components/formulario/SeccionContacto";

const pagina = PAGINAS.eventos;

export const metadata = metadatos({
  titulo: pagina.titulo,
  descripcion: pagina.descripcion,
  ruta: pagina.ruta,
});

// Esqueleto de la Fase 3. Filtros (en el navegador, sin URLs indexables) y diseño: Fases 4 y 5.
export default function Eventos() {
  const { eventos } = obtenerContenido();
  return (
    <main>
      <div className="contenedor py-8 lg:py-12">
        <JsonLd datos={[listaEventos(eventos)]} />
        <Migas
          items={[
            { nombre: "Inicio", ruta: "/" },
            { nombre: "Eventos", ruta: pagina.ruta },
          ]}
        />
        <h1 className="text-titulo-1">{pagina.h1}</h1>
        <ul className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {eventos.map((e) => (
            <li key={e.slug} className="min-w-0">
              <Link href={rutaEvento(e.slug)}>
                <Foto
                  evento={e.slug}
                  archivo={e.portada}
                  alt={e.fotos.find((f) => f.archivo === e.portada)!.alt}
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="aspect-[4/5] w-full object-cover"
                />
                <span>{e.titulo}</span>
              </Link>
              <p className="text-sm text-topo">
                {e.lugar.municipio} · {e.fecha.slice(0, 4)}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <SeccionContacto titulo="¿Le gustó lo que vio? Cuéntenos de su evento" origen="eventos" />
    </main>
  );
}
