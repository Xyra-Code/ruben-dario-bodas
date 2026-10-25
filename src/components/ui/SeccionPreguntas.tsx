import { Acordeon } from "@/components/ui/Acordeon";
import type { PreguntaFrecuente } from "@/lib/contenido/esquemas";

type Props = {
  titulo: string;
  preguntas: PreguntaFrecuente[];
  /** Clases de fondo o borde de la sección (alternan según la página). */
  className?: string;
};

/**
 * Preguntas frecuentes de una página: título a la izquierda desde lg, acordeón a la
 * derecha. Cada página lleva sus propias preguntas, sin repetir las de otra; el FAQPage
 * de los datos estructurados lo agrega la página.
 */
export function SeccionPreguntas({
  titulo,
  preguntas,
  className = "border-t border-linea",
}: Props) {
  return (
    <section aria-labelledby="preguntas-titulo" className={`py-(--spacing-seccion) ${className}`}>
      <div className="contenedor grid gap-10 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-4">
          <p className="antetitulo">Preguntas frecuentes</p>
          <h2 id="preguntas-titulo" className="mt-3 text-titulo-2">
            {titulo}
          </h2>
        </div>
        <div className="min-w-0 lg:col-span-8">
          <Acordeon preguntas={preguntas} />
        </div>
      </div>
    </section>
  );
}
