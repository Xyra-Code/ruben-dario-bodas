import Link from "next/link";

import { Foto } from "@/components/ui/Foto";
import { IconoFlecha } from "@/components/ui/Iconos";

type Props = {
  titulo: string;
  texto: string;
  ruta: string;
  /** Foto de un evento del tipo que ilustra el servicio. */
  foto?: { evento: string; archivo: string; alt: string };
  /** La de bodas es más grande: es el fuerte de la empresa. */
  destacada?: boolean;
};

/** Tarjeta de servicio con foto: toda la tarjeta enlaza a /bodas o /quince-anos. */
export function TarjetaServicio({ titulo, texto, ruta, foto, destacada = false }: Props) {
  return (
    <article className="group relative flex h-full min-w-0 flex-col">
      {foto && (
        <div className="overflow-hidden rounded-sm">
          <Foto
            evento={foto.evento}
            archivo={foto.archivo}
            alt={foto.alt}
            sizes={
              destacada ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 100vw"
            }
            className={`w-full object-cover transition-transform duration-700 ease-suave group-hover:scale-[1.03] ${
              destacada ? "aspect-[4/5] lg:aspect-[4/5]" : "aspect-[3/2]"
            }`}
          />
        </div>
      )}
      <h3 className={`mt-5 ${destacada ? "text-titulo-2" : "text-titulo-3"}`}>
        <Link
          href={ruta}
          className="after:absolute after:inset-0 after:rounded-sm hover:text-terracota focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-terracota"
        >
          {titulo}
        </Link>
      </h3>
      <p className="mt-2 text-topo">{texto}</p>
      <span
        className="mt-4 inline-flex min-h-11 items-center gap-2 text-terracota"
        aria-hidden="true"
      >
        Conozca el servicio
        <IconoFlecha className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
    </article>
  );
}
