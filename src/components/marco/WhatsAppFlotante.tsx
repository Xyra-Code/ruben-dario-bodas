"use client";

import { useEffect, useState } from "react";

import { BotonWhatsApp } from "@/components/ui/BotonWhatsApp";

/**
 * Botón de WhatsApp siempre visible, abajo a la derecha (respeta la zona segura del
 * iPhone). Se oculta mientras el formulario (#contacto) está en pantalla para no tapar
 * su botón de enviar en celular. Forma y animaciones: BotonWhatsApp.
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
    <div
      aria-hidden={oculto || undefined}
      className={`fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 transition-[opacity,transform] duration-300 lg:right-7 lg:bottom-7 ${
        oculto ? "pointer-events-none translate-y-4 opacity-0" : "opacity-100"
      }`}
    >
      <BotonWhatsApp href={enlace} oculto={oculto} />
    </div>
  );
}
