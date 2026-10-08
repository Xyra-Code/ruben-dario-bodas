import { Migas } from "@/components/navegacion/Migas";
import { metadatos } from "@/lib/seo/metadatos";
import { PAGINAS } from "@/lib/seo/paginas";

const pagina = PAGINAS.politica;

export const metadata = metadatos({
  titulo: pagina.titulo,
  descripcion: pagina.descripcion,
  ruta: pagina.ruta,
});

// Esqueleto de la Fase 3. Texto legal pendiente de la empresa (Ley 1581 de 2012).
export default function Politica() {
  return (
    <main>
      <div className="contenedor py-8 lg:py-12">
        <Migas
          items={[
            { nombre: "Inicio", ruta: "/" },
            { nombre: "Política de datos", ruta: pagina.ruta },
          ]}
        />
        <h1 className="text-titulo-1">{pagina.h1}</h1>
      </div>
    </main>
  );
}
