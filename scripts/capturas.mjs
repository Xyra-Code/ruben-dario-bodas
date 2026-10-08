// Capturas de QA del sitio compilado (./out) en celular, tablet y escritorio, con el Edge
// o Chrome instalado (playwright-core: no descarga navegadores). Además de las capturas,
// verifica que ninguna página tenga scroll horizontal.
//
//   npm run build && node scripts/capturas.mjs [carpeta-salida] [/ruta …]
import { createReadStream, existsSync, mkdirSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { chromium } from "playwright-core";

const salida = process.argv[2] ?? "capturas";
const rutas = process.argv.slice(3).length
  ? process.argv.slice(3)
  : ["/", "/bodas", "/eventos", "/eventos/boda-hacienda-el-caney-restrepo", "/noexiste"];

const TAMANOS = [
  { nombre: "320", width: 320, height: 640, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  { nombre: "390", width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  { nombre: "1440", width: 1440, height: 900, isMobile: false, hasTouch: false, deviceScaleFactor: 1 },
];

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};

// Servidor mínimo con las mismas reglas que Cloudflare: /bodas → bodas.html, 404.html.
const servidor = createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const candidatos = [url, `${url}.html`, path.join(url, "index.html")];
  const archivo = candidatos
    .map((c) => path.join("out", c))
    .find((c) => existsSync(c) && statSync(c).isFile());
  const final = archivo ?? path.join("out", "404.html");
  res.writeHead(archivo ? 200 : 404, {
    "Content-Type": TIPOS[path.extname(final)] ?? "application/octet-stream",
  });
  createReadStream(final).pipe(res);
});
await new Promise((r) => servidor.listen(0, r));
const base = `http://localhost:${servidor.address().port}`;

const navegador = await chromium
  .launch({ channel: "msedge" })
  .catch(() => chromium.launch({ channel: "chrome" }));
mkdirSync(salida, { recursive: true });

let desbordes = 0;
for (const t of TAMANOS) {
  const { nombre, ...opciones } = t;
  const contexto = await navegador.newContext({
    viewport: { width: opciones.width, height: opciones.height },
    ...opciones,
  });
  const pagina = await contexto.newPage();
  for (const ruta of rutas) {
    await pagina.goto(base + ruta, { waitUntil: "networkidle" });
    // Fuerza la carga de las fotos diferidas antes de capturar la página completa.
    await pagina.evaluate(async () => {
      document.querySelectorAll("img[loading=lazy]").forEach((i) => (i.loading = "eager"));
      await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
    });
    const ancho = await pagina.evaluate(() => ({
      pagina: document.documentElement.scrollWidth,
      vista: document.documentElement.clientWidth,
    }));
    const archivo = `${(ruta === "/" ? "inicio" : ruta.slice(1).replaceAll("/", "_"))}-${nombre}.png`;
    await pagina.screenshot({ path: path.join(salida, archivo), fullPage: true });
    const ok = ancho.pagina <= ancho.vista;
    if (!ok) desbordes++;
    console.log(`${ok ? "✓" : "✖ DESBORDA"} ${nombre.padStart(4)}px ${ruta}  (${ancho.pagina}/${ancho.vista})`);
  }
  await contexto.close();
}

await navegador.close();
servidor.close();
if (desbordes) {
  console.error(`\n✖ ${desbordes} página(s) con scroll horizontal`);
  process.exit(1);
}
console.log(`\nCapturas en ${salida}/`);
