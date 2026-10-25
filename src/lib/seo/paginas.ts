/**
 * SEO de las páginas que no salen de un archivo de content/ (los servicios y los eventos
 * traen el suyo). Fuente: docs/mapa-del-sitio.md §4. Un solo H1 por página, con palabra
 * clave + ciudad.
 */
export const PAGINAS = {
  inicio: {
    ruta: "/",
    h1: "Diseño y decoración de eventos en Villavicencio y el Meta",
    titulo: "Rubén Darío Diseñador de Bodas · Decoración en Villavicencio",
    descripcion:
      "Wedding planner, decoración de bodas y fiestas de 15 años y vestidos de novia en Villavicencio, el Meta y la Sabana de Bogotá. Cotiza por WhatsApp.",
  },
  eventos: {
    ruta: "/eventos",
    h1: "Bodas y 15 años decorados en Villavicencio y el Meta",
    titulo: "Eventos decorados en Villavicencio y el Meta | Rubén Darío",
    descripcion:
      "Bodas y fiestas de 15 años diseñadas por Rubén Darío en haciendas, fincas y salones del Meta y la Sabana de Bogotá. Filtra por tipo, municipio y estilo.",
  },
  sobre: {
    ruta: "/sobre-ruben-dario",
    h1: "Rubén Darío, diseñador de bodas en Villavicencio",
    titulo: "Rubén Darío, diseñador de bodas en Villavicencio",
    descripcion:
      "Conoce a Rubén Darío, diseñador de bodas y de vestidos de novia en Villavicencio: su historia en la alta costura, su equipo y los eventos que lo marcaron.",
  },
  lugares: {
    ruta: "/lugares-para-bodas-villavicencio",
    h1: "Lugares para bodas en Villavicencio y el Meta",
    titulo: "Lugares para bodas en Villavicencio y el Meta | Rubén Darío",
    descripcion:
      "Guía de haciendas, fincas y salones para bodas en Villavicencio y el Meta, con montajes reales y consejos para decorar cada tipo de lugar.",
  },
  politica: {
    ruta: "/politica-de-datos",
    h1: "Política de tratamiento de datos personales",
    titulo: "Política de tratamiento de datos | Rubén Darío Diseñador de Bodas",
    descripcion:
      "Política de tratamiento de datos personales de Rubén Darío Diseñador de Bodas, conforme a la Ley 1581 de 2012: finalidades, derechos y canales de contacto.",
  },
} as const;

export type ClavePagina = keyof typeof PAGINAS;
