import type { TipoEvento } from "@/lib/contenido/esquemas";

const NOMBRE: Record<TipoEvento, string> = { boda: "Boda", quince: "15 años", otro: "Evento" };

/** Etiqueta del tipo de evento (sobre las fotos de las tarjetas o junto al título). */
export function Etiqueta({ tipo, sobreFoto = false }: { tipo: TipoEvento; sobreFoto?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-sm px-2.5 py-1 text-xs font-medium tracking-[0.12em] uppercase ${
        sobreFoto ? "bg-marfil/90 text-carbon backdrop-blur-sm" : "bg-rubor text-terracota-profundo"
      }`}
    >
      {NOMBRE[tipo]}
    </span>
  );
}
