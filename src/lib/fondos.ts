/**
 * Sistema de color de las secciones (docs/brief-diseno.md §4.1):
 * - Marfil: contenido de lectura. Nunca más de dos seguidas; la línea divisoria va solo
 *   entre dos marfil (entre marfil y rubor ya separa el cambio de color).
 * - Rubor: prueba de trabajo (portafolio, testimonios, un vestido real) y bloques que
 *   cortan el ritmo. Nunca dos seguidas.
 * - Terracota: solo el cierre de conversión (#contacto), lo pone SeccionContacto.
 * - Bosque: solo la franja de la boda especial.
 *
 * Como las secciones dependen del contenido (una página de servicio sin galería, un evento
 * sin testimonio), los fondos se calculan con las que existen, no a mano.
 */

export type Tono = "marfil" | "rubor";

/** Clases de fondo de cada tono. El rubor lleva el grano de papel del sitio. */
const RUBOR = "bg-rubor grano";
const LINEA = "border-t border-linea";

/**
 * Fondos de un tramo de secciones seguidas. La sección anterior al tramo (la portada o
 * "Sobre el diseño") es siempre marfil.
 * @param secciones En orden; `prueba` = va siempre en rubor.
 * @param primero Tono de la primera sección si no es prueba.
 */
export function fondos(secciones: { prueba?: boolean }[], primero: Tono = "rubor"): string[] {
  const tonos: Tono[] = [];
  secciones.forEach((s, i) => {
    const siguienteEsPrueba = secciones[i + 1]?.prueba ?? false;
    if (s.prueba) tonos.push("rubor");
    else if (i === 0) tonos.push(siguienteEsPrueba ? "marfil" : primero);
    // Tras rubor, marfil. Tras marfil, rubor, salvo que la siguiente sea prueba (rubor).
    else tonos.push(tonos[i - 1] === "rubor" || siguienteEsPrueba ? "marfil" : "rubor");
  });
  return tonos.map((t, i) => {
    if (t === "rubor") return RUBOR;
    const anterior = i === 0 ? "marfil" : tonos[i - 1];
    return anterior === "marfil" ? LINEA : "";
  });
}

/** true si la clase de fondo es rubor (para invertir el fondo de las tarjetas internas). */
export const esRubor = (clase: string) => clase === RUBOR;
