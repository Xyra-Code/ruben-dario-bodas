"use client";

import { useEffect, useState } from "react";

import { IconoWhatsApp } from "@/components/ui/Iconos";

/**
 * Botón de WhatsApp siempre visible, abajo a la derecha (respeta la zona segura del
 * iPhone). Se oculta mientras el formulario (#contacto) está en pantalla para no tapar
 * su botón de enviar en celular.
 */
export function WhatsAppFlotante({ enlace }: { enlace: string }) {
  const [oculto, setOculto] = useState(false);

  useEffect(() => {
    const formulario = document.getElementById("contacto");
    if (!formulario) return;
    const observador = new IntersectionObserver(([entrada]) => setOculto(entrada.isIntersecting), {
      threshold: 0.15,
    });
    observador.observe(formulario);
    return () => observador.disconnect();
  }, []);

  return (
    <a
      href={enlace}
      target="_blank"
      rel="noopener"
      aria-label="Escríbanos por WhatsApp"
      data-evento="whatsapp"
      data-origen="flotante"
      aria-hidden={oculto || undefined}
      tabIndex={oculto ? -1 : undefined}
      className={`fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 inline-flex size-14 items-center justify-center rounded-full bg-terracota text-white shadow-[0_6px_20px_rgba(43,39,36,0.25)] transition-[opacity,transform,background-color] duration-300 hover:bg-terracota-profundo lg:size-16 ${
        oculto ? "pointer-events-none translate-y-4 opacity-0" : "opacity-100"
      }`}
    >
      <IconoWhatsApp className="size-7" />
    </a>
  );
}
