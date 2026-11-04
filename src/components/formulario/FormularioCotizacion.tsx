"use client";

import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";

import { clasesBoton } from "@/components/ui/Boton";
import { IconoAlerta, IconoWhatsApp } from "@/components/ui/Iconos";
import type { TipoEvento } from "@/lib/contenido/esquemas";
import { NOMBRE_TIPO_MENSAJE, enlaceWhatsApp, mensajeCotizacion } from "@/lib/whatsapp";

type Props = {
  /** Número de WhatsApp (sitio.json). */
  whatsapp: string;
  /** Tipo ya elegido según la página (/bodas → "boda"). */
  tipoInicial?: TipoEvento;
  /** Evento de referencia ("Quiero algo así"): se muestra y va en el mensaje. */
  referencia?: string;
  /** Página de origen para la analítica: "inicio", "bodas", "evento"… */
  origen: string;
  /** Rangos de presupuesto (sitio.json). */
  presupuestos: string[];
  /** Rangos de invitados (sitio.json). */
  invitados: string[];
};

/** Obligatorios, en el orden en que aparecen: primero el evento, el nombre al final. */
const CAMPOS = ["tipo", "invitados", "lugar", "presupuesto", "fecha", "nombre"] as const;
type Campo = (typeof CAMPOS)[number];
type Errores = Partial<Record<Campo, string>>;

const TIPOS: TipoEvento[] = ["boda", "quince", "otro"];

const hoyIso = () => {
  const h = new Date();
  return `${h.getFullYear()}-${String(h.getMonth() + 1).padStart(2, "0")}-${String(h.getDate()).padStart(2, "0")}`;
};

// 16 px en el celular: con menos, el iPhone acerca la pantalla al tocar el campo.
const campoClase =
  "block min-h-11 w-full min-w-0 rounded-sm border border-borde bg-superficie px-3 py-2 text-base text-carbon placeholder:text-topo/70 transition-colors focus:border-terracota focus:outline-2 focus:outline-offset-0 focus:outline-terracota aria-invalid:border-error sm:text-[0.9375rem]";

/** Lista de selección con flecha propia; mientras no se elige, el texto va atenuado. */
function Lista({
  id,
  nombre,
  valorInicial = "",
  invalido,
  describe,
  children,
}: {
  id: string;
  nombre: Campo;
  valorInicial?: string;
  invalido: boolean;
  describe?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative min-w-0">
      <select
        id={id}
        name={nombre}
        defaultValue={valorInicial}
        required
        aria-invalid={invalido || undefined}
        aria-describedby={describe}
        className={`${campoClase} cursor-pointer appearance-none truncate pr-6 invalid:text-topo/70 [&>option]:text-carbon`}
      >
        <option value="" disabled>
          Elige
        </option>
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute top-1/2 right-1.5 size-4 -translate-y-1/2 text-topo"
      >
        <path d="m4 6 4 4 4-4" />
      </svg>
    </div>
  );
}

/**
 * Formulario de cotización: arma el mensaje y abre WhatsApp (sitio estático, sin envío
 * automático). Valida al enviar, marca cada error junto a su campo y lleva el foco al
 * primero. Funciona con teclado y lector de pantalla. Tipo, invitados y presupuesto son listas
 * para ocupar menos espacio: en celular, tipo e invitados comparten fila, y también fecha y
 * nombre desde 360 px; desde sm, todo va de a dos por fila salvo el mensaje, que es opcional y en
 * celular empieza en una línea. Así el formulario cabe completo en la pantalla al llegar por un
 * enlace. Empieza por el evento: es más fácil de responder que los datos personales y anima a seguir.
 */
export function FormularioCotizacion({
  whatsapp,
  tipoInicial,
  referencia,
  origen,
  presupuestos,
  invitados,
}: Props) {
  const id = useId();
  const formulario = useRef<HTMLFormElement>(null);
  const [errores, setErrores] = useState<Errores>({});
  const [enlaceEnviado, setEnlaceEnviado] = useState<string | null>(null);

  const idCampo = (c: string) => `${id}-${c}`;
  const describe = (c: Campo) => (errores[c] ? idCampo(`${c}-error`) : undefined);

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const datos = new FormData(evento.currentTarget);
    const valor = (c: string) => String(datos.get(c) ?? "").trim();

    const nuevos: Errores = {};
    if (valor("nombre").length < 2) nuevos.nombre = "Escribe tu nombre.";
    if (!valor("tipo")) nuevos.tipo = "Elige el tipo de evento.";
    if (!valor("fecha")) nuevos.fecha = "Indica la fecha del evento (aunque sea aproximada).";
    else if (valor("fecha") < hoyIso()) nuevos.fecha = "La fecha ya pasó; revisa el año.";
    if (!valor("invitados")) nuevos.invitados = "Elige cuántos invitados calculas.";
    if (!valor("presupuesto")) nuevos.presupuesto = "Elige un rango de presupuesto.";
    if (valor("lugar").length < 3) nuevos.lugar = "Indica el municipio o el lugar del evento.";
    setErrores(nuevos);

    const primero = CAMPOS.find((c) => nuevos[c]);
    if (primero) {
      formulario.current?.querySelector<HTMLElement>(`[name="${primero}"]`)?.focus();
      return;
    }

    const enlace = enlaceWhatsApp(
      whatsapp,
      mensajeCotizacion({
        nombre: valor("nombre"),
        tipo: valor("tipo") as TipoEvento,
        fecha: valor("fecha"),
        lugar: valor("lugar"),
        invitados: valor("invitados"),
        presupuesto: valor("presupuesto"),
        mensaje: valor("mensaje"),
        referencia,
      }),
    );
    window.open(enlace, "_blank", "noopener");
    setEnlaceEnviado(enlace);
  }

  const mensajeError = (campo: Campo) =>
    errores[campo] ? (
      <p id={idCampo(`${campo}-error`)} className="mt-1 flex items-start gap-1.5 text-sm text-error">
        <IconoAlerta className="mt-0.5 size-4" />
        <span className="min-w-0">{errores[campo]}</span>
      </p>
    ) : null;

  const etiqueta = "mb-1 block text-sm font-medium text-carbon";
  // Campos a todo el ancho en celular y de a dos por fila desde sm.
  const mitad = "col-span-2 min-w-0 sm:col-span-1";
  // Fecha y nombre: caben juntos desde 360 px, sin cortar lo que se escribe.
  const par = "col-span-2 min-w-0 min-[360px]:col-span-1";

  return (
    <form
      ref={formulario}
      onSubmit={enviar}
      noValidate
      className="grid grid-cols-2 gap-x-3 gap-y-3 sm:gap-x-4"
    >
      {referencia && (
        <p className="col-span-2 rounded-sm border border-linea bg-superficie px-3 py-2 text-sm">
          <span className="text-topo">Referencia: </span>
          <span className="font-medium">{referencia}</span>
        </p>
      )}

      <div className="min-w-0">
        <label htmlFor={idCampo("tipo")} className={etiqueta}>
          Tipo de evento
        </label>
        <Lista
          id={idCampo("tipo")}
          nombre="tipo"
          valorInicial={tipoInicial}
          invalido={!!errores.tipo}
          describe={describe("tipo")}
        >
          {TIPOS.map((t) => (
            <option key={t} value={t}>
              {NOMBRE_TIPO_MENSAJE[t]}
            </option>
          ))}
        </Lista>
        {mensajeError("tipo")}
      </div>

      <div className="min-w-0">
        <label htmlFor={idCampo("invitados")} className={etiqueta}>
          Invitados (aprox.)
        </label>
        <Lista
          id={idCampo("invitados")}
          nombre="invitados"
          invalido={!!errores.invitados}
          describe={describe("invitados")}
        >
          {invitados.map((rango) => (
            <option key={rango} value={rango}>
              {rango}
            </option>
          ))}
        </Lista>
        {mensajeError("invitados")}
      </div>

      <div className={mitad}>
        <label htmlFor={idCampo("lugar")} className={etiqueta}>
          Municipio o lugar
        </label>
        <input
          id={idCampo("lugar")}
          name="lugar"
          required
          placeholder="Finca o salón y municipio"
          aria-invalid={!!errores.lugar || undefined}
          aria-describedby={describe("lugar")}
          className={campoClase}
        />
        {mensajeError("lugar")}
      </div>

      <div className={mitad}>
        <label htmlFor={idCampo("presupuesto")} className={etiqueta}>
          Presupuesto aproximado
        </label>
        <Lista
          id={idCampo("presupuesto")}
          nombre="presupuesto"
          invalido={!!errores.presupuesto}
          describe={describe("presupuesto")}
        >
          {presupuestos.map((rango) => (
            <option key={rango} value={rango}>
              {rango}
            </option>
          ))}
        </Lista>
        {mensajeError("presupuesto")}
      </div>

      <div className={par}>
        <label htmlFor={idCampo("fecha")} className={etiqueta}>
          Fecha del evento
        </label>
        <input
          id={idCampo("fecha")}
          name="fecha"
          type="date"
          required
          aria-invalid={!!errores.fecha || undefined}
          aria-describedby={describe("fecha")}
          className={`${campoClase} max-sm:px-2`}
        />
        {mensajeError("fecha")}
      </div>

      <div className={par}>
        <label htmlFor={idCampo("nombre")} className={etiqueta}>
          Nombre
        </label>
        <input
          id={idCampo("nombre")}
          name="nombre"
          autoComplete="name"
          required
          aria-invalid={!!errores.nombre || undefined}
          aria-describedby={describe("nombre")}
          className={campoClase}
        />
        {mensajeError("nombre")}
      </div>

      <div className="col-span-2 min-w-0">
        <label htmlFor={idCampo("mensaje")} className={etiqueta}>
          Mensaje (opcional)
        </label>
        <textarea
          id={idCampo("mensaje")}
          name="mensaje"
          rows={2}
          placeholder="Estilo, colores o ideas"
          className={`${campoClase} resize-y max-sm:[field-sizing:content]`}
        />
      </div>

      <div className="col-span-2 mt-1 min-w-0">
        <button
          type="submit"
          className={clasesBoton("principal", true)}
          data-evento="whatsapp"
          data-origen={`formulario-${origen}`}
        >
          <IconoWhatsApp />
          Enviar por WhatsApp
        </button>
        <p className="mt-2 text-center text-sm text-topo">
          Se abrirá WhatsApp con tu mensaje listo.
        </p>
        <p aria-live="polite" className="mt-1 text-center text-sm">
          {enlaceEnviado && (
            <>
              ¿No se abrió?{" "}
              <a
                href={enlaceEnviado}
                target="_blank"
                rel="noopener"
                className="inline-flex min-h-11 items-center text-terracota underline underline-offset-4"
              >
                Abrir WhatsApp
              </a>
            </>
          )}
        </p>
      </div>
    </form>
  );
}
