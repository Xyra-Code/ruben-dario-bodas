/**
 * /llms.txt: resumen del sitio en Markdown para asistentes de IA (propuesta llmstxt.org).
 * Se genera al compilar desde content/, así cada evento nuevo aparece solo. Es un
 * complemento: lo que más pesa para las IA son los datos estructurados y las preguntas
 * frecuentes de cada página.
 */
import { obtenerContenido } from "@/lib/contenido/cargar";
import { urlAbsoluta } from "@/lib/seo/metadatos";
import { PAGINAS } from "@/lib/seo/paginas";
import { RUTA_SERVICIO, RUTA_VESTIDOS, rutaEvento } from "@/lib/rutas";

export const dynamic = "force-static";

export function GET() {
  const { sitio, servicios, vestidos, eventos, preguntasGenerales, lugares, guiaLugares, sobre } =
    obtenerContenido();
  const enlace = (texto: string, ruta: string) => `[${texto}](${urlAbsoluta(ruta)})`;
  const whatsapp = `https://wa.me/${sitio.whatsapp}`;

  const lineas = [
    `# ${sitio.nombre}`,
    "",
    `> Wedding planner, diseño y decoración de bodas y fiestas de 15 años, y vestidos de novia a medida en ${sitio.cobertura.resumen} (Colombia). ${sitio.lema}`,
    "",
    `- Sitio: ${sitio.dominioVisible}`,
    `- Centro de operación: ${sitio.cobertura.sede} (Meta)`,
    ...sitio.cobertura.zonas.map((z) => `- Cobertura en ${z.nombre}: ${z.municipios.join(", ")}`),
    `- Cotizaciones por WhatsApp: ${whatsapp} (indica fecha, lugar, número de invitados y presupuesto)`,
    `- Teléfono: ${sitio.telefono.visible}`,
    ...Object.entries(sitio.redes).map(([red, url]) => `- ${red}: ${url}`),
    "",
    "## Servicios",
    "",
    ...servicios.map(
      (s) =>
        `- ${enlace(s.nombre, RUTA_SERVICIO[s.tipo]!)}: ${s.seo.description} Inversión desde ${s.inversion.desde}.`,
    ),
    `- ${enlace(vestidos.nombre, RUTA_VESTIDOS)}: ${vestidos.seo.description} Inversión desde ${vestidos.inversion.desde}.`,
    "",
    "## Portafolio de eventos",
    "",
    ...eventos.map(
      (e) => `- ${enlace(e.titulo, rutaEvento(e.slug))}: estilo ${e.estilo.toLowerCase()}.`,
    ),
    "",
    "## Preguntas frecuentes",
    "",
    ...preguntasGenerales.flatMap((p) => [`### ${p.pregunta}`, "", p.respuesta, ""]),
    ...[
      ...servicios.map((s) => s.preguntas),
      vestidos.preguntas,
      guiaLugares.preguntas ?? [],
      sobre.preguntas ?? [],
    ].flatMap((lista) => lista.flatMap((p) => [`### ${p.pregunta}`, "", p.respuesta, ""])),
    "## Más información",
    "",
    `- ${enlace("Sobre Rubén Darío", PAGINAS.sobre.ruta)}: historia y equipo.`,
    `- ${enlace("Lugares para bodas en Villavicencio y el Meta", PAGINAS.lugares.ruta)}: ${lugares.filter((l) => l.enGuia).length} haciendas, fincas y salones con montajes reales.`,
    `- ${enlace("Todos los eventos", PAGINAS.eventos.ruta)}`,
    "",
  ];

  return new Response(lineas.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
