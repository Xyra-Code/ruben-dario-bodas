import type { PreguntaFrecuente } from "@/lib/contenido/esquemas";

import { IconoMas } from "@/components/ui/Iconos";

/**
 * Preguntas frecuentes con <details>: sin JavaScript, accesible con teclado y las
 * respuestas quedan en el HTML (Google y las IA las leen aunque estén cerradas). Cada
 * pregunta va en su tarjeta, la primera abierta y la abierta marcada con una franja
 * terracota, para que se vea que hay respuestas y cuál se está leyendo.
 */
export function Acordeon({ preguntas }: { preguntas: PreguntaFrecuente[] }) {
  return (
    <div className="grid gap-3">
      {preguntas.map((p, i) => (
        <details
          key={p.pregunta}
          open={i === 0}
          className="group relative overflow-hidden rounded-sm border border-linea bg-superficie shadow-[0_1px_24px_rgba(43,39,36,0.05)] transition-colors duration-200 before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-terracota before:opacity-0 before:transition-opacity hover:border-terracota/40 open:border-terracota/40 open:before:opacity-100"
        >
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 pr-4 pl-5 text-left text-base leading-snug font-medium text-carbon sm:pr-5 sm:pl-6 sm:text-[1.0625rem] [&::-webkit-details-marker]:hidden">
            <span className="min-w-0">{p.pregunta}</span>
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-linea text-terracota transition duration-300 group-open:rotate-45 group-open:border-terracota group-open:bg-terracota group-open:text-sobre-principal">
              <IconoMas className="size-4" />
            </span>
          </summary>
          <div className="lectura pr-5 pb-6 pl-5 text-topo sm:pr-16 sm:pl-6">
            <p>{p.respuesta}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
