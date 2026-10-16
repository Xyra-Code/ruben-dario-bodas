"use client";

import { usePathname } from "next/navigation";

import { IconoCompartir } from "@/components/ui/Iconos";

/**
 * PRUEBA (2026-10-16): ícono de compartir en el encabezado, solo en la página de un evento
 * y solo en celular y tablet (en escritorio el botón "Compartir" ya se ve junto a la
 * galería). Abre el menú nativo del celular (WhatsApp, Instagram, copiar enlace); donde no
 * existe, abre WhatsApp con el enlace. Comparte la URL canónica y el título del evento (H1).
 */
export function CompartirEncabezado() {
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
      className="flex size-11 shrink-0 items-center justify-center rounded-full text-carbon transition-colors hover:text-terracota lg:hidden"
      data-evento="compartir"
      data-origen="encabezado"
    >
      <IconoCompartir className="size-6" />
    </button>
  );
}
