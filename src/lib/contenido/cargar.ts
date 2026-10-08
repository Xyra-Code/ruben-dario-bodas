/**
 * Lee y valida todo el contenido de /content al compilar. Lo usan las páginas (vía
 * `obtenerContenido`) y el script `npm run validar`.
 *
 * Además de los esquemas, revisa las referencias cruzadas: lugar del evento, fotos que
 * existen en disco, portada, testimonios que apuntan a eventos, etc. Junta todos los
 * problemas y los reporta juntos.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { z } from "zod";

import * as esquema from "./esquemas";
import type { EventoArchivo, Lugar, TipoEvento } from "./esquemas";

export const CARPETA_CONTENIDO = path.join(process.cwd(), "content");
const CARPETA_EVENTOS = path.join(CARPETA_CONTENIDO, "eventos");
/** Fotos de las páginas de texto (retrato, equipo): se procesan con el slug "sobre". */
export const CARPETA_FOTOS_SOBRE = path.join(CARPETA_CONTENIDO, "sobre", "fotos");
const MARCA_PENDIENTE = "[PENDIENTE";

const NOMBRE_TIPO: Record<TipoEvento, string> = {
  boda: "Boda",
  quince: "Fiesta de 15 años",
  otro: "Evento",
};
/** Prefijo obligatorio del slug según el tipo (el de "otro" es libre). */
const PREFIJO_SLUG: Partial<Record<TipoEvento, string>> = { boda: "boda-", quince: "quince-" };

export type Evento = Omit<EventoArchivo, "lugar" | "titulo" | "fotos"> & {
  slug: string;
  titulo: string;
  lugar: Lugar;
  /** "marzo de 2026" */
  fechaTexto: string;
  fotos: (EventoArchivo["fotos"][number] & { ruta: string })[];
};

export type Contenido = {
  sitio: esquema.Sitio;
  servicios: esquema.Servicio[];
  preguntasGenerales: esquema.PreguntaFrecuente[];
  proceso: esquema.Paso[];
  lugares: Lugar[];
  /** Solo los testimonios autorizados. */
  testimonios: esquema.Testimonio[];
  /** Del más reciente al más antiguo. */
  eventos: Evento[];
  sobre: esquema.Sobre;
  guiaLugares: esquema.GuiaLugares;
  politica: esquema.Politica;
  /** Fotos fuera de los eventos (content/sobre/fotos), para el pipeline de imágenes. */
  fotosSobre: { archivo: string; ruta: string }[];
};

export type ResultadoValidacion = {
  contenido: Contenido | null;
  errores: string[];
  avisos: string[];
};

// ── Lectura ────────────────────────────────────────────────────────────────

function relativa(ruta: string) {
  return path.relative(process.cwd(), ruta).replaceAll("\\", "/");
}

function leerJson<T extends z.ZodType>(
  ruta: string,
  validador: T,
  errores: string[],
): { datos: z.infer<T>; crudo: unknown } | null {
  if (!existsSync(ruta)) {
    errores.push(`${relativa(ruta)}: el archivo no existe`);
    return null;
  }
  let crudo: unknown;
  try {
    crudo = JSON.parse(readFileSync(ruta, "utf8"));
  } catch (e) {
    errores.push(`${relativa(ruta)}: JSON inválido (${(e as Error).message})`);
    return null;
  }
  const resultado = validador.safeParse(crudo);
  if (!resultado.success) {
    for (const issue of resultado.error.issues) {
      const campo = issue.path.length ? issue.path.join(".") : "(raíz)";
      errores.push(`${relativa(ruta)} → ${campo}: ${issue.message}`);
    }
    return null;
  }
  return { datos: resultado.data, crudo };
}

/** Rutas ("campo.sub[0]") de los textos marcados como [PENDIENTE: …]. */
function pendientes(valor: unknown, ruta = ""): string[] {
  if (typeof valor === "string") return valor.includes(MARCA_PENDIENTE) ? [ruta || "(raíz)"] : [];
  if (Array.isArray(valor)) return valor.flatMap((v, i) => pendientes(v, `${ruta}[${i}]`));
  if (valor && typeof valor === "object") {
    return Object.entries(valor).flatMap(([k, v]) => pendientes(v, ruta ? `${ruta}.${k}` : k));
  }
  return [];
}

function fechaTexto(fecha: string) {
  const [anio, mes] = fecha.split("-").map(Number);
  return new Intl.DateTimeFormat("es-CO", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(anio, mes - 1, 1)));
}

// ── Validación completa ─────────────────────────────────────────────────────

/**
 * @param estricto Antes de publicar: borradores y textos [PENDIENTE] pasan de aviso a error.
 */
export function validarContenido({ estricto = false } = {}): ResultadoValidacion {
  const errores: string[] = [];
  const avisos: string[] = [];
  const conPendientes = new Map<string, string[]>();

  const cargar = <T extends z.ZodType>(archivo: string, validador: T) => {
    const ruta = path.join(CARPETA_CONTENIDO, archivo);
    const leido = leerJson(ruta, validador, errores);
    if (leido) {
      const encontrados = pendientes(leido.crudo);
      if (encontrados.length) conPendientes.set(relativa(ruta), encontrados);
    }
    return leido?.datos ?? null;
  };

  const sitio = cargar("sitio.json", esquema.sitio);
  const preguntasGenerales = cargar("preguntas-generales.json", esquema.preguntasGenerales);
  const proceso = cargar("proceso.json", esquema.proceso);
  const lugares = cargar("lugares.json", esquema.lugares);
  const testimonios = cargar("testimonios.json", esquema.testimonios);
  const sobre = cargar("sobre/sobre.json", esquema.sobre);
  const guiaLugares = cargar("guia-lugares.json", esquema.guiaLugares);
  const politica = cargar("politica-de-datos.json", esquema.politica);
  const servicios = ["bodas", "quince-anos"]
    .map((nombre) => cargar(`servicios/${nombre}.json`, esquema.servicio))
    .filter((s) => s !== null);

  // Lugares: slugs únicos y municipios dentro de la cobertura.
  const lugarPorSlug = new Map<string, Lugar>();
  for (const l of lugares ?? []) {
    if (lugarPorSlug.has(l.slug)) errores.push(`content/lugares.json: slug repetido "${l.slug}"`);
    lugarPorSlug.set(l.slug, l);
    if (l.borrador)
      (estricto ? errores : avisos).push(
        `content/lugares.json: "${l.nombre}" es de ejemplo (borrador)`,
      );
    const zona = sitio?.cobertura.zonas.find((z) => z.nombre === l.departamento);
    if (sitio && !zona) {
      errores.push(
        `content/lugares.json: "${l.nombre}" tiene departamento "${l.departamento}", que no es una zona de cobertura en sitio.json`,
      );
    } else if (zona && !zona.municipios.includes(l.municipio)) {
      avisos.push(
        `content/lugares.json: "${l.nombre}" está en ${l.municipio}, que no figura en los municipios de ${zona.nombre} en sitio.json`,
      );
    }
  }

  // Servicios: cada archivo con su slug esperado.
  for (const s of servicios) {
    const esperado = s.tipo === "boda" ? "bodas" : s.tipo === "quince" ? "quince-anos" : null;
    if (s.slug !== esperado) {
      errores.push(
        `content/servicios: el servicio de tipo "${s.tipo}" debe tener slug "${esperado}"`,
      );
    }
  }

  // Eventos: una carpeta por evento.
  const eventos: Evento[] = [];
  const carpetas = existsSync(CARPETA_EVENTOS)
    ? readdirSync(CARPETA_EVENTOS, { withFileTypes: true }).filter((d) => d.isDirectory())
    : [];

  for (const { name: slug } of carpetas) {
    const base = `content/eventos/${slug}`;
    if (!esquema.slug.safeParse(slug).success) {
      errores.push(
        `${base}: el nombre de la carpeta no es un slug válido (minúsculas, guiones, sin tildes)`,
      );
      continue;
    }
    const datos = cargar(`eventos/${slug}/evento.json`, esquema.evento);
    if (!datos) continue;

    const prefijo = PREFIJO_SLUG[datos.tipo];
    if (prefijo && !slug.startsWith(prefijo)) {
      errores.push(`${base}: un evento de tipo "${datos.tipo}" debe empezar por "${prefijo}"`);
    }

    const lugar = lugarPorSlug.get(datos.lugar);
    if (!lugar) {
      errores.push(
        `${base}/evento.json → lugar: "${datos.lugar}" no existe en content/lugares.json`,
      );
      continue;
    }

    // Fotos: sin repetidas, todas en disco, portada incluida.
    const carpetaFotos = path.join(CARPETA_EVENTOS, slug, "fotos");
    const enDisco = new Set(existsSync(carpetaFotos) ? readdirSync(carpetaFotos) : []);
    const listadas = new Set<string>();
    for (const foto of datos.fotos) {
      if (listadas.has(foto.archivo))
        errores.push(`${base}: la foto "${foto.archivo}" está repetida`);
      listadas.add(foto.archivo);
      if (!enDisco.has(foto.archivo))
        errores.push(`${base}: falta el archivo fotos/${foto.archivo}`);
    }
    if (!listadas.has(datos.portada)) {
      errores.push(`${base}: la portada "${datos.portada}" no está en la lista de fotos`);
    }
    for (const archivo of enDisco) {
      if (!listadas.has(archivo))
        avisos.push(`${base}: fotos/${archivo} no está en evento.json (no se publica)`);
    }
    if (datos.fotos.length < 8) {
      avisos.push(`${base}: tiene ${datos.fotos.length} fotos; se recomiendan 15–20`);
    }

    if (datos.borrador) {
      (estricto ? errores : avisos).push(`${base}: está marcado como borrador`);
    }

    eventos.push({
      ...datos,
      slug,
      lugar,
      titulo: datos.titulo ?? `${NOMBRE_TIPO[datos.tipo]} en ${lugar.nombre}, ${lugar.municipio}`,
      fechaTexto: fechaTexto(datos.fecha),
      fotos: datos.fotos.map((f) => ({ ...f, ruta: path.join(carpetaFotos, f.archivo) })),
    });
  }

  eventos.sort((a, b) => b.fecha.localeCompare(a.fecha));

  // Testimonios: referencias a eventos y autorización.
  const slugsEventos = new Set(eventos.map((e) => e.slug));
  for (const t of testimonios ?? []) {
    if (t.evento && !slugsEventos.has(t.evento)) {
      errores.push(
        `content/testimonios.json: "${t.autor}" apunta al evento "${t.evento}", que no existe`,
      );
    }
    if (t.borrador)
      (estricto ? errores : avisos).push(
        `content/testimonios.json: "${t.autor}" es de ejemplo (borrador)`,
      );
    if (!t.autorizado)
      avisos.push(`content/testimonios.json: "${t.autor}" sin autorización (no se publica)`);
  }

  // Sobre: eventos que lo marcaron y fotos en disco.
  for (const s of sobre?.eventosQueMarcaron ?? []) {
    if (!slugsEventos.has(s)) {
      errores.push(`content/sobre/sobre.json → eventosQueMarcaron: "${s}" no existe`);
    }
  }
  const fotosSobre = [sobre?.retrato, ...(sobre?.equipo.map((m) => m.foto) ?? [])]
    .filter((f) => f !== undefined)
    .map((f) => ({ archivo: f.archivo, ruta: path.join(CARPETA_FOTOS_SOBRE, f.archivo) }));
  for (const f of fotosSobre) {
    if (!existsSync(f.ruta)) errores.push(`content/sobre: falta el archivo fotos/${f.archivo}`);
  }

  if (guiaLugares && !guiaLugares.revisadoPorLaEmpresa) {
    (estricto ? errores : avisos).push(
      "content/guia-lugares.json: borrador de XyraCode sin aprobar (revisadoPorLaEmpresa: false)",
    );
  }

  // Destacados de la portada.
  const destacados = eventos.filter((e) => e.destacado).length;
  if (eventos.length && (destacados < 3 || destacados > 6)) {
    avisos.push(`Hay ${destacados} eventos destacados; la portada muestra entre 3 y 6`);
  }

  // Textos pendientes de la empresa.
  for (const [archivo, rutas] of conPendientes) {
    const mensaje = `${archivo}: ${rutas.length} texto(s) [PENDIENTE] (${rutas.slice(0, 3).join(", ")}${rutas.length > 3 ? ", …" : ""})`;
    (estricto ? errores : avisos).push(mensaje);
  }

  const completo =
    sitio &&
    preguntasGenerales &&
    proceso &&
    lugares &&
    testimonios &&
    sobre &&
    guiaLugares &&
    politica &&
    servicios.length === 2 &&
    !errores.length;

  return {
    contenido: completo
      ? {
          sitio,
          servicios,
          preguntasGenerales,
          proceso,
          lugares,
          testimonios: testimonios.filter((t) => t.autorizado),
          eventos,
          sobre,
          guiaLugares,
          politica,
          fotosSobre,
        }
      : null,
    errores,
    avisos,
  };
}

// ── Acceso desde las páginas ────────────────────────────────────────────────

let cache: Contenido | null = null;

/** Contenido validado. Lanza un error con la lista de problemas si algo no cumple. */
export function obtenerContenido(): Contenido {
  if (cache) return cache;
  const { contenido, errores } = validarContenido();
  if (!contenido) {
    throw new Error(
      `El contenido tiene errores (corra npm run validar):\n- ${errores.join("\n- ")}`,
    );
  }
  cache = contenido;
  return contenido;
}

export function obtenerEvento(slug: string) {
  return obtenerContenido().eventos.find((e) => e.slug === slug) ?? null;
}

export function obtenerServicio(tipo: TipoEvento) {
  return obtenerContenido().servicios.find((s) => s.tipo === tipo) ?? null;
}

/** Hasta `cantidad` eventos parecidos: primero del mismo tipo, luego del mismo municipio. */
export function eventosRelacionados(evento: Evento, cantidad = 3) {
  const puntaje = (e: Evento) =>
    (e.tipo === evento.tipo ? 2 : 0) + (e.lugar.municipio === evento.lugar.municipio ? 1 : 0);
  return obtenerContenido()
    .eventos.filter((e) => e.slug !== evento.slug)
    .sort((a, b) => puntaje(b) - puntaje(a) || b.fecha.localeCompare(a.fecha))
    .slice(0, cantidad);
}

/** Eventos realizados en un lugar (guía de lugares). */
export function eventosEnLugar(slugLugar: string) {
  return obtenerContenido().eventos.filter((e) => e.lugar.slug === slugLugar);
}
