/**
 * Importa las fotos originales de un evento al repo como "másters" livianos.
 *
 *   npm run fotos:importar -- "<carpeta con las originales>" <slug-del-evento>
 *
 * Por cada foto: corrige la rotación, BORRA LOS METADATOS (incluida la ubicación GPS de
 * los celulares), la deja en máximo 2400 px en JPEG sRGB y la guarda con nombre limpio en
 * content/eventos/<slug>/fotos/. Si existe evento.json, agrega las fotos nuevas con un alt
 * [PENDIENTE] para completar a mano.
 *
 * Las originales en máxima calidad no van al repo: se guardan en el Drive de la empresa.
 * Renombre antes las originales con lo que muestran ("mesa principal.jpg"): el nombre
 * forma parte de la URL de la foto y ayuda al SEO. Nombres de cámara (IMG_1234) se avisan.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

import { slug as esquemaSlug } from "../src/lib/contenido/esquemas";

const LADO_MAXIMO = 2400;
const CALIDAD_JPEG = 85;
const EXTENSIONES = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"]);
const NOMBRE_DE_CAMARA = /^(img|dsc|dscn|dji|pxl|mvimg|photo|image|foto|whatsapp)[-_ ]?\d/i;

function limpiar(nombre: string) {
  return nombre
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // tildes; la ñ queda como n
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const [origen, slug] = process.argv.slice(2);
  if (!origen || !slug) {
    console.error('Uso: npm run fotos:importar -- "<carpeta de originales>" <slug-del-evento>');
    process.exit(1);
  }
  if (!esquemaSlug.safeParse(slug).success) {
    console.error(`✖ "${slug}" no es un slug válido (minúsculas, guiones, sin tildes ni ñ).`);
    process.exit(1);
  }
  if (!existsSync(origen)) {
    console.error(`✖ No existe la carpeta ${origen}`);
    process.exit(1);
  }

  const carpetaEvento = path.join(process.cwd(), "content", "eventos", slug);
  const carpetaFotos = path.join(carpetaEvento, "fotos");
  mkdirSync(carpetaFotos, { recursive: true });

  const archivos = readdirSync(origen)
    .filter((a) => EXTENSIONES.has(path.extname(a).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, "es", { numeric: true }));
  if (!archivos.length) {
    console.error(`✖ No hay fotos (.jpg, .png, .webp, .tif) en ${origen}`);
    process.exit(1);
  }

  const importadas: string[] = [];
  const avisos: string[] = [];
  for (const original of archivos) {
    const nombreBase = limpiar(path.parse(original).name);
    if (NOMBRE_DE_CAMARA.test(path.parse(original).name)) {
      avisos.push(`"${original}" tiene nombre de cámara; renómbrela con lo que muestra la foto`);
    }
    const final = `${nombreBase.startsWith(slug) ? nombreBase : `${slug}-${nombreBase}`}.jpg`;
    const destino = path.join(carpetaFotos, final);

    const entrada = sharp(path.join(origen, original), { failOn: "error" });
    const { width = 0, height = 0 } = await entrada.metadata();
    if (Math.max(width, height) < 1600) {
      avisos.push(
        `"${original}" mide ${width}×${height}: muy pequeña, se verá borrosa en pantallas grandes`,
      );
    }
    // Sin withMetadata(): sharp descarta EXIF, GPS e ICC; toColorspace deja todo en sRGB.
    await entrada
      .rotate()
      .resize({ width: LADO_MAXIMO, height: LADO_MAXIMO, fit: "inside", withoutEnlargement: true })
      .toColorspace("srgb")
      .jpeg({ quality: CALIDAD_JPEG, mozjpeg: true })
      .toFile(destino);
    importadas.push(final);
  }

  // Agregar las fotos nuevas a evento.json (si existe).
  const rutaJson = path.join(carpetaEvento, "evento.json");
  let agregadas = 0;
  if (existsSync(rutaJson)) {
    const evento = JSON.parse(readFileSync(rutaJson, "utf8")) as {
      fotos?: { archivo: string; alt: string }[];
      portada?: string;
    };
    evento.fotos ??= [];
    const ya = new Set(evento.fotos.map((f) => f.archivo));
    for (const archivo of importadas) {
      if (ya.has(archivo)) continue;
      evento.fotos.push({ archivo, alt: "[PENDIENTE: describir lo que muestra la foto]" });
      agregadas++;
    }
    evento.portada ??= importadas[0];
    writeFileSync(rutaJson, JSON.stringify(evento, null, 2) + "\n");
  }

  console.log(`✓ ${importadas.length} foto(s) importadas en content/eventos/${slug}/fotos/`);
  if (existsSync(rutaJson)) {
    console.log(`  ${agregadas} agregada(s) a evento.json con alt [PENDIENTE]: complete cada alt.`);
  } else {
    console.log(
      "  No existe evento.json todavía: créelo (vea content/LEEME.md) y vuelva a importar.",
    );
  }
  if (avisos.length) {
    console.log(`\n⚠ ${avisos.length} aviso(s):`);
    for (const a of avisos) console.log(`  - ${a}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
