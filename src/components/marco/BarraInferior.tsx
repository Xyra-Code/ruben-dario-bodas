"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ComponentType } from "react";

import {
  IconoAnillos,
  IconoGaleria,
  IconoInicio,
  IconoTiara,
  IconoWhatsApp,
} from "@/components/ui/Iconos";

type Pestana = { nombre: string; ruta: string; Icono: ComponentType<{ className?: string }> };

const IZQUIERDA: Pestana[] = [
  { nombre: "Inicio", ruta: "/", Icono: IconoInicio },
  { nombre: "Bodas", ruta: "/bodas", Icono: IconoAnillos },
];
const DERECHA: Pestana[] = [
  { nombre: "15 años", ruta: "/quince-anos", Icono: IconoTiara },
  { nombre: "Eventos", ruta: "/eventos", Icono: IconoGaleria },
];

/**
 * PRUEBA (2026-10-16): navegación de celular y tablet como barra de pestañas de app, en
 * lugar del menú hamburguesa y del botón flotante de WhatsApp (que pasa al centro).
 * - Se oculta al bajar y vuelve al subir, para dejar ver las fotos completas.
 * - Se oculta mientras se escribe en un campo: el teclado del celular la empujaría.
 * - Respeta la zona segura inferior del iPhone. Desde lg no existe (menú de arriba).
 */
export function BarraInferior({ enlaceWhatsApp }: { enlaceWhatsApp: string }) {
  const ruta = usePathname();
  const [oculta, setOculta] = useState(false);
  const [escribiendo, setEscribiendo] = useState(false);

  useEffect(() => {
    let anterior = window.scrollY;
    const alDesplazar = () => {
      const y = window.scrollY;
      if (Math.abs(y - anterior) < 8) return;
      setOculta(y > anterior && y > 80);
      anterior = y;
    };
    const esCampo = (e: Event) =>
      e.target instanceof HTMLElement && e.target.matches("input, textarea, select");
    const alEnfocar = (e: FocusEvent) => esCampo(e) && setEscribiendo(true);
    const alDesenfocar = (e: FocusEvent) => esCampo(e) && setEscribiendo(false);
    window.addEventListener("scroll", alDesplazar, { passive: true });
    document.addEventListener("focusin", alEnfocar);
    document.addEventListener("focusout", alDesenfocar);
    return () => {
      window.removeEventListener("scroll", alDesplazar);
      document.removeEventListener("focusin", alEnfocar);
      document.removeEventListener("focusout", alDesenfocar);
    };
  }, []);

  const activa = (r: string) => (r === "/" ? ruta === "/" : ruta.startsWith(r));
  const escondida = oculta || escribiendo;

  const pestana = ({ nombre, ruta: r, Icono }: Pestana) => (
    <li key={r} className="min-w-0 flex-1">
      <Link
        href={r}
        aria-current={activa(r) ? "page" : undefined}
        className={`flex min-h-14 flex-col items-center justify-center gap-1 text-[0.6875rem] font-medium transition-colors ${
          activa(r) ? "text-terracota" : "text-topo hover:text-carbon"
        }`}
      >
        <Icono className="size-6" />
        <span className="truncate">{nombre}</span>
      </Link>
    </li>
  );

  return (
    <nav
      aria-label="Principal"
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-linea bg-marfil/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-1px_12px_rgba(43,39,36,0.06)] backdrop-blur-sm transition-transform duration-300 lg:hidden ${
        escondida ? "translate-y-full" : "translate-y-0"
      }`}
    >
      <ul className="mx-auto flex max-w-xl items-stretch px-[max(0.5rem,env(safe-area-inset-left))]">
        {IZQUIERDA.map(pestana)}
        <li className="min-w-0 flex-1">
          <a
            href={enlaceWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={escondida ? -1 : undefined}
            data-evento="whatsapp"
            data-origen="barra-inferior"
            className="flex min-h-14 flex-col items-center justify-center gap-1 text-[0.6875rem] font-semibold text-terracota"
          >
            <IconoWhatsApp className="size-7" />
            <span>Escríbenos</span>
          </a>
        </li>
        {DERECHA.map(pestana)}
      </ul>
    </nav>
  );
}
