/**
 * SEO de las páginas que no salen de un archivo de content/ (los servicios y los eventos
 * traen el suyo). Fuente: docs/mapa-del-sitio.md §4. Un solo H1 por página, con palabra
 * clave + ciudad.
 */
export const PAGINAS = {
  inicio: {
    ruta: "/",
    h1: "Diseño y decoración de eventos en Villavicencio y el Meta",
    titulo: "Rubén Darío · Decoración de eventos en Villavicencio",
    descripcion:
      "Diseñamos y decoramos bodas y fiestas de 15 años en Villavicencio, el Meta, Bogotá y Cundinamarca. Vea nuestros eventos y cotice por WhatsApp.",
  },
  eventos: {
    ruta: "/eventos",
    h1: "Bodas y 15 años decorados en Villavicencio y el Meta",
    titulo: "Eventos decorados en Villavicencio y el Meta | Rubén Darío",
    descripcion:
      "Portafolio de bodas y fiestas de 15 años decoradas por Rubén Darío en haciendas, fincas y salones de Villavicencio y el Meta. Filtre por tipo, municipio y estilo.",
  },
  sobre: {
    ruta: "/sobre-ruben-dario",
    h1: "Rubén Darío, diseñador de bodas en Villavicencio",
    titulo: "Rubén Darío, diseñador de bodas en Villavicencio",
    descripcion:
      "Conozca a Rubén Darío, diseñador de bodas en Villavicencio: su historia, su forma de diseñar, su equipo y los eventos que marcaron su trayectoria en el Meta.",
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
