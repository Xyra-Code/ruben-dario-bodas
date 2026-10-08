/**
 * Valida /content antes de compilar.
 *   npm run validar               desarrollo: borradores y [PENDIENTE] son avisos
 *   npm run validar -- --estricto antes de publicar: también son errores
 */
import { validarContenido } from "../src/lib/contenido/cargar";

const estricto = process.argv.includes("--estricto");
const { contenido, errores, avisos } = validarContenido({ estricto });

if (avisos.length) {
  console.log(`\n⚠ ${avisos.length} aviso(s):`);
  for (const a of avisos) console.log(`  - ${a}`);
}

if (errores.length) {
  console.error(`\n✖ ${errores.length} error(es) en el contenido:`);
  for (const e of errores) console.error(`  - ${e}`);
  console.error("");
  process.exit(1);
}

const c = contenido!;
console.log(
  `\n✓ Contenido válido${estricto ? " (estricto)" : ""}: ${c.eventos.length} eventos, ` +
    `${c.lugares.length} lugares, ${c.testimonios.length} testimonios, ` +
    `${c.preguntasGenerales.length} preguntas generales.\n`,
);
