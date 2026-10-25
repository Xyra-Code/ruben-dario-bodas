"use client";

import { usePathname } from "next/navigation";

import { IconoCompartir } from "@/components/ui/Iconos";

/**
 * Compartir en la página de un evento, en celular y tablet: flota justo encima del botón
 * de WhatsApp (va dentro de WhatsAppFlotante, así se oculta con él). Sin fondo, con un
 * halo claro para leerse sobre las fotos. En escritorio el botón "Compartir" ya se ve
 * junto a la galería. Abre el menú nativo del celular (WhatsApp, Instagram, copiar
 * enlace); donde no existe, abre WhatsApp con el enlace. Comparte la URL canónica y el
 * título del evento (H1). `oculto`: el formulario está en pantalla y el grupo flotante se
 * esconde, así que el botón sale del recorrido del teclado.
 */
export function CompartirFlotante({ oculto = false }: { oculto?: boolean }) {
  const ruta = usePathname();
  if (!/^\/eventos\/[^/]+\/?$/.test(ruta)) return null;

  async function compartir() {
    const titulo = document.querySelector("h1")?.textContent?.trim() || document.title;
    const url =
      document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href || location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: titulo, text: titulo, url });
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return; // la persona canceló
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${titulo} ${url}`)}`, "_blank");
  }

  return (
    <button
      type="button"
      onClick={compartir}
      aria-label="Compartir este evento"
      title="Compartir"
      tabIndex={oculto ? -1 : undefined}
      className="flex size-11 items-center justify-center text-carbon [filter:drop-shadow(0_0_1.5px_#fdfaf7)_drop-shadow(0_0_5px_#fdfaf7)] transition-colors hover:text-terracota lg:hidden"
      data-evento="compartir"
      data-origen="flotante"
    >
      <IconoCompartir className="size-7" />
    </button>
  );
}
