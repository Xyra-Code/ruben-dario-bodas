import type { ReactNode } from "react";

import { Migas } from "@/components/navegacion/Migas";
import { CreditoEvento } from "@/components/ui/CreditoEvento";
import { Foto } from "@/components/ui/Foto";
import { obtenerImagen } from "@/lib/imagenes";
import type { Miga } from "@/lib/seo/jsonld";

type Props = {
  /** id del h1 (va en `children`), para aria-labelledby de la sección. */
  idTitulo: string;
  migas: Miga[];
  /** Foto de un evento (o "sobre" para las fotos sueltas de la página Sobre). */
  foto?: { evento: string; archivo: string; alt: string; posicion?: string };
  /** Antetítulo, H1, bajada y botones. */
  children: ReactNode;
};

/**
 * Medidas de la foto de portada.
 * - Celular y tableta: la altura sale de lo que deja libre el texto (--alto-portada), para
 *   que el título y el botón se alcancen a ver sin bajar. El ancho tope evita una franja
 *   demasiado horizontal en una tableta o con el celular girado.
 * - Escritorio: 3:4, con el ancho que la deja entera en la primera pantalla.
 * Las comparte la foto de la presentación de los servicios para que ambas midan igual.
 */
export const MEDIDAS_FOTO_PORTADA =
  "mx-auto w-full max-w-[calc(var(--alto-portada)*1.25)] [--alto-portada:clamp(15rem,calc(100dvh_-_32.5rem),36rem)] lg:w-[min(40rem,48vw,max(16rem,calc((100dvh_-_8rem)_*_3_/_4)))] lg:max-w-none";
export const CLASES_IMG_PORTADA =
  "h-(--alto-portada) w-full rounded-sm object-cover lg:aspect-[3/4] lg:h-auto";
/**
 * `sizes` de la foto de portada. Una foto más ancha que su caja se recorta a lo alto y se
 * muestra más grande que la caja: sin este ajuste, el navegador carga una versión pequeña y
 * la estira, y se ve borrosa. Cajas: 3:4 en escritorio y casi cuadrada en celular.
 */
export function sizesFotoPortada(evento: string, archivo: string) {
  const { ancho, alto } = obtenerImagen(evento, archivo);
  const proporcion = ancho / alto;
  const escritorio = Math.round(50 * Math.max(1, proporcion / (3 / 4)));
  const celular = Math.round(100 * Math.max(1, proporcion / 1.1));
  return `(min-width: 1024px) ${escritorio}vw, ${celular}vw`;
}

/**
 * Portada de las páginas internas con foto (servicios, vestidos, sobre): la foto se ve
 * entera en la primera pantalla, sin hacer scroll.
 * - Celular: migas, foto y texto, con la foto a la altura que deja ver también el título y
 *   el botón (MEDIDAS_FOTO_PORTADA).
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
          <figure
            className={`relative mt-3 min-w-0 [grid-area:foto] lg:mt-0 lg:mr-0 ${MEDIDAS_FOTO_PORTADA}`}
          >
            <Foto
              {...foto}
              prioridad
              sizes={sizesFotoPortada(foto.evento, foto.archivo)}
              className={CLASES_IMG_PORTADA}
            />
            {/* Crédito solo en fotos del portafolio (no en las sueltas de Sobre). */}
            {foto.evento !== "sobre" && <CreditoEvento evento={foto.evento} enlace />}
          </figure>
        )}
        <div className="mt-6 max-w-3xl min-w-0 self-center [grid-area:texto] lg:mt-0">
          {children}
        </div>
      </div>
    </section>
  );
}
