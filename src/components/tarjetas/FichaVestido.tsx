import { VisorGaleria } from "@/components/galeria/VisorGaleria";
import { Boton } from "@/components/ui/Boton";
import { Foto } from "@/components/ui/Foto";
import { obtenerImagen } from "@/lib/imagenes";

type FotoVestido = { evento: string; archivo: string; alt: string };

type Props = {
  titulo: string;
  texto: string;
  cita?: { texto: string; autor: string };
  /** La primera es la principal: ocupa toda la fila en el celular. */
  fotos: FotoVestido[];
  enlace: { ruta: string; texto: string };
};

/**
 * Un vestido real del portafolio. Las fotos van a la misma altura y sin recortar (cada una
 * crece según su proporción): un recorte fijo se comería la cola o el velo, que es justo lo
 * que se viene a mirar. Cada foto abre el visor a pantalla completa para ver el detalle de
 * la tela, sobre todo en el celular, donde las secundarias quedan pequeñas.
 *
 * Va en tarjeta para que cada vestido se lea como una unidad: con el mismo formato repetido,
 * el solo espacio no los separaba. En el celular las fotos llegan al borde para no perder
 * tamaño. No se eleva al pasar el cursor porque la tarjeta en sí no es un enlace.
 */
export function FichaVestido({ titulo, texto, cita, fotos, enlace }: Props) {
  const imagenes = fotos.map((f) => obtenerImagen(f.evento, f.archivo));
  const visor = fotos.map((f, i) => ({
    src: imagenes[i].variantes.at(-1)!.src,
    srcSet: imagenes[i].variantes.map((v) => `${v.src} ${v.ancho}w`).join(", "),
    alt: f.alt,
    ancho: imagenes[i].ancho,
    alto: imagenes[i].alto,
  }));

  return (
    <article className="overflow-hidden rounded-sm border border-linea bg-superficie shadow-[0_1px_24px_rgba(43,39,36,0.05)]">
      <VisorGaleria fotos={visor}>
        <ul className="flex flex-wrap gap-1 md:flex-nowrap md:gap-3 md:p-3 md:pb-0 lg:gap-4 lg:p-4 lg:pb-0">
          {fotos.map((f, i) => (
            <li
              key={f.archivo}
              className="min-w-0 basis-0 first:basis-full md:first:basis-0"
              style={{ flexGrow: imagenes[i].ancho / imagenes[i].alto }}
            >
              <button
                type="button"
                data-indice={i}
                aria-label={`Ver foto ${i + 1} de ${fotos.length}: ${f.alt}`}
                className="group block w-full cursor-zoom-in overflow-hidden -outline-offset-4 md:rounded-sm"
              >
                <Foto
                  {...f}
                  sizes={
                    i === 0 ? "(min-width: 768px) 45vw, 100vw" : "(min-width: 768px) 35vw, 60vw"
                  }
                  className="w-full transition-transform duration-700 ease-suave group-hover:scale-[1.03]"
                />
              </button>
            </li>
          ))}
        </ul>
      </VisorGaleria>
      <div className="grid gap-3 px-5 pt-5 pb-4 md:px-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-12 lg:pt-6">
        <h3 className="min-w-0 text-titulo-3">{titulo}</h3>
        <div className="min-w-0">
          <p className="text-topo">{texto}</p>
          {cita && (
            <blockquote className="mt-5 border-l-2 border-terracota pl-4">
              <p className="text-carbon">“{cita.texto}”</p>
              <footer className="mt-1 text-sm text-topo">{cita.autor}</footer>
            </blockquote>
          )}
          <div className="mt-3">
            <Boton href={enlace.ruta} variante="texto">
              {enlace.texto}
            </Boton>
          </div>
        </div>
      </div>
    </article>
  );
}
