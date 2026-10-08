"use client";

import { useEffect, useRef, useState } from "react";

import { BotonCotizar } from "@/components/marco/BotonCotizar";
import { EnlacesNavegacion } from "@/components/marco/EnlacesNavegacion";
import { IconoCerrar, IconoMenu, IconoWhatsApp } from "@/components/ui/Iconos";
import { clasesBoton } from "@/components/ui/Boton";

/**
 * Menú de celular y tablet: botón hamburguesa + panel a pantalla completa (<dialog>
 * modal: atrapa el foco, cierra con Escape y devuelve el foco al botón).
 */
export function MenuMovil({ enlaceWhatsApp }: { enlaceWhatsApp: string }) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    if (abierto && !d.open) d.showModal();
    if (!abierto && d.open) d.close();
    // Sin scroll de la página detrás del panel.
    document.documentElement.style.overflow = abierto ? "hidden" : "";
  }, [abierto]);

  const cerrar = () => setAbierto(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        aria-expanded={abierto}
        aria-controls="menu-movil"
        aria-label="Abrir menú"
        className="inline-flex size-11 items-center justify-center text-carbon"
      >
        <IconoMenu />
      </button>

      <dialog
        id="menu-movil"
        ref={dialogo}
        onClose={cerrar}
        aria-label="Menú"
        className="m-0 h-dvh max-h-none w-full max-w-none bg-marfil p-0 text-carbon backdrop:bg-carbon/40"
      >
        <div className="contenedor flex h-full flex-col pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <div className="flex h-14 items-center justify-end">
            <button
              type="button"
              onClick={cerrar}
              aria-label="Cerrar menú"
              className="inline-flex size-11 items-center justify-center"
            >
              <IconoCerrar />
            </button>
          </div>

          <nav aria-label="Principal" className="mt-6 min-h-0 flex-1 overflow-y-auto">
            <EnlacesNavegacion disposicion="menu" alNavegar={cerrar} />
          </nav>

          <div className="mt-6 grid gap-3">
            <div className="mb-3 filete-dorado" />
            <BotonCotizar className="w-full" alNavegar={cerrar} />
            <a
              href={enlaceWhatsApp}
              target="_blank"
              rel="noopener"
              className={clasesBoton("secundario", true)}
              data-evento="whatsapp"
              data-origen="menu-movil"
            >
              <IconoWhatsApp />
              Escríbanos por WhatsApp
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
