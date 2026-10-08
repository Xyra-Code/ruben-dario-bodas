/**
 * Fotos de los eventos, procesadas al compilar por scripts/imagenes.ts:
 *   content/eventos/<slug>/fotos/<base>.jpg  →  public/img/eventos/<slug>/<base>-<ancho>.webp
 * y sus medidas, color y placeholder en src/generado/imagenes.json.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

/** Anchos generados: celular, tablet/columna, pantalla completa. */
export const ANCHOS = [480, 960, 1600] as const;

export const MANIFIESTO = path.join(process.cwd(), "src", "generado", "imagenes.json");
export const CARPETA_PUBLICA = path.join(process.cwd(), "public", "img", "eventos");

export type Imagen = {
  /** Medidas del máster (orientación ya corregida). */
  ancho: number;
  alto: number;
  /** Color dominante, fondo mientras carga. */
  color: string;
  /** Miniatura borrosa en data URI (~300 bytes). */
  lqip: string;
  variantes: { ancho: number; src: string }[];
};

export const clave = (slug: string, archivo: string) => `${slug}/${archivo}`;
export const base = (archivo: string) => archivo.replace(/\.[a-z]+$/, "");
export const rutaPublica = (slug: string, archivo: string, ancho: number) =>
  `/img/eventos/${slug}/${base(archivo)}-${ancho}.webp`;

// ── Imágenes para compartir (Open Graph), también generadas por scripts/imagenes.ts ──

/** JPEG 1200×630: el tamaño que WhatsApp, Facebook y X muestran grande. */
export const OG = { ancho: 1200, alto: 630 } as const;
export const CARPETA_OG = path.join(process.cwd(), "public", "img", "og");

export type ImagenOg = { src: string; ancho: number; alto: number; alt: string };

/** Logo sobre marfil: inicio y páginas sin foto propia. */
export const OG_SITIO: ImagenOg = {
  src: "/img/og/sitio.jpg",
  ...OG,
  alt: "Rubén Darío Diseñador de Bodas",
};

/** Portada del evento recortada a 1200×630, con el monograma. */
export const ogEvento = (slug: string, alt: string): ImagenOg => ({
  src: `/img/og/eventos/${slug}.jpg`,
  ...OG,
  alt,
});

let cache: Record<string, Imagen> | null = null;

export function obtenerImagen(slug: string, archivo: string): Imagen {
  if (!cache) {
    if (!existsSync(MANIFIESTO)) {
      throw new Error("Falta src/generado/imagenes.json: corra npm run imagenes");
    }
    cache = JSON.parse(readFileSync(MANIFIESTO, "utf8")) as Record<string, Imagen>;
  }
  const imagen = cache[clave(slug, archivo)];
  if (!imagen) {
    throw new Error(`La foto ${clave(slug, archivo)} no está procesada: corra npm run imagenes`);
  }
  return imagen;
}
