"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { clasesBoton } from "@/components/ui/Boton";
import { RUTA_SERVICIO } from "@/lib/rutas";

type Opcion = { valor: string; nombre: string };

type Props = {
  /** Pestañas de tipo (Bodas, 15 años…). Se muestran aunque un tipo aún no tenga eventos. */
  tipos: Opcion[];
  municipios: string[];
  estilos: string[];
  /** Tipo, municipio y estilo de cada tarjeta, en el mismo orden que children. */
  items: { tipo: string; municipio: string; estilo: string }[];
  /** Título de la página: en escritorio va a la izquierda y los filtros a su derecha. */
  encabezado?: ReactNode;
  /** Tarjetas ya renderizadas: cada una con data-tipo, data-municipio y data-estilo. */
  children: ReactNode;
};

/**
 * Filtros del portafolio. Funcionan en el navegador ocultando tarjetas que ya están en el
 * HTML: sin URLs nuevas (?tipo=…) que compitan con /bodas y /quince-anos en Google, y
 * sin JavaScript todo el portafolio sigue visible.
 *
 * Estética: pestañas de tipo subrayadas como el menú (con su cantidad) y selectores
 * de línea, sin la caja del navegador.
 */
export function FiltroEventos({ tipos, municipios, estilos, items, encabezado, children }: Props) {
  const [tipo, setTipo] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [estilo, setEstilo] = useState("");
  const grilla = useRef<HTMLDivElement>(null);

  const pasaLugarYEstilo = (it: Props["items"][number]) =>
    (!municipio || it.municipio === municipio) && (!estilo || it.estilo === estilo);
  const coincide = (it: Props["items"][number]) =>
    (!tipo || it.tipo === tipo) && pasaLugarYEstilo(it);
  const total = items.length;
  const visibles = items.filter(coincide).length;
  // Cantidad por pestaña según los otros dos filtros.
  const cantidad = (valor: string) =>
    items.filter((it) => (!valor || it.tipo === valor) && pasaLugarYEstilo(it)).length;

  // Solo efecto sobre el DOM (las tarjetas vienen renderizadas del servidor).
  useEffect(() => {
    grilla.current?.querySelectorAll<HTMLElement>("[data-tipo]").forEach((el) => {
      el.hidden = !(
        (!tipo || el.dataset.tipo === tipo) &&
        (!municipio || el.dataset.municipio === municipio) &&
        (!estilo || el.dataset.estilo === estilo)
      );
    });
  }, [tipo, municipio, estilo]);

  const limpiar = () => {
    setTipo("");
    setMunicipio("");
    setEstilo("");
  };
  const hayFiltros = Boolean(tipo || municipio || estilo);
  // Un tipo sin ningún evento publicado (p. ej. 15 años al inicio) no es "filtros sin
  // resultado": se invita a su página de servicio.
  const tipoSinEventos = tipo && !items.some((it) => it.tipo === tipo);
  const nombreTipo = tipos.find((t) => t.valor === tipo)?.nombre;

  const pestanas = [{ valor: "", nombre: "Todos" }, ...tipos];

  return (
    <div>
      {/* Título a la izquierda y filtros a la derecha (en celular, apilados): las fotos
          deben asomar en la primera pantalla. */}
      <div className="flex flex-col gap-5 border-b border-linea pb-5 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        {encabezado && <div className="max-w-3xl min-w-0">{encabezado}</div>}

        <div className="flex min-w-0 flex-col gap-4 lg:items-end">
          {/* Pestañas de tipo: si no caben, se deslizan dentro de su propio contenedor. */}
          <div
            role="group"
            aria-label="Tipo de evento"
            className="-mx-4 flex min-w-0 scrollbar-none gap-6 overflow-x-auto px-4 lg:mx-0 lg:px-0"
          >
            {pestanas.map((t) => {
              const activa = tipo === t.valor;
              return (
                <button
                  key={t.valor || "todos"}
                  type="button"
                  aria-pressed={activa}
                  onClick={() => setTipo(t.valor)}
                  className={`relative inline-flex min-h-11 shrink-0 items-center gap-1.5 text-[0.9375rem] transition-colors after:absolute after:inset-x-0 after:bottom-1.5 after:h-px after:origin-left after:bg-terracota after:transition-transform after:duration-300 ${
                    activa
                      ? "text-terracota after:scale-x-100"
                      : "text-carbon after:scale-x-0 hover:text-terracota"
                  }`}
                >
                  {t.nombre}
                  <sup className="text-[0.6875rem] text-topo tabular-nums">{cantidad(t.valor)}</sup>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-4 lg:w-104">
            <Selector
              etiqueta="Municipio"
              todos="Todos"
              valor={municipio}
              opciones={municipios}
              alCambiar={setMunicipio}
            />
            <Selector
              etiqueta="Estilo"
              todos="Todos"
              valor={estilo}
              opciones={estilos}
              alCambiar={setEstilo}
            />
          </div>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {visibles === total ? `${total} eventos` : `${visibles} de ${total} eventos`}
      </p>

      <div ref={grilla} className="mt-6">
        {children}
      </div>

      {visibles === 0 && (
        <div className="py-16 text-center">
          {tipoSinEventos ? (
            <>
              <p className="font-titulo text-titulo-3">
                Pronto publicaremos{" "}
                {nombreTipo === "15 años" ? "fiestas de 15 años" : "más eventos"}
              </p>
              {RUTA_SERVICIO[tipo as keyof typeof RUTA_SERVICIO] && (
                <a
                  href={RUTA_SERVICIO[tipo as keyof typeof RUTA_SERVICIO]}
                  className={`${clasesBoton("secundario")} mt-6`}
                >
                  Conoce el servicio de {nombreTipo?.toLowerCase()}
                </a>
              )}
            </>
          ) : (
            <>
              <p className="font-titulo text-titulo-3">No hay eventos con esos filtros</p>
              <button
                type="button"
                onClick={limpiar}
                className={`${clasesBoton("secundario")} mt-6`}
              >
                Limpiar filtros
              </button>
            </>
          )}
        </div>
      )}
      {hayFiltros && visibles > 0 && (
        <button type="button" onClick={limpiar} className={`${clasesBoton("texto")} mt-8`}>
          Limpiar filtros
        </button>
      )}
    </div>
  );
}

/** Selector de línea: etiqueta pequeña arriba, valor y flecha propia, sin caja. */
function Selector({
  etiqueta,
  todos,
  valor,
  opciones,
  alCambiar,
}: {
  etiqueta: string;
  todos: string;
  valor: string;
  opciones: string[];
  alCambiar: (v: string) => void;
}) {
  return (
    <label className="group relative block min-w-0">
      <span className="block text-[0.6875rem] font-semibold tracking-[0.18em] text-dorado-texto uppercase">
        {etiqueta}
      </span>
      <select
        value={valor}
        onChange={(e) => alCambiar(e.target.value)}
        className={`mt-1 block min-h-11 w-full min-w-0 cursor-pointer appearance-none truncate border-b bg-transparent pr-7 text-[0.9375rem] transition-colors focus-visible:outline-none ${
          valor
            ? "border-terracota text-terracota"
            : "border-carbon/25 text-carbon group-hover:border-terracota focus-visible:border-terracota"
        }`}
      >
        <option value="">{todos}</option>
        {opciones.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="pointer-events-none absolute right-0 bottom-3.5 size-4 text-topo transition-transform group-focus-within:rotate-180"
      >
        <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </label>
  );
}
