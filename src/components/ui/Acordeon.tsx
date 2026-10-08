import type { PreguntaFrecuente } from "@/lib/contenido/esquemas";

import { IconoMas } from "@/components/ui/Iconos";

/**
 * Preguntas frecuentes con <details>: sin JavaScript, accesible con teclado y las
 * respuestas quedan en el HTML (Google y las IA las leen aunque estén cerradas).
 */
export function Acordeon({ preguntas }: { preguntas: PreguntaFrecuente[] }) {
  return (
    <div className="divide-y divide-linea border-y border-linea">
      {preguntas.map((p) => (
        <details key={p.pregunta} className="group">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-titulo text-[1.1875rem] leading-snug sm:text-xl [&::-webkit-details-marker]:hidden">
            <span className="min-w-0">{p.pregunta}</span>
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-linea text-terracota transition-transform duration-300 group-open:rotate-45">
              <IconoMas className="size-4" />
            </span>
          </summary>
          <div className="lectura pr-12 pb-6 text-topo">
            <p>{p.respuesta}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
