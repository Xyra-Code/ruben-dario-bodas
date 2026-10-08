// Cuenta los archivos de ./out contra los topes del plan Free de Cloudflare Workers
// (20.000 archivos por despliegue, 25 MiB por archivo). Corre después de cada build.
import { readdirSync, statSync } from "node:fs";
import path from "node:path";

const TOPE_ARCHIVOS = 20_000;
const TOPE_BYTES = 25 * 1024 * 1024;

let archivos = 0;
const grandes = [];
const recorrer = (dir) => {
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    const ruta = path.join(dir, entrada.name);
    if (entrada.isDirectory()) recorrer(ruta);
    else {
      archivos++;
      if (statSync(ruta).size > TOPE_BYTES) grandes.push(ruta);
    }
  }
};
recorrer("out");

const uso = ((archivos / TOPE_ARCHIVOS) * 100).toFixed(1);
if (archivos > TOPE_ARCHIVOS || grandes.length) {
  console.error(`✖ out/: ${archivos} archivos (tope ${TOPE_ARCHIVOS}).`);
  for (const g of grandes) console.error(`  - Más de 25 MiB: ${g}`);
  process.exit(1);
}
const mensaje = `out/: ${archivos} archivos, ${uso}% del tope de Cloudflare (${TOPE_ARCHIVOS}).`;
console.log(
  archivos > TOPE_ARCHIVOS * 0.75 ? `⚠ ${mensaje} Considere Workers Paid.` : `✓ ${mensaje}`,
);
