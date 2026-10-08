import Link from "next/link";
import type { ReactNode } from "react";

import { IconoWhatsApp } from "@/components/ui/Iconos";

export type Variante = "principal" | "secundario" | "claro" | "texto";

/**
 * Clases de botón, reutilizables en <a>, <Link> y <button>. Esquinas apenas suavizadas
 * (brief: evitar estilo "app" muy redondeado). Alto: 48px normal, 44px compacto o texto;
 * nunca menos que el área táctil mínima. El tamaño es una opción, no clases sueltas que
 * compitan con las de la variante.
 */
export function clasesBoton(variante: Variante = "principal", ancho = false, compacto = false) {
  const comun =
    "inline-flex items-center justify-center gap-2.5 rounded-sm text-[0.9375rem] font-medium tracking-wide transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60";
  const variantes: Record<Variante, string> = {
    principal: "bg-terracota text-white hover:bg-terracota-profundo",
    secundario: "border border-terracota text-terracota hover:bg-terracota hover:text-white",
    claro: "border border-white/80 text-white hover:bg-white hover:text-carbon",
    texto:
      "min-h-11 text-terracota underline decoration-terracota/40 underline-offset-[6px] hover:decoration-terracota",
  };
  const tamano = variante === "texto" ? "" : compacto ? "min-h-11 px-4 sm:px-6" : "min-h-12 px-6";
  return `${comun} ${tamano} ${variantes[variante]} ${ancho ? "w-full" : ""}`;
}

type Props = {
  href: string;
  children: ReactNode;
  variante?: Variante;
  /** Muestra el ícono de WhatsApp y abre en una pestaña nueva. */
  whatsapp?: boolean;
  /** Ocupa todo el ancho disponible (útil en móvil). */
  ancho?: boolean;
  className?: string;
  /** Identifica el botón en la analítica (Zaraz): "flotante", "servicio-bodas"… */
  origen?: string;
};

export function Boton({
  href,
  children,
  variante = "principal",
  whatsapp = false,
  ancho = false,
  className = "",
  origen,
}: Props) {
  const clases = `${clasesBoton(variante, ancho)} ${className}`;
  const contenido = (
    <>
      {whatsapp && <IconoWhatsApp />}
      <span className="min-w-0">{children}</span>
    </>
  );

  if (whatsapp || /^https?:/.test(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener"
        className={clases}
        data-evento={whatsapp ? "whatsapp" : undefined}
        data-origen={origen}
      >
        {contenido}
      </a>
    );
  }
  return (
    <Link href={href} className={clases} data-origen={origen}>
      {contenido}
    </Link>
  );
}
