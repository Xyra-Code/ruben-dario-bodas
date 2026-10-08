"use client";

import { useState } from "react";

import { clasesBoton } from "@/components/ui/Boton";
import { IconoWhatsApp } from "@/components/ui/Iconos";

type Props = { titulo: string; url: string };

/**
 * Compartir un evento. En celulares abre el menú nativo (Web Share: WhatsApp, Instagram…);
 * donde no existe, muestra WhatsApp y "Copiar enlace".
 */
export function Compartir({ titulo, url }: Props) {
  const [opciones, setOpciones] = useState(false);
  const [copiado, setCopiado] = useState(false);

  async function compartir() {
    if (navigator.share) {
      try {
        await navigator.share({ title: titulo, text: titulo, url });
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return; // la persona canceló
      }
    }
    setOpciones((v) => !v);
  }

  async function copiar() {
    await navigator.clipboard.writeText(url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  }

  return (
    <div className="min-w-0">
      <button
        type="button"
        onClick={compartir}
        aria-expanded={opciones}
        className={clasesBoton("secundario")}
        data-evento="compartir"
      >
        Compartir
      </button>
      {opciones && (
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${titulo} ${url}`)}`}
            target="_blank"
            rel="noopener"
            className={clasesBoton("texto")}
            data-evento="compartir"
            data-origen="whatsapp"
          >
            <IconoWhatsApp className="size-4" /> WhatsApp
          </a>
          <button type="button" onClick={copiar} className={clasesBoton("texto")}>
            {copiado ? "Enlace copiado" : "Copiar enlace"}
          </button>
          <span aria-live="polite" className="sr-only">
            {copiado ? "Enlace copiado" : ""}
          </span>
        </div>
      )}
    </div>
  );
}
