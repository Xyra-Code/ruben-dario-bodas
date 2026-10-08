/**
 * Genera las fotos web de los eventos (corre antes de cada build):
 *   - WebP en los anchos de ANCHOS (sin agrandar fotos más pequeñas).
 *   - Color dominante y miniatura borrosa para mostrar mientras carga.
 *   - Manifiesto con medidas: src/generado/imagenes.json.
 *   - Imágenes para compartir (Open Graph, 1200×630 JPEG): una por evento y la del sitio.
 *   - Borra lo generado de fotos o eventos que ya no existen (una foto retirada no
 *     debe seguir publicada: Ley 1581).
 * Es incremental: solo procesa las fotos nuevas o modificadas.
 */
import { existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { availableParallelism } from "node:os";
import path from "node:path";
import sharp from "sharp";

import { validarContenido } from "../src/lib/contenido/cargar";
import {
  ANCHOS,
  CARPETA_OG,
  CARPETA_PUBLICA,
  MANIFIESTO,
  OG,
  base,
  clave,
  rutaPublica,
  type Imagen,
} from "../src/lib/imagenes";

const CALIDAD_WEBP = 78;
const MARFIL = "#FAF7F2";

/**
 * Open Graph sin texto: solo foto + monograma (vectores). Así no depende de las fuentes
 * instaladas en la máquina que compila; el título del evento lo muestra WhatsApp aparte.
 */
async function generarOg(eventos: { slug: string; portada: string }[]) {
  rmSync(CARPETA_OG, { recursive: true, force: true });
  mkdirSync(path.join(CARPETA_OG, "eventos"), { recursive: true });

  const logo = await sharp("public/marca/logo-vertical.svg", { density: 300 })
    .resize({ height: 440 })
    .png()
    .toBuffer();
  await sharp({ create: { width: OG.ancho, height: OG.alto, channels: 3, background: MARFIL } })
    .composite([{ input: logo, gravity: "center" }])
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(path.join(CARPETA_OG, "sitio.jpg"));

  const lado = 112;
  const monograma = await sharp("public/marca/monograma.svg", { density: 300 })
    .resize(lado, lado)
    .png()
    .toBuffer();
  for (const { slug, portada } of eventos) {
    await sharp(portada)
      .rotate()
      .resize(OG.ancho, OG.alto, { fit: "cover", position: sharp.strategy.attention })
      .composite([{ input: monograma, left: OG.ancho - lado - 36, top: OG.alto - lado - 36 }])
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join(CARPETA_OG, "eventos", `${slug}.jpg`));
  }
  return eventos.length + 1;
}

type Tarea = { slug: string; archivo: string; origen: string };

function anchosPara(anchoOriginal: number) {
  const anchos: number[] = ANCHOS.filter((a) => a <= anchoOriginal);
  // Una foto más angosta que el mayor ancho también se publica en su tamaño real
  // (900 px → 480 y 900), para no desperdiciar resolución.
  if (anchoOriginal < ANCHOS[ANCHOS.length - 1] && !anchos.includes(anchoOriginal)) {
    anchos.push(anchoOriginal);
  }
  return anchos;
}

async function procesar({ slug, archivo, origen }: Tarea, forzar: boolean) {
  const salida = path.join(CARPETA_PUBLICA, slug);
  mkdirSync(salida, { recursive: true });

  // rotate() sin argumentos aplica la orientación EXIF.
  const { width, height } = await sharp(origen)
    .rotate()
    .toBuffer({ resolveWithObject: true })
    .then((r) => r.info);
  const modificado = statSync(origen).mtimeMs;
  const anchos = anchosPara(width);

  let generados = 0;
  for (const ancho of anchos) {
    const destino = path.join(salida, `${base(archivo)}-${ancho}.webp`);
    if (!forzar && existsSync(destino) && statSync(destino).mtimeMs >= modificado) continue;
    await sharp(origen)
      .rotate()
      .resize({ width: ancho })
      .webp({ quality: CALIDAD_WEBP })
      .toFile(destino);
    generados++;
  }

  const { dominant } = await sharp(origen).stats();
  const color = `#${[dominant.r, dominant.g, dominant.b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
  const miniatura = await sharp(origen)
    .rotate()
    .resize({ width: 16 })
    .blur(1)
    .webp({ quality: 40 })
    .toBuffer();

  const imagen: Imagen = {
    ancho: width,
    alto: height,
    color,
    lqip: `data:image/webp;base64,${miniatura.toString("base64")}`,
    variantes: anchos.map((a) => ({ ancho: a, src: rutaPublica(slug, archivo, a) })),
  };
  return { imagen, generados, esperados: anchos.map((a) => `${base(archivo)}-${a}.webp`) };
}

/** Ejecuta las tareas con un límite de concurrencia. */
async function enParalelo<T, R>(items: T[], limite: number, fn: (item: T) => Promise<R>) {
  const resultados: R[] = new Array(items.length);
  let siguiente = 0;
  const trabajador = async () => {
    while (siguiente < items.length) {
      const i = siguiente++;
      resultados[i] = await fn(items[i]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limite, items.length) }, trabajador));
  return resultados;
}

async function main() {
  const forzar = process.argv.includes("--forzar");
  const { contenido, errores } = validarContenido();
  if (!contenido) {
    console.error("✖ El contenido tiene errores; corra npm run validar.");
    for (const e of errores) console.error(`  - ${e}`);
    process.exit(1);
  }

  const tareas: Tarea[] = contenido.eventos.flatMap((e) =>
    e.fotos.map((f) => ({ slug: e.slug, archivo: f.archivo, origen: f.ruta })),
  );

  const inicio = Date.now();
  const resultados = await enParalelo(tareas, Math.max(2, availableParallelism() - 1), (t) =>
    procesar(t, forzar),
  );

  const manifiesto: Record<string, Imagen> = {};
  const esperados = new Map<string, Set<string>>();
  let generados = 0;
  tareas.forEach((t, i) => {
    manifiesto[clave(t.slug, t.archivo)] = resultados[i].imagen;
    generados += resultados[i].generados;
    const set = esperados.get(t.slug) ?? new Set<string>();
    resultados[i].esperados.forEach((n) => set.add(n));
    esperados.set(t.slug, set);
  });

  // Limpieza: eventos o fotos retirados.
  let borrados = 0;
  if (existsSync(CARPETA_PUBLICA)) {
    for (const carpeta of readdirSync(CARPETA_PUBLICA)) {
      const validos = esperados.get(carpeta);
      const ruta = path.join(CARPETA_PUBLICA, carpeta);
      if (!validos) {
        borrados += readdirSync(ruta).length;
        rmSync(ruta, { recursive: true, force: true });
        continue;
      }
      for (const archivo of readdirSync(ruta)) {
        if (!validos.has(archivo)) {
          rmSync(path.join(ruta, archivo));
          borrados++;
        }
      }
    }
  }

  mkdirSync(path.dirname(MANIFIESTO), { recursive: true });
  writeFileSync(MANIFIESTO, JSON.stringify(manifiesto, null, 2) + "\n");

  const og = await generarOg(
    contenido.eventos.map((e) => ({
      slug: e.slug,
      portada: e.fotos.find((f) => f.archivo === e.portada)!.ruta,
    })),
  );

  const total = [...esperados.values()].reduce((n, s) => n + s.size, 0);
  const segundos = ((Date.now() - inicio) / 1000).toFixed(1);
  console.log(
    `✓ Imágenes: ${tareas.length} fotos → ${total} archivos WebP ` +
      `(${generados} generados, ${total - generados} sin cambios, ${borrados} retirados) ` +
      `+ ${og} para compartir, en ${segundos}s`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
