"use client";

import { useId, useRef, useState, type FormEvent } from "react";

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
};

type Campo = "nombre" | "tipo" | "fecha" | "invitados";
type Errores = Partial<Record<Campo, string>>;

const TIPOS: TipoEvento[] = ["boda", "quince", "otro"];

const hoyIso = () => {
  const h = new Date();
  return `${h.getFullYear()}-${String(h.getMonth() + 1).padStart(2, "0")}-${String(h.getDate()).padStart(2, "0")}`;
};

const campoClase =
  "block min-h-12 w-full min-w-0 rounded-sm border border-borde bg-white px-4 py-3 text-carbon placeholder:text-topo/70 transition-colors focus:border-terracota focus:outline-2 focus:outline-offset-0 focus:outline-terracota aria-invalid:border-error";

/**
 * Formulario de cotización: arma el mensaje y abre WhatsApp (sitio estático, sin envío
 * automático). Valida al enviar, marca cada error junto a su campo y lleva el foco al
 * primero. Funciona con teclado y lector de pantalla.
 */
export function FormularioCotizacion({ whatsapp, tipoInicial, referencia, origen }: Props) {
  const id = useId();
  const formulario = useRef<HTMLFormElement>(null);
  const [errores, setErrores] = useState<Errores>({});
  const [enlaceEnviado, setEnlaceEnviado] = useState<string | null>(null);

  const idCampo = (c: string) => `${id}-${c}`;
  const describe = (c: Campo, ayuda?: string) =>
    [errores[c] ? idCampo(`${c}-error`) : null, ayuda].filter(Boolean).join(" ") || undefined;

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const datos = new FormData(evento.currentTarget);
    const valor = (c: string) => String(datos.get(c) ?? "").trim();

    const nuevos: Errores = {};
    if (valor("nombre").length < 2) nuevos.nombre = "Escriba su nombre.";
    if (!valor("tipo")) nuevos.tipo = "Elija el tipo de evento.";
    if (!valor("fecha")) nuevos.fecha = "Indique la fecha del evento (aunque sea aproximada).";
    else if (valor("fecha") < hoyIso()) nuevos.fecha = "La fecha ya pasó; revise el año.";
    if (valor("invitados") && !/^\d{1,5}$/.test(valor("invitados"))) {
      nuevos.invitados = "Escriba solo el número, por ejemplo 150.";
    }
    setErrores(nuevos);

    const primero = (["nombre", "tipo", "fecha", "invitados"] as Campo[]).find((c) => nuevos[c]);
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
        mensaje: valor("mensaje"),
        referencia,
      }),
    );
    window.open(enlace, "_blank", "noopener");
    setEnlaceEnviado(enlace);
  }

  const mensajeError = (campo: Campo) =>
    errores[campo] ? (
      <p
        id={idCampo(`${campo}-error`)}
        className="mt-2 flex items-start gap-1.5 text-sm text-error"
      >
        <IconoAlerta className="mt-0.5 size-4" />
        <span className="min-w-0">{errores[campo]}</span>
      </p>
    ) : null;

  const etiqueta = "mb-2 block text-[0.9375rem] font-medium text-carbon";
  const opcional = <span className="font-normal text-topo"> (opcional)</span>;

  return (
    <form ref={formulario} onSubmit={enviar} noValidate className="grid gap-6">
      {referencia && (
        <p className="rounded-sm border border-linea bg-white px-4 py-3 text-[0.9375rem]">
          <span className="text-topo">Referencia: </span>
          <span className="font-medium">{referencia}</span>
        </p>
      )}

      <div className="min-w-0">
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

      <fieldset className="min-w-0" aria-describedby={describe("tipo")}>
        <legend className={etiqueta}>Tipo de evento</legend>
        <div className="grid grid-cols-3 gap-2">
          {TIPOS.map((t) => (
            <label key={t} className="relative min-w-0">
              <input
                type="radio"
                name="tipo"
                value={t}
                defaultChecked={t === tipoInicial}
                required
                data-invalido={!!errores.tipo || undefined}
                className="peer absolute inset-0 cursor-pointer opacity-0"
              />
              <span className="flex min-h-12 items-center justify-center rounded-sm border border-borde bg-white px-2 text-center text-[0.9375rem] transition-colors peer-checked:border-terracota peer-checked:bg-terracota peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-terracota peer-data-invalido:border-error">
                {NOMBRE_TIPO_MENSAJE[t]}
              </span>
            </label>
          ))}
        </div>
        {mensajeError("tipo")}
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="min-w-0">
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
            className={campoClase}
          />
          {mensajeError("fecha")}
        </div>
        <div className="min-w-0">
          <label htmlFor={idCampo("invitados")} className={etiqueta}>
            Invitados (aprox.){opcional}
          </label>
          <input
            id={idCampo("invitados")}
            name="invitados"
            inputMode="numeric"
            placeholder="150"
            aria-invalid={!!errores.invitados || undefined}
            aria-describedby={describe("invitados")}
            className={campoClase}
          />
          {mensajeError("invitados")}
        </div>
      </div>

      <div className="min-w-0">
        <label htmlFor={idCampo("lugar")} className={etiqueta}>
          Municipio o lugar{opcional}
        </label>
        <input
          id={idCampo("lugar")}
          name="lugar"
          placeholder="Hacienda, finca o salón y municipio"
          className={campoClase}
        />
      </div>

      <div className="min-w-0">
        <label htmlFor={idCampo("mensaje")} className={etiqueta}>
          Mensaje{opcional}
        </label>
        <textarea
          id={idCampo("mensaje")}
          name="mensaje"
          rows={4}
          placeholder="Estilo, colores o ideas que tenga en mente"
          className={`${campoClase} resize-y`}
        />
      </div>

      <div>
        <button
          type="submit"
          className={clasesBoton("principal", true)}
          data-evento="whatsapp"
          data-origen={`formulario-${origen}`}
        >
          <IconoWhatsApp />
          Enviar por WhatsApp
        </button>
        <p className="mt-3 text-center text-sm text-topo">
          Se abrirá WhatsApp con su mensaje listo para enviar.
        </p>
        <p aria-live="polite" className="mt-2 text-center text-sm">
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
