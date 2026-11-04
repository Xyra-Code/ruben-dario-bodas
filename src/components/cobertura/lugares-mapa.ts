/**
 * Coordenadas (latitud, longitud) de los municipios de content/sitio.json → cobertura.
 * Al agregar un municipio a la cobertura hay que agregarlo aquí: si falta, el build falla
 * con un mensaje claro (mejor que un punto que no aparece en el mapa).
 */
export const MUNICIPIOS: Record<string, [number, number]> = {
  // Meta
  Villavicencio: [4.142, -73.627],
  Restrepo: [4.258, -73.565],
  Acacías: [3.987, -73.765],
  Cumaral: [4.27, -73.487],
  "Puerto López": [4.085, -72.957],
  Granada: [3.546, -73.707],
  Guamal: [3.88, -73.766],
  // Bogotá y la Sabana
  Bogotá: [4.711, -74.072],
  Chía: [4.861, -74.059],
  Tenjo: [4.872, -74.144],
  Subachoque: [4.928, -74.173],
  Cajicá: [4.918, -74.028],
  // Casanare
  Villanueva: [4.611, -72.928],
};

/** Dónde va el nombre de cada departamento en el mapa (cubiertos y vecinos de referencia). */
export const ROTULOS: Record<string, { pos: [number, number]; texto?: string }> = {
  Meta: { pos: [3.0, -72.7] },
  Casanare: { pos: [5.55, -71.7] },
  Cundinamarca: { pos: [5.38, -73.98], texto: "Sabana de Bogotá" },
  Boyacá: { pos: [6.15, -73.2] },
  Vichada: { pos: [4.3, -70.5] },
  Guaviare: { pos: [1.9, -72.0] },
};
