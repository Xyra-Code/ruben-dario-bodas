/**
 * Piezas de los testimonios que usan la página del evento, el inicio y las de servicio:
 * qué foto los acompaña, cuáles van en cada página y la frase corta de las tarjetas.
 */
import type { Evento } from "@/lib/contenido/cargar";
import type { Testimonio, TipoEvento } from "@/lib/contenido/esquemas";
import { obtenerImagen } from "@/lib/imagenes";

/**
 * Foto del testimonio: la elegida en testimonios.json (`foto`) o, si no hay, una automática
 * que nunca es la portada (ya se vio arriba en la página del evento). Prefiere una de la
 * pareja (sin la de Rubén Darío con los novios, ni las de los capítulos especiales) y,
 * entre ellas, una vertical, que en un recorte vertical no corta a nadie. Si no hay,
 * cualquier otra vertical; luego cualquier otra.
 */
export function fotoDelTestimonio(e: Evento, t: Testimonio) {
  if (t.foto) {
    const elegida = e.fotos.find((f) => f.archivo === t.foto!.archivo)!;
    const encuadre = t.foto.encuadre;
    return { ...elegida, posicion: encuadre === undefined ? undefined : `${encuadre}% 50%` };
  }
  const enCapitulos = new Set(e.especial?.capitulos.flatMap((c) => c.fotos) ?? []);
  const vertical = (archivo: string) => {
    const { ancho, alto } = obtenerImagen(e.slug, archivo);
    return alto > ancho;
  };
  const otras = e.fotos.filter((f) => f.archivo !== e.portada && !enCapitulos.has(f.archivo));
  const pareja = otras.filter((f) => /pareja/.test(f.archivo) && !/disenador/.test(f.archivo));
  const foto =
    pareja.find((f) => vertical(f.archivo)) ??
    pareja[0] ??
    otras.find((f) => vertical(f.archivo)) ??
    otras[0] ??
    e.fotos.find((f) => f.archivo === e.portada)!;
  return { ...foto, posicion: undefined };
}

/**
 * Testimonios del inicio (con su evento): el destacado (`inicio: "destacado"`, o el
 * primero) y tres cortos, primero los fijos y luego sorteados. El sorteo ocurre al
 * compilar: cada despliegue muestra otros, y todos los visitantes ven los mismos.
 */
export function testimoniosDelInicio(testimonios: Testimonio[], eventos: Evento[]) {
  const conEvento = testimonios.flatMap((t) => {
    const evento = eventos.find((e) => e.slug === t.evento);
    return evento ? [{ testimonio: t, evento }] : [];
  });
  const destacado =
    conEvento.find(({ testimonio }) => testimonio.inicio === "destacado") ?? conEvento[0];
  const resto = conEvento.filter((x) => x !== destacado);
  const fijos = resto.filter(({ testimonio }) => testimonio.inicio === "fijo");
  const sorteados = resto
    .filter(({ testimonio }) => testimonio.inicio !== "fijo")
    .map((x) => ({ x, orden: Math.random() }))
    .sort((a, b) => a.orden - b.orden)
    .map(({ x }) => x);
  return { destacado, cortos: [...fijos, ...sorteados].slice(0, 3) };
}

/**
 * Testimonios de /bodas o /quince-anos (con su evento): un destacado distinto del inicio
 * (`servicio: "destacado"`, o el primero del tipo que no sea el destacado del inicio) y
 * tres cortos sorteados al compilar. Con menos de tres, no hay destacado: todos iguales.
 */
export function testimoniosDelServicio(
  tipo: TipoEvento,
  testimonios: Testimonio[],
  eventos: Evento[],
) {
  const conEvento = testimonios.flatMap((t) => {
    const evento = t.tipo === tipo ? eventos.find((e) => e.slug === t.evento) : undefined;
    return evento ? [{ testimonio: t, evento }] : [];
  });
  const sortear = (lista: typeof conEvento) =>
    lista
      .map((x) => ({ x, orden: Math.random() }))
      .sort((a, b) => a.orden - b.orden)
      .map(({ x }) => x)
      .slice(0, 3);
  if (conEvento.length < 3) return { destacado: undefined, cortos: sortear(conEvento) };

  const destacado =
    conEvento.find(({ testimonio }) => testimonio.servicio === "destacado") ??
    conEvento.find(({ testimonio }) => testimonio.inicio !== "destacado")!;
  return { destacado, cortos: sortear(conEvento.filter((x) => x !== destacado)) };
}

/**
 * Frase corta para las tarjetas del inicio: las primeras oraciones del extracto (o del
 * texto) hasta pasar ~70 caracteres. Así se leen tres seguidas sin hacer un muro.
 */
export function fraseCorta(t: Testimonio) {
  const base = t.extracto ?? t.texto;
  const oraciones = base.match(/[^.!?]+[.!?]+/g)?.map((o) => o.trim()) ?? [base];
  let frase = "";
  for (const o of oraciones) {
    frase = frase ? `${frase} ${o}` : o;
    if (frase.length >= 70) break;
  }
  return frase;
}
