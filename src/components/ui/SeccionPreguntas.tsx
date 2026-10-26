import { Acordeon } from "@/components/ui/Acordeon";
import { Boton } from "@/components/ui/Boton";
import { obtenerContenido } from "@/lib/contenido/cargar";
import type { PreguntaFrecuente } from "@/lib/contenido/esquemas";
import { MENSAJES_PREGUNTA, enlaceWhatsApp } from "@/lib/whatsapp";

type Props = {
  titulo: string;
  preguntas: PreguntaFrecuente[];
  /** Página de origen: elige el mensaje de WhatsApp del cierre y lo marca en la analítica. */
  origen: keyof typeof MENSAJES_PREGUNTA;
  /** Ancla de la sección (el inicio la enlaza desde el menú). */
  id?: string;
  /** Clases de fondo o borde de la sección (alternan según la página). */
  className?: string;
};

/**
 * Preguntas frecuentes de una página: título a la izquierda desde lg, acordeón a la
 * derecha. Cada página lleva sus propias preguntas, sin repetir las de otra; el FAQPage
 * de los datos estructurados lo agrega la página.
 *
 * Debajo del título, un cierre hacia WhatsApp que llena la columna izquierda y la
 * acompaña fija mientras se leen las preguntas. En móvil va después del acordeón
 * (`contents` + `order-last`) para no empujar las preguntas hacia abajo.
 */
export function SeccionPreguntas({
  titulo,
  preguntas,
  origen,
  id,
  className = "border-t border-linea",
}: Props) {
  const { sitio } = obtenerContenido();

  return (
    <section
      id={id}
      aria-labelledby="preguntas-titulo"
      className={`py-(--spacing-seccion) ${className}`}
    >
      <div className="contenedor grid gap-10 lg:grid-cols-12">
        <div className="contents lg:sticky lg:top-24 lg:col-span-4 lg:block lg:self-start">
          <div className="min-w-0">
            <p className="antetitulo">Preguntas frecuentes</p>
            <h2 id="preguntas-titulo" className="mt-3 text-titulo-2">
              {titulo}
            </h2>
          </div>
          <div className="order-last min-w-0 lg:order-none lg:mt-10 lg:border-t lg:border-linea lg:pt-8">
            <p className="font-titulo text-titulo-3">¿No encuentras tu pregunta?</p>
            <p className="mt-3 text-topo">
              Cuéntanos la fecha y el lugar de tu evento y te respondemos por WhatsApp.
            </p>
            <Boton
              href={enlaceWhatsApp(sitio.whatsapp, MENSAJES_PREGUNTA[origen])}
              whatsapp
              variante="secundario"
              origen={`preguntas-${origen}`}
              className="mt-6"
            >
              Escríbenos por WhatsApp
            </Boton>
          </div>
        </div>
        <div className="min-w-0 lg:col-span-8">
          <Acordeon preguntas={preguntas} />
        </div>
      </div>
    </section>
  );
}
