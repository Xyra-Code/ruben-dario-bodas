import type { TipoEvento } from "@/lib/contenido/esquemas";

const NOMBRE: Record<TipoEvento, string> = { boda: "Boda", quince: "15 años", otro: "Evento" };

/**
 * Etiqueta del tipo de evento (sobre las fotos de las tarjetas o junto al título).
 * `especial` la reemplaza por un texto propio en dorado ("Donde empezó todo · 2019"),
 * solo para la boda que marcó la carrera de Rubén Darío.
 */
export function Etiqueta({
  tipo,
  sobreFoto = false,
  especial,
  texto,
}: {
  tipo: TipoEvento;
  sobreFoto?: boolean;
  especial?: string;
  /** Reemplaza el nombre del tipo con el estilo normal (no el dorado de `especial`). */
  texto?: string;
}) {
  const estilo = especial
    ? "bg-dorado-texto text-white"
    : sobreFoto
      ? "bg-marfil/90 text-carbon backdrop-blur-sm"
      : "bg-rubor text-terracota-profundo";
  return (
    <span
      className={`inline-flex items-center rounded-sm px-2.5 py-1 text-xs font-medium tracking-[0.12em] uppercase ${estilo}`}
    >
      {especial ?? texto ?? NOMBRE[tipo]}
    </span>
  );
}
