// Genera los íconos del sitio a partir de public/marca/monograma.svg.
// Uso: node scripts/marca/iconos.mjs  (después de extraer-logo.py)
import { copyFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const MONOGRAMA = "public/marca/monograma.svg";
const MARFIL = "#FAF7F2";

// Monograma centrado sobre un cuadrado; `margen` es la proporción libre a cada lado.
async function png(lado, { fondo = null, margen = 0 } = {}) {
  const interior = Math.round(lado * (1 - 2 * margen));
  const mono = await sharp(MONOGRAMA, { density: 600 })
    .resize(interior, interior, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  return sharp({
    create: {
      width: lado,
      height: lado,
      channels: 4,
      background: fondo ?? { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: mono, gravity: "center" }])
    .png()
    .toBuffer();
}

// ICO con imágenes PNG embebidas (formato soportado por todos los navegadores actuales).
function ico(imagenes) {
  const cabecera = Buffer.alloc(6 + 16 * imagenes.length);
  cabecera.writeUInt16LE(0, 0);
  cabecera.writeUInt16LE(1, 2);
  cabecera.writeUInt16LE(imagenes.length, 4);
  let desplazamiento = cabecera.length;
  imagenes.forEach(({ lado, datos }, i) => {
    const o = 6 + 16 * i;
    cabecera.writeUInt8(lado >= 256 ? 0 : lado, o);
    cabecera.writeUInt8(lado >= 256 ? 0 : lado, o + 1);
    cabecera.writeUInt16LE(1, o + 4);
    cabecera.writeUInt16LE(32, o + 6);
    cabecera.writeUInt32LE(datos.length, o + 8);
    cabecera.writeUInt32LE(desplazamiento, o + 12);
    desplazamiento += datos.length;
  });
  return Buffer.concat([cabecera, ...imagenes.map((i) => i.datos)]);
}

// Convenciones de archivo de Next (app/): icon.svg, favicon.ico, apple-icon.png.
await copyFile(MONOGRAMA, "src/app/icon.svg");
const tamanos = [16, 32, 48];
const entradas = await Promise.all(tamanos.map(async (lado) => ({ lado, datos: await png(lado) })));
await writeFile("src/app/favicon.ico", ico(entradas));
// iOS no respeta transparencia: fondo marfil y margen.
await writeFile("src/app/apple-icon.png", await png(180, { fondo: MARFIL, margen: 0.12 }));
// Para el manifest (Android / "agregar a inicio").
await writeFile("public/marca/icono-192.png", await png(192, { fondo: MARFIL, margen: 0.12 }));
await writeFile("public/marca/icono-512.png", await png(512, { fondo: MARFIL, margen: 0.12 }));
console.log(
  "Íconos generados: icon.svg, favicon.ico, apple-icon.png, icono-192.png, icono-512.png",
);
