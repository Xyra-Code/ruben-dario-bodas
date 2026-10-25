"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties, type TouchEvent } from "react";

import { BotonCotizar } from "@/components/marco/BotonCotizar";
import { clasesBoton } from "@/components/ui/Boton";
import { IconoFacebook, IconoFlecha, IconoInstagram, IconoWhatsApp } from "@/components/ui/Iconos";
import { NAVEGACION } from "@/lib/rutas";

type Props = {
  enlaceWhatsApp: string;
  redes: { instagram?: string; facebook?: string };
  cobertura: string;
};

type Salida = "circulo" | "deslizar";

/** Retraso escalonado de la entrada de cada pieza (globals.css › .menu-pieza). */
const orden = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * Menú de celular y tablet. El botón ("Menú" + dos líneas desiguales) abre un panel a
 * pantalla completa que se despliega en círculo desde el propio botón, con los enlaces
 * grandes y numerados como el índice de una revista de novias, el monograma de fondo y,
 * abajo, Cotizar, WhatsApp, redes y cobertura. Es un <dialog> modal: atrapa el foco y
 * devuelve el foco al botón. Animaciones en globals.css (sin ellas con movimiento
 * reducido). Desde lg no existe: manda la barra de enlaces del encabezado.
 *
 * Se cierra como espera cada quien, en iPhone y en Android:
 * - La X, Escape, o tocar un enlace (navega y cierra).
 * - "Atrás": abrir agrega un paso al historial, así el gesto de atrás del iPhone (deslizar
 *   desde el borde) y el botón o gesto de Android cierran el menú en vez de salir de la
 *   página. Los enlaces del menú navegan con `replace` para no dejar ese paso de sobra.
 * - Deslizar el panel hacia la derecha: sigue al dedo y, pasado un cuarto de pantalla (o
 *   con un gesto rápido), sale por ese lado; si no, vuelve a su sitio.
 * - Tocar un espacio vacío del panel (lo marcado con data-vacio).
 */
export function MenuMovil({ enlaceWhatsApp, redes, cobertura }: Props) {
  const ruta = usePathname();
  const dialogo = useRef<HTMLDialogElement>(null);
  const boton = useRef<HTMLButtonElement>(null);
  const temporizador = useRef<number>(undefined);
  /** El cierre viene de un enlace: la navegación ya reemplaza el paso del historial. */
  const navegando = useRef(false);
  const arrastre = useRef<{ x: number; y: number; t: number; eje?: "x" | "y"; dx: number }>(null);
  const [abierto, setAbierto] = useState(false);
  const [cerrando, setCerrando] = useState(false);

  useEffect(() => {
    // Si el celular gira y la pantalla pasa a escritorio, el menú ya no tiene sentido.
    const escritorio = matchMedia("(min-width: 64rem)");
    const alCambiar = () => escritorio.matches && dialogo.current?.close();
    // "Atrás" del navegador o del sistema con el menú abierto: solo lo cierra.
    const alVolver = () => dialogo.current?.open && ocultar("circulo");
    escritorio.addEventListener("change", alCambiar);
    window.addEventListener("popstate", alVolver);
    return () => {
      escritorio.removeEventListener("change", alCambiar);
      window.removeEventListener("popstate", alVolver);
      window.clearTimeout(temporizador.current);
    };
  }, []);

  function abrir() {
    const d = dialogo.current;
    const b = boton.current?.getBoundingClientRect();
    if (!d || !b) return;
    // El círculo nace en el centro del botón.
    d.style.setProperty("--menu-x", `${b.left + b.width / 2}px`);
    d.style.setProperty("--menu-y", `${b.top + b.height / 2}px`);
    d.showModal();
    setAbierto(true);
    navegando.current = false;
    document.documentElement.style.overflow = "hidden"; // sin scroll detrás del panel
    // Mismo URL; Next conserva su estado interno junto a esta marca.
    history.pushState({ menuMovil: true }, "");
  }

  /**
   * Cierra con animación: el círculo vuelve al botón, o el panel sale por la derecha si
   * se deslizó. Sin animación con movimiento reducido.
   */
  function ocultar(salida: Salida) {
    const d = dialogo.current;
    if (!d?.open || temporizador.current) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return d.close();
    if (salida === "deslizar") {
      d.style.transition = "translate 0.28s ease-in, opacity 0.28s ease-in";
      d.style.translate = "100% 0";
      d.style.opacity = "0";
    } else {
      setCerrando(true);
    }
    temporizador.current = window.setTimeout(() => d.close(), salida === "deslizar" ? 280 : 380);
  }

  const cerrar = () => ocultar("circulo");

  /** Para enlaces: navegan con `replace`, que ocupa el paso del historial del menú. */
  function cerrarNavegando() {
    navegando.current = true;
    ocultar("circulo");
  }

  function alCerrar() {
    const d = dialogo.current;
    window.clearTimeout(temporizador.current);
    temporizador.current = undefined;
    d?.style.removeProperty("transition");
    d?.style.removeProperty("translate");
    d?.style.removeProperty("opacity");
    d?.style.removeProperty("box-shadow");
    setAbierto(false);
    setCerrando(false);
    document.documentElement.style.overflow = "";
    // Cerrado con la X, Escape, deslizando o tocando afuera: se quita el paso del historial.
    if (!navegando.current && history.state?.menuMovil) history.back();
  }

  // Deslizar para cerrar.
  function alTocar(e: TouchEvent) {
    if (e.touches.length !== 1 || temporizador.current) return;
    arrastre.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now(), dx: 0 };
  }

  function alArrastrar(e: TouchEvent) {
    const a = arrastre.current;
    const d = dialogo.current;
    if (!a || !d) return;
    const dx = e.touches[0].clientX - a.x;
    const dy = e.touches[0].clientY - a.y;
    // El eje se decide en los primeros 10 px: vertical es el scroll de la lista.
    if (!a.eje) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 10) return;
      a.eje = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }
    if (a.eje !== "x") return;
    a.dx = Math.max(0, dx);
    d.style.transition = "none";
    d.style.translate = `${a.dx}px 0`;
    d.style.opacity = String(1 - (a.dx / d.clientWidth) * 0.15);
    d.style.boxShadow = "-12px 0 32px rgba(42, 30, 27, 0.18)";
  }

  function alSoltar() {
    const a = arrastre.current;
    const d = dialogo.current;
    arrastre.current = null;
    if (!a || a.eje !== "x" || !d) return;
    const rapido = a.dx / (Date.now() - a.t) > 0.5; // px/ms
    if (a.dx > d.clientWidth / 4 || (rapido && a.dx > 40)) return ocultar("deslizar");
    d.style.transition = "translate 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s";
    d.style.translate = "0 0";
    d.style.opacity = "1";
  }

  return (
    <>
      <button
        ref={boton}
        type="button"
        onClick={abrir}
        aria-expanded={abierto}
        aria-controls="menu-movil"
        aria-label="Abrir menú"
        className="group/menu inline-flex min-h-11 min-w-11 items-center justify-center gap-2.5 px-2 text-carbon transition-colors group-data-sobre-foto:text-white lg:hidden"
      >
        <span
          aria-hidden="true"
          className="hidden text-[0.6875rem] font-semibold tracking-[0.22em] uppercase min-[380px]:inline"
        >
          Menú
        </span>
        <span aria-hidden="true" className="relative block h-2.5 w-6">
          <span className="absolute top-0 right-0 h-px w-6 bg-current" />
          <span className="absolute right-0 bottom-0 h-px w-4 bg-current transition-[width] duration-300 group-hover/menu:w-6" />
        </span>
      </button>

      <dialog
        id="menu-movil"
        ref={dialogo}
        aria-label="Menú"
        data-cerrando={cerrando || undefined}
        onClose={alCerrar}
        onCancel={(e) => {
          e.preventDefault();
          cerrar();
        }}
        onClick={(e) => {
          if (e.target instanceof HTMLElement && e.target.hasAttribute("data-vacio")) cerrar();
        }}
        onTouchStart={alTocar}
        onTouchMove={alArrastrar}
        onTouchEnd={alSoltar}
        onTouchCancel={alSoltar}
        data-vacio
        className="menu-movil m-0 h-dvh max-h-none w-full max-w-none touch-pan-y overflow-hidden overscroll-contain bg-marfil grano p-0 text-carbon backdrop:bg-transparent"
      >
        {/* Monograma de marca de agua: decorativo. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- SVG del logo: no necesita optimizador */}
        <img
          src="/marca/monograma.svg"
          alt=""
          width={400}
          height={400}
          className="menu-monograma pointer-events-none absolute -right-20 bottom-28 w-80 max-w-none opacity-[0.07] select-none sm:-right-10 sm:w-[26rem]"
        />

        <div
          data-vacio
          className="relative contenedor flex h-full flex-col pt-[env(safe-area-inset-top)] pb-[max(1.25rem,env(safe-area-inset-bottom))]"
        >
          {/* Misma fila que el encabezado: el panel se lee como su continuación. */}
          <div data-vacio className="flex h-16 shrink-0 items-center justify-between gap-3">
            <Link
              href="/"
              replace
              onClick={cerrarNavegando}
              aria-label="Inicio"
              className="flex min-h-11 min-w-0 shrink items-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- SVG del logo */}
              <img
                src="/marca/logo-firma.svg"
                alt=""
                width={908}
                height={126}
                className="block h-auto w-[clamp(10.5rem,48vw,13rem)] max-w-full sm:h-8 sm:w-auto"
              />
            </Link>
            <button
              type="button"
              onClick={cerrar}
              autoFocus
              aria-label="Cerrar menú"
              className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2.5 px-2"
            >
              <span
                aria-hidden="true"
                className="hidden text-[0.6875rem] font-semibold tracking-[0.22em] uppercase min-[380px]:inline"
              >
                Cerrar
              </span>
              <span aria-hidden="true" className="relative block size-6">
                <span className="menu-x-a absolute top-1/2 right-0 h-px w-6 rotate-45 bg-current" />
                <span className="menu-x-b absolute top-1/2 right-0 h-px w-6 -rotate-45 bg-current" />
              </span>
            </button>
          </div>

          <nav
            data-vacio
            aria-label="Principal"
            className="mt-2 min-h-0 flex-1 overflow-y-auto sm:mt-6"
          >
            <ol>
              {NAVEGACION.map((item, i) => {
                const actual = ruta === item.ruta || ruta.startsWith(`${item.ruta}/`);
                return (
                  <li key={item.ruta} className="menu-pieza border-b border-linea" style={orden(i)}>
                    <Link
                      href={item.ruta}
                      replace
                      onClick={cerrarNavegando}
                      aria-current={actual ? "page" : undefined}
                      className="group/enlace flex min-h-11 items-center gap-4 py-2.5 sm:py-4"
                    >
                      <span className="w-6 shrink-0 self-start pt-2 text-xs font-semibold tracking-widest text-dorado-texto tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block font-titulo text-[clamp(1.875rem,1.3rem+2.8vw,3rem)] leading-tight transition-colors group-hover/enlace:text-terracota ${
                            actual ? "text-terracota" : "text-carbon"
                          }`}
                        >
                          {item.nombre}
                        </span>
                        {/* En pantallas bajas (celulares pequeños) solo los nombres: caben los cinco sin scroll. */}
                        <span className="block text-sm text-topo [@media(max-height:44rem)]:hidden">
                          {item.descripcion}
                        </span>
                      </span>
                      <IconoFlecha
                        className={`size-5 shrink-0 text-terracota transition-[opacity,translate] duration-300 group-hover/enlace:translate-x-0 group-hover/enlace:opacity-100 ${
                          actual ? "opacity-100" : "-translate-x-2 opacity-0"
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className="menu-pieza shrink-0 pt-5" style={orden(NAVEGACION.length)}>
            <div className="menu-filete mb-5 filete-dorado" />
            <div className="grid grid-cols-2 gap-3">
              <BotonCotizar compacto replace className="w-full" alNavegar={cerrarNavegando} />
              <a
                href={enlaceWhatsApp}
                target="_blank"
                rel="noopener"
                className={clasesBoton("secundario", true, true)}
                data-evento="whatsapp"
                data-origen="menu-movil"
              >
                <IconoWhatsApp />
                WhatsApp
              </a>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="min-w-0 text-xs leading-snug text-topo">{cobertura}</p>
              <div className="-mr-3 flex shrink-0">
                {redes.instagram && (
                  <a
                    href={redes.instagram}
                    target="_blank"
                    rel="noopener"
                    aria-label="Instagram"
                    className="inline-flex size-11 items-center justify-center text-carbon transition-colors hover:text-terracota"
                  >
                    <IconoInstagram />
                  </a>
                )}
                {redes.facebook && (
                  <a
                    href={redes.facebook}
                    target="_blank"
                    rel="noopener"
                    aria-label="Facebook"
                    className="inline-flex size-11 items-center justify-center text-carbon transition-colors hover:text-terracota"
                  >
                    <IconoFacebook />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
