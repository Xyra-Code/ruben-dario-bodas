import { IconoWhatsApp } from "@/components/ui/Iconos";

/**
 * Formas y colores del botón flotante de WhatsApp. "circulo" es la que usa el sitio; las
 * demás son propuestas para elegir (se ven en /guia-de-estilos).
 */
export type VarianteWhatsApp = "circulo" | "glifo" | "verde" | "claro" | "degradado" | "pildora";

export const VARIANTES_WHATSAPP: { id: VarianteWhatsApp; nombre: string; nota: string }[] = [
  { id: "circulo", nombre: "Círculo terracota", nota: "Actual: color de la marca, ícono blanco" },
  { id: "glifo", nombre: "Ícono solo", nota: "Sin círculo, como en xyracode.com; más liviano" },
  {
    id: "verde",
    nombre: "Verde WhatsApp",
    nota: "Verde oscuro accesible: se reconoce al instante",
  },
  {
    id: "claro",
    nombre: "Claro con filete dorado",
    nota: "Fondo claro, borde oro e ícono terracota",
  },
  {
    id: "degradado",
    nombre: "Degradado del logo",
    nota: "Melocotón a terracota, con anillo dorado",
  },
  { id: "pildora", nombre: "Píldora con texto", nota: "Ícono + “Cotizar”: más clics, ocupa más" },
];

type Props = {
  variante?: VarianteWhatsApp;
  href: string;
  /** Etiqueta que se despliega al pasar el mouse (escritorio). */
  etiqueta?: string;
  origen?: string;
  /** Para el flotante: no se puede enfocar mientras está oculto. */
  oculto?: boolean;
};

const HALO: Record<VarianteWhatsApp, string> = {
  circulo: "var(--c-primary)",
  glifo: "var(--c-primary)",
  verde: "#1C6B47",
  claro: "var(--c-gold)",
  degradado: "var(--c-accent)",
  pildora: "var(--c-primary)",
};

const NUCLEO: Record<VarianteWhatsApp, string> = {
  circulo:
    "size-14 rounded-full bg-terracota text-sobre-principal shadow-[0_6px_20px_rgba(42,30,27,0.25)] lg:size-16",
  glifo: "size-14 text-terracota lg:size-16",
  verde:
    "size-14 rounded-full bg-[#1C6B47] text-white shadow-[0_6px_20px_rgba(28,107,71,0.35)] lg:size-16",
  claro:
    "size-14 rounded-full border border-dorado bg-superficie text-terracota shadow-[0_6px_20px_rgba(42,30,27,0.18)] lg:size-16",
  degradado:
    "size-14 rounded-full bg-(image:--degradado-terracota) text-white shadow-[0_6px_20px_rgba(42,30,27,0.25)] ring-1 ring-dorado ring-offset-2 ring-offset-marfil lg:size-16",
  pildora:
    "h-14 gap-2 rounded-full bg-terracota px-5 text-sobre-principal shadow-[0_6px_20px_rgba(42,30,27,0.25)]",
};

/**
 * Botón de WhatsApp con las animaciones de xyracode.com (globals.css): entrada, flotación,
 * halo y saludo del ícono; en hover se pausa y despliega la etiqueta. Sin movimiento si el
 * visitante pidió reducirlo.
 */
export function BotonWhatsApp({
  variante = "circulo",
  href,
  etiqueta = "Cuéntenos de su evento",
  origen = "flotante",
  oculto = false,
}: Props) {
  const glifo = variante === "glifo";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label={variante === "pildora" ? undefined : `Escríbanos por WhatsApp: ${etiqueta}`}
      tabIndex={oculto ? -1 : undefined}
      data-evento="whatsapp"
      data-origen={origen}
      className="wa-fab group flex items-center no-underline"
    >
      {/* Etiqueta: colapsada; se despliega en hover o foco (escritorio). */}
      {variante !== "pildora" && (
        <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-[max-width,opacity,margin] duration-300 ease-out group-hover:mr-3 group-hover:max-w-72 group-hover:opacity-100 group-focus-visible:mr-3 group-focus-visible:max-w-72 group-focus-visible:opacity-100">
          <span className="flex flex-col rounded-sm border border-linea bg-superficie px-4 py-2 shadow-[0_12px_30px_-12px_rgba(42,30,27,0.35)]">
            <span className="text-[0.625rem] font-semibold tracking-[0.18em] text-dorado-texto uppercase">
              WhatsApp
            </span>
            <span className="text-sm font-medium text-carbon">{etiqueta}</span>
          </span>
        </span>
      )}

      <span className="wa-nucleo relative inline-flex items-center justify-center transition-transform duration-200 ease-out">
        <span
          aria-hidden="true"
          className="wa-halo pointer-events-none absolute size-14 rounded-full lg:size-16"
          style={{
            background: `radial-gradient(circle, ${HALO[variante]} 0%, transparent 70%)`,
          }}
        />
        <span className={`relative inline-flex items-center justify-center ${NUCLEO[variante]}`}>
          <IconoWhatsApp
            className={`wa-glifo ${glifo ? "size-12 drop-shadow-[0_6px_14px_rgba(156,74,59,0.45)] lg:size-14" : "size-7"}`}
          />
          {variante === "pildora" && <span className="text-[0.9375rem] font-medium">Cotizar</span>}
        </span>
      </span>
    </a>
  );
}
