import Link from "next/link";

import { JsonLd } from "@/components/seo/JsonLd";
import { migas, type Miga } from "@/lib/seo/jsonld";

/**
 * Migas de pan visibles + su BreadcrumbList, desde los mismos datos para que nunca
 * difieran. El último elemento es la página actual (sin enlace). Estilo final: Fase 4.
 */
export function Migas({ items }: { items: Miga[] }) {
  return (
    <>
      <nav aria-label="Migas de pan" className="text-sm text-topo">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {items.map((m, i) => {
            const actual = i === items.length - 1;
            return (
              <li key={m.ruta} className="flex min-w-0 items-center gap-2">
                {actual ? (
                  <span aria-current="page" className="text-carbon">
                    {m.nombre}
                  </span>
                ) : (
                  <>
                    <Link
                      href={m.ruta}
                      className="inline-flex min-h-11 items-center underline-offset-4 hover:underline"
                    >
                      {m.nombre}
                    </Link>
                    <span aria-hidden="true">›</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd datos={[migas(items)]} />
    </>
  );
}
