/** Formatos de texto para mostrar datos del negocio. */
import type { Sitio } from "@/lib/contenido/esquemas";

const DIAS = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"] as const;
const NOMBRE_DIA: Record<(typeof DIAS)[number], string> = {
  lunes: "lunes",
  martes: "martes",
  miercoles: "miércoles",
  jueves: "jueves",
  viernes: "viernes",
  sabado: "sábado",
  domingo: "domingo",
};

const mayuscula = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

/** ["lunes", …, "viernes"] → "Lunes a viernes"; días sueltos → "Lunes, miércoles y viernes". */
export function textoDias(dias: Sitio["horario"][number]["dias"]) {
  const indices = dias.map((d) => DIAS.indexOf(d)).sort((a, b) => a - b);
  const seguidos = indices.every((d, i) => i === 0 || d === indices[i - 1] + 1);
  if (indices.length > 2 && seguidos) {
    return mayuscula(`${NOMBRE_DIA[DIAS[indices[0]]]} a ${NOMBRE_DIA[DIAS[indices.at(-1)!]]}`);
  }
  const nombres = indices.map((i) => NOMBRE_DIA[DIAS[i]]);
  const texto =
    nombres.length > 1 ? `${nombres.slice(0, -1).join(", ")} y ${nombres.at(-1)}` : nombres[0];
  return mayuscula(texto);
}

/** "08:00" → "8:00 a. m."; "18:30" → "6:30 p. m." (formato usual en Colombia). */
export function textoHora(hora: string) {
  const [h, m] = hora.split(":").map(Number);
  const sufijo = h < 12 ? "a. m." : "p. m.";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${sufijo}`;
}

export const esEnlace = (valor: string) => /^https?:\/\//.test(valor);
