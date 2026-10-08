import { Migas } from "@/components/navegacion/Migas";
import { JsonLd } from "@/components/seo/JsonLd";
import { paginaSobre } from "@/lib/seo/jsonld";
import { metadatos } from "@/lib/seo/metadatos";
import { PAGINAS } from "@/lib/seo/paginas";
import { SeccionContacto } from "@/components/formulario/SeccionContacto";

const pagina = PAGINAS.sobre;

export const metadata = metadatos({
  titulo: pagina.titulo,
  descripcion: pagina.descripcion,
  ruta: pagina.ruta,
});

// Esqueleto de la Fase 3. Contenido (historia, equipo, hitos) pendiente de la empresa.
export default function Sobre() {
  return (
    <main>
      <div className="contenedor py-8 lg:py-12">
        <JsonLd datos={paginaSobre(pagina.ruta)} />
        <Migas
          items={[
            { nombre: "Inicio", ruta: "/" },
            { nombre: "Nosotros", ruta: pagina.ruta },
          ]}
        />
        <h1 className="text-titulo-1">{pagina.h1}</h1>
      </div>
      <SeccionContacto origen="sobre" />
    </main>
  );
}
