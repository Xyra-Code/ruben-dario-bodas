import { Acordeon } from "@/components/ui/Acordeon";
import { Boton } from "@/components/ui/Boton";
import { Foto } from "@/components/ui/Foto";
import { obtenerContenido } from "@/lib/contenido/cargar";
import type { PreguntaFrecuente } from "@/lib/contenido/esquemas";
import { MENSAJES_PREGUNTA, enlaceWhatsApp } from "@/lib/whatsapp";

type Props = {
  titulo: string;
  preguntas: PreguntaFrecuente[];
  /**
   * Página de origen: elige la foto (sitio.json → fotosPreguntas) y el mensaje de WhatsApp
   * del cierre, y lo marca en la analítica.
   */
  origen: keyof typeof MENSAJES_PREGUNTA;
  /** Ancla de la sección (el inicio la enlaza desde el menú). */
  id?: string;
  /** Clases de fondo o borde de la sección (alternan según la página). */
  className?: string;
};

/**
 * Preguntas frecuentes de una página. Cada página lleva sus propias preguntas, sin repetir
 * las de otra; el FAQPage de los datos estructurados lo agrega la página.
 *
 * Desde lg: a la izquierda el título y una foto vertical, con el cierre hacia WhatsApp en
 * terracota montado sobre ella, que acompañan fijos mientras se leen las preguntas en
 * tarjetas, a la derecha. En móvil: título, foto baja, tarjetas y, al final, el cierre
 * (`contents` + `order-last`). Como en el HTML el cierre va antes del acordeón, lleva
 * `overflow-anchor: none`: si no, el navegador lo toma de ancla al abrir una pregunta y la
 * sube, en vez de abrirla hacia abajo.
 */
export function SeccionPreguntas({
  titulo,
  preguntas,
  origen,
  id,
  className = "border-t border-linea",
}: Props) {
  const { sitio, eventos } = obtenerContenido();
  const elegida = sitio.fotosPreguntas[origen];
  const foto = eventos
    .find((e) => e.slug === elegida.evento)!
    .fotos.find((f) => f.archivo === elegida.archivo)!;

  return (
    <section
      id={id}
      aria-labelledby="preguntas-titulo"
      className={`py-(--spacing-seccion) ${className}`}
    >
      <div className="contenedor grid gap-8 lg:grid-cols-12 lg:gap-14">
        <div className="contents lg:sticky lg:top-24 lg:col-span-5 lg:block lg:self-start">
          <div className="min-w-0">
            <p className="antetitulo">Preguntas frecuentes</p>
            <h2 id="preguntas-titulo" className="mt-3 text-titulo-2">
              {titulo}
            </h2>
          </div>
          <div className="contents lg:relative lg:mt-8 lg:block lg:pb-28">
            <div className="min-w-0 overflow-hidden rounded-sm lg:w-[85%]">
              <Foto
                evento={elegida.evento}
                archivo={foto.archivo}
                alt={foto.alt}
                posicion={elegida.encuadre}
                sizes="(min-width: 1024px) 400px, 100vw"
                className="aspect-[4/3] w-full object-cover lg:aspect-[4/5]"
              />
            </div>
            <div className="order-last min-w-0 rounded-sm bg-terracota p-6 text-sobre-principal shadow-lg [overflow-anchor:none] lg:absolute lg:right-0 lg:bottom-0 lg:w-[92%] xl:w-[78%]">
              <p className="font-titulo text-titulo-3">¿No encuentras tu pregunta?</p>
              <p className="mt-3">
                Cuéntanos la fecha y el lugar de tu evento y te respondemos por WhatsApp.
              </p>
              <Boton
                href={enlaceWhatsApp(sitio.whatsapp, MENSAJES_PREGUNTA[origen])}
                whatsapp
                ancho
                variante="claro"
                origen={`preguntas-${origen}`}
                className="mt-5"
              >
                Escríbenos por WhatsApp
              </Boton>
            </div>
          </div>
        </div>
        <div className="min-w-0 lg:col-span-7">
          <Acordeon preguntas={preguntas} />
        </div>
      </div>
    </section>
  );
}
