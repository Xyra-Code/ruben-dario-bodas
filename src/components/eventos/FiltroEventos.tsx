"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { clasesBoton } from "@/components/ui/Boton";

type Opcion = { valor: string; nombre: string };

type Props = {
  tipos: Opcion[];
  municipios: string[];
  estilos: string[];
  /** Tipo, municipio y estilo de cada tarjeta, en el mismo orden que children. */
  items: { tipo: string; municipio: string; estilo: string }[];
  /** Tarjetas ya renderizadas: cada una con data-tipo, data-municipio y data-estilo. */
  children: ReactNode;
};

/**
 * Filtros del portafolio. Funcionan en el navegador ocultando tarjetas que ya están en el
 * HTML: sin URLs nuevas (?tipo=…) que compitan con /bodas y /quince-anos en Google, y
 * sin JavaScript todo el portafolio sigue visible.
 */
export function FiltroEventos({ tipos, municipios, estilos, items, children }: Props) {
  const [tipo, setTipo] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [estilo, setEstilo] = useState("");
  const grilla = useRef<HTMLDivElement>(null);

  const coincide = (it: Props["items"][number]) =>
    (!tipo || it.tipo === tipo) &&
    (!municipio || it.municipio === municipio) &&
    (!estilo || it.estilo === estilo);
  const total = items.length;
  const visibles = items.filter(coincide).length;

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

  const chip = (activo: boolean) =>
    `inline-flex min-h-11 shrink-0 items-center rounded-boton border px-5 text-[0.9375rem] transition-colors ${
      activo
        ? "border-terracota bg-terracota text-sobre-principal"
        : "border-borde bg-superficie text-carbon hover:border-terracota"
    }`;
  const select =
    "min-h-11 w-full min-w-0 rounded-sm border border-borde bg-superficie px-3 text-[0.9375rem] text-carbon";

  return (
    <div>
      <div className="flex flex-col gap-4 border-y border-linea py-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Fila de chips: si no cabe, se desliza dentro de su propio contenedor. */}
        <div
          role="group"
          aria-label="Tipo de evento"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:px-0"
        >
          <button
            type="button"
            aria-pressed={!tipo}
            onClick={() => setTipo("")}
            className={chip(!tipo)}
          >
            Todos
          </button>
          {tipos.map((t) => (
            <button
              key={t.valor}
              type="button"
              aria-pressed={tipo === t.valor}
              onClick={() => setTipo(t.valor)}
              className={chip(tipo === t.valor)}
            >
              {t.nombre}
            </button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:w-auto lg:min-w-[26rem]">
          <label className="min-w-0">
            <span className="sr-only">Municipio</span>
            <select
              value={municipio}
              onChange={(e) => setMunicipio(e.target.value)}
              className={select}
            >
              <option value="">Todos los municipios</option>
              {municipios.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label className="min-w-0">
            <span className="sr-only">Estilo</span>
            <select value={estilo} onChange={(e) => setEstilo(e.target.value)} className={select}>
              <option value="">Todos los estilos</option>
              {estilos.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <p aria-live="polite" className="mt-4 text-sm text-topo">
        {visibles === total ? `${total} eventos` : `${visibles} de ${total} eventos`}
      </p>

      <div ref={grilla} className="mt-8">
        {children}
      </div>

      {visibles === 0 && (
        <div className="py-16 text-center">
          <p className="font-titulo text-titulo-3">No hay eventos con esos filtros</p>
          <button type="button" onClick={limpiar} className={`${clasesBoton("secundario")} mt-6`}>
            Limpiar filtros
          </button>
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
