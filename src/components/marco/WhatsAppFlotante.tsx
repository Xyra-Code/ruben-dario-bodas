"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { CompartirFlotante } from "@/components/marco/CompartirFlotante";
import { BotonWhatsApp } from "@/components/ui/BotonWhatsApp";
import { enlaceWhatsApp, flotanteSegunRuta, type EventoMensaje } from "@/lib/whatsapp";

/** La burbuja de celular sale una sola vez por visita (sessionStorage, si existe). */
const CLAVE_BURBUJA = "rd-burbuja-whatsapp";

/**
 * Botón de WhatsApp siempre visible, abajo a la derecha (respeta la zona segura del
 * iPhone). Se oculta mientras el formulario (#contacto) está en pantalla para no tapar
 * su botón de enviar en celular. Forma y animaciones: BotonWhatsApp. En la página de un
 * evento, en celular y tablet, lleva encima el botón de compartir (CompartirFlotante).
 * - El mensaje y la etiqueta dependen de la página (flotanteSegunRuta).
 * - En celular, donde no hay hover para ver la etiqueta, una burbuja la muestra una sola
 *   vez por visita al pasar la mitad de la página, y se recoge sola.
 */
export function WhatsAppFlotante({
  numero,
  eventos,
}: {
  numero: string;
  eventos: EventoMensaje[];
}) {
  const ruta = usePathname();
  // Página donde el formulario está en pantalla: así, al cambiar de página, el botón
  // vuelve a verse sin reiniciar el estado (el layout no se vuelve a montar).
  const [formularioVisibleEn, setFormularioVisibleEn] = useState<string | null>(null);
  const oculto = formularioVisibleEn === ruta;
  const [burbuja, setBurbuja] = useState(false);
  const { mensaje, etiqueta } = flotanteSegunRuta(ruta, eventos);
  const enlace = enlaceWhatsApp(numero, mensaje);

  // Se observa el formulario de cada página.
  useEffect(() => {
    const formulario = document.getElementById("contacto");
    if (!formulario) return;
    const observador = new IntersectionObserver(
      ([entrada]) => setFormularioVisibleEn(entrada.isIntersecting ? ruta : null),
      { threshold: 0.15 },
    );
    observador.observe(formulario);
    return () => observador.disconnect();
  }, [ruta]);

  useEffect(() => {
    let vista = false;
    try {
      vista = sessionStorage.getItem(CLAVE_BURBUJA) === "1";
    } catch {}
    if (vista || window.matchMedia("(min-width: 64rem)").matches) return;
    let temporizador: ReturnType<typeof setTimeout> | undefined;
    const alDesplazar = () => {
      const recorrido = window.scrollY / (document.documentElement.scrollHeight - innerHeight);
      if (recorrido < 0.5) return;
      window.removeEventListener("scroll", alDesplazar);
      try {
        sessionStorage.setItem(CLAVE_BURBUJA, "1");
      } catch {}
      setBurbuja(true);
      temporizador = setTimeout(() => setBurbuja(false), 4500);
    };
    window.addEventListener("scroll", alDesplazar, { passive: true });
    return () => {
      window.removeEventListener("scroll", alDesplazar);
      clearTimeout(temporizador);
    };
  }, []);

  return (
    <div
      aria-hidden={oculto || undefined}
      className={`fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 flex flex-col items-center gap-1 transition-[opacity,transform] duration-300 lg:right-7 lg:bottom-7 ${
        oculto ? "pointer-events-none translate-y-4 opacity-0" : "opacity-100"
      }`}
    >
      <CompartirFlotante oculto={oculto} />
      <BotonWhatsApp variante="burbuja" href={enlace} etiqueta={etiqueta} oculto={oculto} />

      {/* Burbuja de celular: a la izquierda del botón, decorativa (el botón ya lo dice). */}
      <a
        href={enlace}
        target="_blank"
        rel="noopener"
        aria-hidden="true"
        tabIndex={-1}
        data-evento="whatsapp"
        data-origen="burbuja"
        className={`absolute right-full bottom-2 mr-3 rounded-sm border border-linea bg-superficie px-4 py-2 text-sm font-medium whitespace-nowrap text-carbon shadow-[0_12px_30px_-12px_rgba(42,30,27,0.35)] transition-[opacity,transform] duration-300 lg:hidden ${
          burbuja && !oculto
            ? "translate-x-0 opacity-100"
            : "pointer-events-none translate-x-2 opacity-0"
        }`}
      >
        {etiqueta}
      </a>
    </div>
  );
}
