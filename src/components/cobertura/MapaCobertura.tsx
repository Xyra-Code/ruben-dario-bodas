import type { ReactNode } from "react";

import { ROTULOS, MUNICIPIOS } from "@/components/cobertura/lugares-mapa";
import { DEPARTAMENTOS, ESCALA, RECORTE, VIEWBOX } from "@/components/cobertura/trazos";
import { ZonasInteractivas } from "@/components/cobertura/ZonasInteractivas";

type Zona = { nombre: string; etiqueta?: string; tipo?: string; municipios: string[] };

type Props = {
  /** Antetítulo, h2 e intro de la sección: arriba de la columna de texto. */
  encabezado: ReactNode;
  /** Enlace al final de la columna de texto (guía de lugares). */
  accion?: ReactNode;
  zonas: Zona[];
  /** Municipio desde donde se opera (Villavicencio): punto destacado y origen de las rutas. */
  sede: string;
};

const xy = ([lat, lon]: [number, number]) =>
  [(lon - RECORTE.oeste) * ESCALA, (RECORTE.norte - lat) * ESCALA] as const;

function coordenadas(municipio: string) {
  const c = MUNICIPIOS[municipio];
  if (!c)
    throw new Error(
      `Mapa de cobertura: falta la ubicación de "${municipio}" en src/components/cobertura/lugares-mapa.ts`,
    );
  return xy(c);
}

/** Texto legible sobre el mapa: halo del color del fondo detrás de las letras. */
const halo = "stroke-marfil [paint-order:stroke] [stroke-linejoin:round]";
const atenuar =
  "transition-[fill,opacity] duration-300 group-data-activa/mapa:not-data-on:opacity-40";

/**
 * Cobertura: lista de zonas (el texto que lee Google y el lector de pantalla) y un mapa SVG
 * propio de la región, sin servicios externos. Al pasar el cursor o tocar una zona se
 * resalta en ambos. El mapa es decorativo (aria-hidden): la lista dice lo mismo.
 */
export function MapaCobertura({ encabezado, accion, zonas, sede }: Props) {
  const zonaSede = zonas.find((z) => z.municipios.includes(sede))?.nombre;
  // Se pinta el departamento entero solo si se cubre entero (el de la sede y Bogotá D.C.);
  // en los demás (Sabana de Bogotá, Villanueva en Casanare) va un halo sobre sus municipios,
  // para no dar a entender que se cubre todo el departamento.
  const parcial = (z: Zona) => z.nombre !== zonaSede && z.tipo !== "distrito";
  const cubiertas = new Set(zonas.map((z) => z.nombre));
  const rellenas = new Set(zonas.filter((z) => !parcial(z)).map((z) => z.nombre));
  const [sx, sy] = coordenadas(sede);
  // Lista: la sede primero, luego las zonas de un solo municipio (van en pareja) y al final
  // las demás. sort es estable: dentro de cada grupo se respeta el orden de sitio.json.
  const grupo = (z: Zona) => (z.nombre === zonaSede ? 0 : z.municipios.length === 1 ? 1 : 2);
  const enLista = [...zonas].sort((a, b) => grupo(a) - grupo(b));

  const halos = zonas.filter(parcial).map((z) => {
    const pts = z.municipios.map(coordenadas);
    const cx = pts.reduce((a, [x]) => a + x, 0) / pts.length;
    const cy = pts.reduce((a, [, y]) => a + y, 0) / pts.length;
    const r = Math.max(...pts.map(([x, y]) => Math.hypot(x - cx, y - cy))) + 18;
    return { zona: z.nombre, cx, cy, r };
  });

  // Una ruta por zona hacia su primer municipio (salvo la zona de la sede).
  const rutas = zonas
    .filter((z) => z.nombre !== zonaSede)
    .map((z) => {
      const [x, y] = coordenadas(z.municipios[0]);
      // Curva suave: punto de control desplazado en perpendicular a la línea recta.
      const mx = (sx + x) / 2 - (y - sy) * 0.25;
      const my = (sy + y) / 2 + (x - sx) * 0.25;
      return { zona: z.nombre, d: `M${sx} ${sy}Q${mx} ${my} ${x} ${y}` };
    });

  // Primero los vecinos, luego las zonas cubiertas (Bogotá encima de Cundinamarca).
  const orden = Object.keys(DEPARTAMENTOS).sort(
    (a, b) =>
      Number(rellenas.has(a)) - Number(rellenas.has(b)) ||
      Number(a === "Bogotá D.C.") - Number(b === "Bogotá D.C."),
  );

  return (
    // Escritorio: texto (encabezado, zonas, nota) a la izquierda y el mapa a la derecha, a
    // toda la altura. Celular: encabezado, mapa, zonas en dos columnas y nota.
    <ZonasInteractivas className="grid gap-10 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-x-12">
      {/* En escritorio el título va un poco más pequeño que en otras secciones: comparte la
          fila con el mapa y, a tamaño completo, ocupaba 4 líneas. */}
      <div className="min-w-0 lg:self-end lg:[&_h2]:text-[calc(var(--text-titulo-2)*0.9)]">
        {encabezado}
      </div>

      <div className="order-last min-w-0 lg:order-none lg:col-start-1 lg:self-start">
        {/* Zonas con varios municipios a todo el ancho; las de uno solo, de a dos por fila.
            Orden: sede (Meta) · Bogotá D.C. y Casanare · Sabana de Bogotá. */}
        <ul className="grid grid-cols-2 gap-x-6">
          {enLista.map((z) => (
            <li
              key={z.nombre}
              data-zona={z.nombre}
              className={`min-w-0 cursor-default border-t border-dorado/50 py-4 transition-[border-color,opacity] duration-300 group-data-activa/mapa:not-data-on:opacity-55 data-on:border-terracota ${z.municipios.length > 1 ? "col-span-2" : ""}`}
            >
              <h3 className="flex items-start gap-2.5 font-titulo text-[1.375rem] leading-tight">
                <span
                  aria-hidden
                  className={`mt-[0.4em] size-2.5 shrink-0 rounded-[2px] ${z.nombre === zonaSede ? "bg-terracota/60" : "bg-terracota/30"}`}
                />
                <span className="min-w-0">{z.etiqueta ?? z.nombre}</span>
              </h3>
              <p className="mt-1.5 text-sm text-topo sm:text-base">
                {z.municipios
                  .map((m, i) => (
                    // El separador va pegado al municipio anterior: ninguna línea empieza con "·".
                    <span key={m} className="whitespace-nowrap">
                      {m === sede ? <strong className="font-medium text-carbon">{m}</strong> : m}
                      {i < z.municipios.length - 1 && " ·"}
                    </span>
                  ))
                  .flatMap((el, i) => (i ? [" ", el] : [el]))}
              </p>
            </li>
          ))}
        </ul>
        {/* Nota y enlace a la guía en una línea si caben; si no, el enlace baja solo. */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-dorado/50 pt-4">
          <p className="min-w-0 text-sm text-topo">¿Tu evento es en otro lugar? Escríbenos.</p>
          {accion && <div className="shrink-0">{accion}</div>}
        </div>
      </div>

      <figure className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
        <svg
          viewBox={VIEWBOX}
          className="h-auto w-full overflow-hidden rounded-sm bg-rubor"
          aria-hidden
          focusable="false"
        >
          {orden.map((nombre) => {
            const cubierta = rellenas.has(nombre);
            const fondo = !cubierta
              ? "fill-marfil"
              : nombre === zonaSede
                ? "fill-terracota/45 data-on:fill-terracota/70"
                : "fill-terracota/25 data-on:fill-terracota/55";
            return (
              <path
                key={nombre}
                d={DEPARTAMENTOS[nombre]}
                data-zona={cubierta ? nombre : undefined}
                className={`${fondo} stroke-rubor [stroke-width:2] ${cubierta ? `cursor-pointer ${atenuar}` : ""}`}
              >
                {cubierta && (
                  <title>{zonas.find((z) => z.nombre === nombre)?.etiqueta ?? nombre}</title>
                )}
              </path>
            );
          })}

          {/* Zonas parciales: halo sobre sus municipios */}
          {halos.map((h) => (
            <circle
              key={h.zona}
              cx={h.cx}
              cy={h.cy}
              r={h.r}
              data-zona={h.zona}
              className={`cursor-pointer fill-terracota/25 stroke-terracota/60 [stroke-width:1.5] [stroke-dasharray:4_4] data-on:fill-terracota/50 ${atenuar}`}
            >
              <title>{zonas.find((z) => z.nombre === h.zona)?.etiqueta ?? h.zona}</title>
            </circle>
          ))}

          {/* Rutas desde la sede */}
          {rutas.map((r) => (
            <path
              key={r.zona}
              d={r.d}
              data-zona={r.zona}
              className={`fill-none stroke-terracota-profundo/70 [stroke-width:2] [stroke-dasharray:6_6] ${atenuar}`}
            />
          ))}

          {/* Nombres de departamentos */}
          {Object.entries(ROTULOS).map(([nombre, r]) => {
            const [x, y] = xy(r.pos);
            // Nombre de zona (estilo título) o departamento de referencia (versalitas).
            const cubierta = rellenas.has(nombre) || (cubiertas.has(nombre) && !!r.texto);
            return (
              <text
                key={nombre}
                x={x}
                y={y}
                textAnchor="middle"
                data-zona={cubierta ? nombre : undefined}
                className={
                  cubierta
                    ? `pointer-events-none fill-carbon font-titulo text-[26px] ${halo} [stroke-width:5] ${atenuar}`
                    : "pointer-events-none fill-topo text-[15px] tracking-[0.18em] uppercase"
                }
              >
                {r.texto ?? nombre}
              </text>
            );
          })}

          {/* Municipios */}
          {zonas.flatMap((z) =>
            z.municipios
              .filter((m) => m !== sede)
              .map((m) => {
                const [x, y] = coordenadas(m);
                return (
                  <circle
                    key={m}
                    cx={x}
                    cy={y}
                    r={6}
                    data-zona={z.nombre}
                    className={`cursor-pointer fill-terracota-profundo stroke-marfil [stroke-width:2] ${atenuar}`}
                  >
                    <title>{m}</title>
                  </circle>
                );
              }),
          )}

          {/* Rótulos de puntos clave: Bogotá y los municipios sueltos de otros departamentos */}
          {zonas
            .filter((z) => z.nombre !== zonaSede && z.municipios.length === 1)
            .map((z) => {
              const m = z.municipios[0];
              const [x, y] = coordenadas(m);
              const izquierda = x < sx;
              return (
                <text
                  key={m}
                  x={x + (izquierda ? -12 : 12)}
                  y={y + 6}
                  textAnchor={izquierda ? "end" : "start"}
                  data-zona={z.nombre}
                  className={`pointer-events-none fill-carbon text-[19px] font-medium ${halo} [stroke-width:4] ${atenuar}`}
                >
                  {m}
                </text>
              );
            })}

          {/* Sede */}
          <g data-zona={zonaSede} className={atenuar}>
            <circle cx={sx} cy={sy} r={18} className="fill-terracota/20" />
            <circle cx={sx} cy={sy} r={8} className="fill-terracota stroke-marfil [stroke-width:3]">
              <title>{sede}</title>
            </circle>
            <text
              x={sx + 14}
              y={sy + 30}
              className={`pointer-events-none fill-carbon text-[21px] font-semibold ${halo} [stroke-width:4]`}
            >
              {sede}
            </text>
          </g>
        </svg>
        <figcaption className="mt-3 text-sm text-topo">
          Toca o pasa el cursor por una zona para verla en el mapa.
        </figcaption>
      </figure>
    </ZonasInteractivas>
  );
}
