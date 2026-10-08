import Link from "next/link";

import { Migas } from "@/components/navegacion/Migas";
import { JsonLd } from "@/components/seo/JsonLd";
import { eventosEnLugar, obtenerContenido } from "@/lib/contenido/cargar";
import { listaLugares } from "@/lib/seo/jsonld";
import { metadatos } from "@/lib/seo/metadatos";
import { PAGINAS } from "@/lib/seo/paginas";
import { rutaEvento, ubicacion } from "@/lib/rutas";

const pagina = PAGINAS.lugares;

export const metadata = metadatos({
  titulo: pagina.titulo,
  descripcion: pagina.descripcion,
  ruta: pagina.ruta,
});

// Esqueleto de la Fase 3. Solo se nombran los lugares con permiso (enGuia).
export default function Lugares() {
  const { lugares, sitio } = obtenerContenido();
  const enGuia = lugares.filter((l) => l.enGuia);
  // Orden de sitio.json (sede primero); municipios con lugares nombrables.
  const grupos = sitio.cobertura.zonas.flatMap((z) =>
    z.municipios
      .map((m) => ({
        titulo: ubicacion({ municipio: m, departamento: z.nombre }),
        lugares: enGuia.filter((l) => l.departamento === z.nombre && l.municipio === m),
      }))
      .filter((g) => g.lugares.length > 0),
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <JsonLd datos={[listaLugares(enGuia)]} />
      <Migas
        items={[
          { nombre: "Inicio", ruta: "/" },
          { nombre: "Lugares para bodas", ruta: pagina.ruta },
        ]}
      />
      <h1 className="text-3xl">{pagina.h1}</h1>
      {grupos.map((g) => (
        <section key={g.titulo} className="mt-8">
          <h2 className="text-xl">{g.titulo}</h2>
          <ul>
            {g.lugares.map((l) => (
              <li key={l.slug}>
                <h3>{l.nombre}</h3>
                {l.capacidad && <p>{l.capacidad}</p>}
                <ul>
                  {eventosEnLugar(l.slug).map((e) => (
                    <li key={e.slug}>
                      <Link href={rutaEvento(e.slug)}>{e.titulo}</Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
