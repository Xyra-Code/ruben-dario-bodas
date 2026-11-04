// Genera los trazos SVG del mapa de cobertura (departamentos alrededor del Meta) a partir
// del GeoJSON de departamentos de Colombia. Se corre una sola vez (o al cambiar el recorte):
//
//   curl -sSL -o col.json "https://gist.githubusercontent.com/john-guerra/43c7656821069d00dcbc/raw/be6a6e239cd5b5b803c6e7c2ec405b793a9064dd/Colombia.geo.json"
//   node scripts/mapa/generar-mapa.mjs col.json
//
// Escribe src/components/cobertura/trazos.ts. El GeoJSON no se guarda en el repo.

import { readFileSync, writeFileSync } from "node:fs";

// Recorte (grados): Cundinamarca al oeste, Casanare al norte y al este, Meta al sur.
export const RECORTE = { oeste: -75.1, este: -69.9, norte: 6.5, sur: 1.5 };
const ESCALA = 100; // unidades SVG por grado
const TOLERANCIA = 0.8; // simplificación en unidades SVG

/** Nombre del GeoJSON → clave estable usada en sitio.json (cobertura.zonas[].nombre). */
const NOMBRES = {
  META: "Meta",
  CUNDINAMARCA: "Cundinamarca",
  "SANTAFE DE BOGOTA D.C": "Bogotá D.C.",
  CASANARE: "Casanare",
  BOYACA: "Boyacá",
  TOLIMA: "Tolima",
  HUILA: "Huila",
  CAQUETA: "Caquetá",
  GUAVIARE: "Guaviare",
  VICHADA: "Vichada",
  ARAUCA: "Arauca",
};

const proyectar = ([lon, lat]) => [(lon - RECORTE.oeste) * ESCALA, (RECORTE.norte - lat) * ESCALA];

function distSeg(p, a, b) {
  const [x, y] = p;
  const [x1, y1] = a;
  const [x2, y2] = b;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const l = dx * dx + dy * dy;
  const t = l ? Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / l)) : 0;
  return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy));
}

function simplificar(pts, tol) {
  if (pts.length < 3) return pts;
  let max = 0;
  let idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = distSeg(pts[i], pts[0], pts[pts.length - 1]);
    if (d > max) {
      max = d;
      idx = i;
    }
  }
  if (max <= tol) return [pts[0], pts[pts.length - 1]];
  return [
    ...simplificar(pts.slice(0, idx + 1), tol).slice(0, -1),
    ...simplificar(pts.slice(idx), tol),
  ];
}

const r = (n) => Math.round(n * 10) / 10;

function anillo(coords) {
  const pts = simplificar(coords.map(proyectar), TOLERANCIA);
  if (pts.length < 4) return "";
  return "M" + pts.map(([x, y]) => `${r(x)} ${r(y)}`).join("L") + "Z";
}

function enRecorte(geom) {
  const polis = geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates;
  return polis.some((p) =>
    p[0].some(
      ([lon, lat]) =>
        lon > RECORTE.oeste - 0.5 &&
        lon < RECORTE.este + 0.5 &&
        lat > RECORTE.sur - 0.5 &&
        lat < RECORTE.norte + 0.5,
    ),
  );
}

const archivo = process.argv[2];
if (!archivo) {
  console.error("Uso: node scripts/mapa/generar-mapa.mjs <Colombia.geo.json>");
  process.exit(1);
}
const geo = JSON.parse(readFileSync(archivo, "utf8"));
const salida = {};
for (const f of geo.features) {
  const nombre = NOMBRES[f.properties.NOMBRE_DPT];
  if (!nombre || !enRecorte(f.geometry)) continue;
  const polis = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
  const d = polis
    .flatMap((p) => p.map(anillo))
    .filter(Boolean)
    .join("");
  if (d) salida[nombre] = d;
}

const ancho = r((RECORTE.este - RECORTE.oeste) * ESCALA);
const alto = r((RECORTE.norte - RECORTE.sur) * ESCALA);
const ts = `// Generado por scripts/mapa/generar-mapa.mjs. No editar a mano.

export const RECORTE = ${JSON.stringify(RECORTE)} as const;
export const ESCALA = ${ESCALA};
export const VIEWBOX = "0 0 ${ancho} ${alto}";

/** Trazos SVG de los departamentos que aparecen en el recorte. */
export const DEPARTAMENTOS: Record<string, string> = ${JSON.stringify(salida, null, 2)};
`;
writeFileSync("src/components/cobertura/trazos.ts", ts);
console.log(
  `✓ ${Object.keys(salida).length} departamentos, ${(ts.length / 1024).toFixed(1)} KB → src/components/cobertura/trazos.ts`,
);
