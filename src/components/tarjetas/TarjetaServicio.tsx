import Link from "next/link";

import { CreditoEvento } from "@/components/ui/CreditoEvento";
import { Foto } from "@/components/ui/Foto";
import { IconoFlecha } from "@/components/ui/Iconos";

type Props = {
  titulo: string;
  texto: string;
  ruta: string;
  /** Foto de un evento del tipo que ilustra el servicio (`encuadre`: punto que no se recorta). */
  foto?: { evento: string; archivo: string; alt: string; encuadre?: string };
  /** Etiqueta sobre la foto ("Nuestra especialidad"): marca el servicio fuerte sin agrandarlo. */
  etiqueta?: string;
  /**
   * Tamaño en el celular: "destacada" va a todo el ancho con foto horizontal; "compacta" va en
   * media columna, sin frase ni crédito visibles (siguen en el HTML). Desde tableta miden igual.
   */
  variante: "destacada" | "compacta";
};

/**
 * Tarjeta de servicio: las tres del inicio miden igual desde tableta (foto 3:4) y toda la
 * tarjeta enlaza a /bodas, /quince-anos o /vestidos-de-novia. En el celular se reparten en una
 * destacada y dos compactas, para que la sección no ocupe una pantalla por servicio.
 */
export function TarjetaServicio({ titulo, texto, ruta, foto, etiqueta, variante }: Props) {
  const compacta = variante === "compacta";
  return (
    // Caja propia (superficie + borde): foto arriba y texto dentro, para que cada tarjeta se
    // lea como una unidad y no se mezcle con la siguiente, sobre todo en el celular.
    <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-sm border border-linea bg-superficie transition-shadow duration-300 hover:shadow-[0_16px_40px_-24px_rgb(42_30_27/0.35)]">
      {foto && (
        <figure className="relative overflow-hidden">
          <Foto
            evento={foto.evento}
            archivo={foto.archivo}
            alt={foto.alt}
            posicion={foto.encuadre}
            sizes={compacta ? "(min-width: 768px) 33vw, 50vw" : "(min-width: 768px) 33vw, 100vw"}
            className={`w-full object-cover transition-transform duration-700 ease-suave group-hover:scale-[1.03] md:aspect-[3/4] ${compacta ? "aspect-[4/5]" : "aspect-[4/3]"}`}
          />
          {etiqueta && (
            <span className="absolute top-3 left-3 rounded-sm bg-marfil/90 px-2.5 py-1 text-xs font-medium tracking-[0.12em] text-terracota uppercase">
              {etiqueta}
            </span>
          )}
          {/* Sin enlace propio: toda la tarjeta ya lleva a su servicio. */}
          <CreditoEvento evento={foto.evento} className={compacta ? "max-sm:hidden" : ""} />
        </figure>
      )}
      <div
        className={`flex min-w-0 flex-1 flex-col pb-2 sm:px-6 sm:pt-6 ${compacta ? "px-3 pt-3" : "px-5 pt-5"}`}
      >
        <h3 className={`text-titulo-3 ${compacta ? "max-sm:text-lg max-sm:leading-snug" : ""}`}>
          <Link
            href={ruta}
            className="after:absolute after:inset-0 after:rounded-sm hover:text-terracota focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-terracota"
          >
            {titulo}
          </Link>
        </h3>
        <p className={`mt-2 mb-5 text-topo ${compacta ? "max-sm:hidden" : ""}`}>{texto}</p>
        {/* mt-auto: el pie queda a la misma altura en las tarjetas aunque el texto varíe. */}
        <span
          className={`mt-auto flex min-h-11 items-center gap-2 border-t border-linea pt-1 text-terracota ${compacta ? "max-sm:mt-3 max-sm:text-sm" : ""}`}
          aria-hidden="true"
        >
          {compacta ? (
            <>
              <span className="sm:hidden">Ver más</span>
              <span className="max-sm:hidden">Conoce el servicio</span>
            </>
          ) : (
            "Conoce el servicio"
          )}
          <IconoFlecha className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}
