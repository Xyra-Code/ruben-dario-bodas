/**
 * Esquemas del contenido del sitio (carpeta /content). Son el contrato: si un archivo no
 * cumple, `npm run validar` falla y el sitio no se compila.
 *
 * Los textos que aún no entrega la empresa se escriben como "[PENDIENTE: …]". Se permiten
 * mientras se desarrolla; la validación estricta (antes de publicar) los rechaza.
 */
import { z } from "zod";

// ── Piezas comunes ──────────────────────────────────────────────────────────

/** Slug de URL: minúsculas, números y guiones; sin tildes ni ñ. */
export const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Solo minúsculas, números y guiones (sin tildes ni ñ)");

const texto = z.string().trim().min(1, "No puede estar vacío");
const parrafos = z.array(texto).min(1);
const hex = z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Color en formato #RRGGBB");
const hora = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Hora en formato HH:MM");

/** Archivo de foto con nombre limpio, p. ej. boda-hacienda-restrepo-mesa-principal.jpg */
const archivoFoto = z
  .string()
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*\.(jpe?g|png|webp)$/,
    "Nombre de foto limpio: minúsculas y guiones, .jpg/.png/.webp",
  );

/** Título y descripción para Google. Los largos siguen lo que Google muestra sin cortar. */
const seo = z.strictObject({
  title: texto.max(65, "El título SEO no debe pasar de 65 caracteres"),
  description: texto
    .min(70, "La descripción SEO debe tener al menos 70 caracteres")
    .max(160, "La descripción SEO no debe pasar de 160 caracteres"),
});

const preguntaFrecuente = z.strictObject({ pregunta: texto, respuesta: texto });

export const tiposEvento = ["boda", "quince", "otro"] as const;
export const tipoEvento = z.enum(tiposEvento);

// ── Sitio: datos del negocio (deben coincidir con Google Business) ─────────

const dias = z.enum(["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"]);

export const sitio = z.strictObject({
  nombre: texto,
  /** Frase corta bajo el logo y en el footer. */
  lema: texto,
  /** URL canónica en ASCII (punycode). El dominio con ñ va en `dominioVisible`. */
  url: z.url({ protocol: /^https$/ }).refine((u) => !u.endsWith("/"), "Sin barra final"),
  dominioVisible: texto,
  telefono: z.strictObject({
    /** Como se muestra: "310 000 0000". */
    visible: texto,
    /** Formato internacional para enlaces tel: y datos estructurados: "+573100000000". */
    e164: z.string().regex(/^\+57\d{10}$/, "Formato +57 seguido de 10 dígitos"),
  }),
  /** Número de WhatsApp para wa.me, solo dígitos con indicativo: "573100000000". */
  whatsapp: z.string().regex(/^57\d{10}$/, "57 seguido de 10 dígitos, sin + ni espacios"),
  correo: texto,
  direccion: z.strictObject({
    /** false = negocio de área de servicio (Google Business oculta la dirección). */
    publica: z.boolean(),
    calle: texto,
    barrio: texto.optional(),
    ciudad: texto,
    departamento: texto,
    codigoPostal: texto.optional(),
    pais: z.literal("CO"),
  }),
  horario: z.array(z.strictObject({ dias: z.array(dias).min(1), abre: hora, cierra: hora })).min(1),
  redes: z.strictObject({
    instagram: z.url().optional(),
    facebook: z.url().optional(),
    tiktok: z.url().optional(),
    pinterest: z.url().optional(),
  }),
  google: z.strictObject({
    /** Enlace al perfil de Google Business (ver reseñas / cómo llegar). */
    perfil: texto,
    /** Enlace directo para dejar una reseña. */
    escribirResena: texto,
  }),
  /**
   * Dónde trabaja la empresa. `sede` es el centro de operación (Villavicencio); cada zona
   * es un departamento o distrito con los municipios que se nombran en el sitio. Va igual
   * que el área de servicio de Google Business.
   */
  cobertura: z.strictObject({
    sede: texto,
    /** Cómo se nombra en los textos: "Villavicencio, el Meta, Bogotá y Cundinamarca". */
    resumen: texto,
    zonas: z
      .array(
        z.strictObject({
          /** "Meta", "Bogotá D.C.", "Cundinamarca". */
          nombre: texto,
          tipo: z.enum(["departamento", "distrito"]),
          municipios: z.array(texto).min(1),
        }),
      )
      .min(1),
  }),
  /** Cifras de trayectoria para la portada ("+300", "eventos realizados"). */
  cifras: z.array(z.strictObject({ valor: texto, etiqueta: texto })).max(4),
});

// ── Servicios: /bodas y /quince-anos ────────────────────────────────────────

export const servicio = z.strictObject({
  slug,
  tipo: tipoEvento,
  nombre: texto,
  h1: texto,
  seo,
  /** Frase corta bajo el H1, en la portada de la página. */
  bajada: texto,
  /** 2–3 párrafos propios de la empresa (sin texto propio no se posiciona). */
  introduccion: parrafos,
  /** Bodas: tipos de boda. 15 años: temáticas y estilos. */
  variantes: z.strictObject({
    titulo: texto,
    items: z.array(z.strictObject({ nombre: texto, descripcion: texto })).min(1),
  }),
  incluye: z.array(texto).min(1),
  inversion: z.strictObject({
    /** Valor de referencia, como se muestra: "$3.500.000". */
    desde: texto,
    /** Qué hace variar el precio. */
    nota: texto,
  }),
  preguntas: z.array(preguntaFrecuente).min(1),
});

// ── Preguntas generales (portada) ───────────────────────────────────────────

export const preguntasGenerales = z.array(preguntaFrecuente).min(1);

// ── Cómo trabajamos (portada): del primer mensaje al día del evento ─────────

export const proceso = z
  .array(z.strictObject({ titulo: texto, descripcion: texto }))
  .min(3)
  .max(6);

// ── Lugares: salones, haciendas y fincas ────────────────────────────────────

export const lugar = z.strictObject({
  /** true = de ejemplo. Se ve en desarrollo; impide publicar. */
  borrador: z.boolean().optional(),
  slug,
  nombre: texto,
  tipo: z.enum(["hacienda", "finca", "salon", "club", "hotel", "iglesia", "aire-libre", "otro"]),
  municipio: texto,
  /** Zona de sitio.json → cobertura: "Meta", "Bogotá D.C.", "Cundinamarca". */
  departamento: texto,
  capacidad: texto.optional(),
  /** Solo se nombra en la guía de lugares si el lugar dio permiso. */
  enGuia: z.boolean(),
});
export const lugares = z.array(lugar);

// ── Testimonios ─────────────────────────────────────────────────────────────

export const testimonio = z.strictObject({
  /** true = de ejemplo. Se ve en desarrollo; impide publicar. */
  borrador: z.boolean().optional(),
  texto,
  autor: texto,
  tipo: tipoEvento,
  /** Slug del evento, si el testimonio corresponde a uno del portafolio. */
  evento: slug.optional(),
  /** La persona autorizó publicar su testimonio (Ley 1581 de 2012). */
  autorizado: z.boolean(),
});
export const testimonios = z.array(testimonio);

// ── Eventos del portafolio (content/eventos/<slug>/evento.json) ─────────────

export const evento = z.strictObject({
  /** true = de ejemplo o incompleto. Se ve en desarrollo; impide publicar. */
  borrador: z.boolean().optional(),
  tipo: tipoEvento,
  /** Slug de content/lugares.json. El H1 se arma solo: "Boda en {lugar}, {municipio}". */
  lugar: slug,
  /** Solo si el título automático no sirve. */
  titulo: texto.optional(),
  estilo: texto,
  paleta: z
    .array(z.strictObject({ nombre: texto, hex }))
    .min(2)
    .max(6),
  /** Mes del evento: "2026-03". */
  fecha: z.string().regex(/^20\d{2}-(0[1-9]|1[0-2])$/, "Formato AAAA-MM"),
  destacado: z.boolean(),
  /** Qué hizo especial el diseño (texto de la empresa). */
  descripcion: parrafos,
  testimonio: z.strictObject({ texto, autor: texto }).optional(),
  proveedores: z.array(z.strictObject({ rol: texto, nombre: texto, url: z.url().optional() })),
  seo,
  /** Archivo de `fotos` usado como portada (tarjetas, Open Graph). */
  portada: archivoFoto,
  fotos: z
    .array(
      z.strictObject({
        archivo: archivoFoto,
        alt: texto.min(15, "El alt debe describir la foto (mínimo 15 caracteres)"),
      }),
    )
    .min(1),
});

// ── Páginas de texto: sobre, guía de lugares y política de datos ───────────

/** Foto suelta de una página (no de un evento): content/sobre/fotos/<archivo>. */
const fotoSuelta = z.strictObject({
  archivo: archivoFoto,
  alt: texto.min(15, "El alt debe describir la foto (mínimo 15 caracteres)"),
});

export const sobre = z.strictObject({
  /** Frase que lo define, junto al retrato en /sobre-ruben-dario. */
  frase: texto,
  /** Párrafo de la sección "Sobre Rubén Darío" en la portada. */
  resumen: texto,
  retrato: fotoSuelta.optional(),
  /** "Cómo empezó": historia en primera o tercera persona, 400–600 palabras en total. */
  historia: parrafos,
  /** Frase destacada dentro de la historia. */
  citaHistoria: texto.optional(),
  hitos: z
    .array(z.strictObject({ anio: z.string().regex(/^(19|20)\d{2}$/, "Año: AAAA"), texto }))
    .min(1),
  /** "Su forma de diseñar": 3 principios. */
  principios: z
    .array(z.strictObject({ titulo: texto, texto }))
    .min(1)
    .max(4),
  equipo: z.array(z.strictObject({ nombre: texto, rol: texto, foto: fotoSuelta.optional() })),
  /** Hasta 3 slugs de eventos del portafolio. */
  eventosQueMarcaron: z.array(slug).max(3),
  reconocimientos: z.array(texto),
});

export const guiaLugares = z.strictObject({
  /** Textos redactados por XyraCode como borrador: false hasta que la empresa los apruebe. */
  revisadoPorLaEmpresa: z.boolean(),
  /** Cómo elegir el lugar de la boda. */
  introduccion: parrafos,
  /** Consejos de decoración por tipo de lugar (finca, salón, hacienda…). */
  consejos: z.array(z.strictObject({ tipo: texto, texto })).min(1),
});

export const politica = z.strictObject({
  /** Fecha de la última actualización: "2026-10-08". */
  actualizada: z.string().regex(/^20\d{2}-\d{2}-\d{2}$/, "Formato AAAA-MM-DD"),
  secciones: z.array(z.strictObject({ titulo: texto, parrafos })).min(1),
});

export type Sitio = z.infer<typeof sitio>;
export type Sobre = z.infer<typeof sobre>;
export type GuiaLugares = z.infer<typeof guiaLugares>;
export type Politica = z.infer<typeof politica>;
export type Servicio = z.infer<typeof servicio>;
export type PreguntaFrecuente = z.infer<typeof preguntaFrecuente>;
export type Paso = z.infer<typeof proceso>[number];
export type Lugar = z.infer<typeof lugar>;
export type Testimonio = z.infer<typeof testimonio>;
export type TipoEvento = z.infer<typeof tipoEvento>;
export type EventoArchivo = z.infer<typeof evento>;
