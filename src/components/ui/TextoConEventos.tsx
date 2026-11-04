import Link from "next/link";

import { MENCION_EVENTO } from "@/lib/contenido/esquemas";
import { rutaEvento } from "@/lib/rutas";

/**
 * Texto de contenido con menciones a eventos: "[Luisa & Héctor](slug-del-evento)" se ve
 * como "Luisa & Héctor" y lleva a la página de ese evento. La validación de contenido
 * revisa que cada slug exista.
 */
export function TextoConEventos({ texto }: { texto: string }) {
  // split con grupos: [texto, nombre, slug, texto, nombre, slug, …, texto]
  const partes = texto.split(MENCION_EVENTO);
  return partes.map((parte, i) => {
    if (i % 3 === 0) return parte;
    if (i % 3 === 2) return null;
    return (
      <Link
        key={i}
        href={rutaEvento(partes[i + 1]!)}
        className="underline decoration-current/30 underline-offset-4 transition-colors hover:text-terracota hover:decoration-terracota"
      >
        {parte}
      </Link>
    );
  });
}
