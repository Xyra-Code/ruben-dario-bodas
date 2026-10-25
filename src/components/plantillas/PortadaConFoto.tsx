import type { ReactNode } from "react";

import { Migas } from "@/components/navegacion/Migas";
import { Foto } from "@/components/ui/Foto";
import type { Miga } from "@/lib/seo/jsonld";

type Props = {
  /** id del h1 (va en `children`), para aria-labelledby de la sección. */
  idTitulo: string;
  migas: Miga[];
  /** Foto de un evento (o "sobre" para las fotos sueltas de la página Sobre). */
  foto?: { evento: string; archivo: string; alt: string };
  /** Antetítulo, H1, bajada y botones. */
  children: ReactNode;
};

/**
 * Portada de las páginas internas con foto (servicios, vestidos, sobre): la foto se ve
 * entera en la primera pantalla, sin hacer scroll.
 * - Celular: migas, foto y texto. La foto va en 3:4 con un ancho tope que la deja caber
 *   bajo el encabezado y las migas en cualquier alto de pantalla.
 * - Escritorio: la foto sube al nivel de las migas para aprovechar el alto, y el texto se
 *   centra a su lado.
 */
export function PortadaConFoto({ idTitulo, migas, foto, children }: Props) {
  return (
    <section aria-labelledby={idTitulo} className="pt-4 pb-(--spacing-seccion)">
      <div
        className={`contenedor grid ${
          foto
            ? "[grid-template-areas:'migas'_'foto'_'texto'] lg:grid-cols-[minmax(0,1fr)_auto] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:[grid-template-areas:'migas_foto'_'texto_foto']"
            : "[grid-template-areas:'migas'_'texto']"
        }`}
      >
        <div className="min-w-0 [grid-area:migas]">
          <Migas items={migas} />
        </div>
        {foto && (
          <div className="mx-auto mt-6 w-full max-w-[max(16rem,calc((100dvh_-_12rem)_*_3_/_4))] min-w-0 [grid-area:foto] lg:mt-0 lg:mr-0 lg:w-[min(40rem,48vw,max(16rem,calc((100dvh_-_8rem)_*_3_/_4)))] lg:max-w-none">
            <Foto
              {...foto}
              prioridad
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="aspect-[3/4] w-full rounded-sm object-cover"
            />
          </div>
        )}
        <div className="mt-10 max-w-3xl min-w-0 self-center [grid-area:texto] lg:mt-0">
          {children}
        </div>
      </div>
    </section>
  );
}
