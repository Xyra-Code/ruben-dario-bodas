/**
 * /llms.txt: resumen del sitio en Markdown para asistentes de IA (propuesta llmstxt.org).
 * Se genera al compilar desde content/, así cada evento nuevo aparece solo. Es un
 * complemento: lo que más pesa para las IA son los datos estructurados y las preguntas
 * frecuentes de cada página.
 */
import { obtenerContenido } from "@/lib/contenido/cargar";
import { urlAbsoluta } from "@/lib/seo/metadatos";
import { PAGINAS } from "@/lib/seo/paginas";
import { RUTA_SERVICIO, rutaEvento } from "@/lib/rutas";

export const dynamic = "force-static";

export function GET() {
  const { sitio, servicios, eventos, preguntasGenerales, lugares } = obtenerContenido();
  const enlace = (texto: string, ruta: string) => `[${texto}](${urlAbsoluta(ruta)})`;
  const whatsapp = `https://wa.me/${sitio.whatsapp}`;

  const lineas = [
    `# ${sitio.nombre}`,
    "",
    `> Diseño y decoración de bodas y fiestas de 15 años en ${sitio.cobertura.resumen} (Colombia). ${sitio.lema}`,
    "",
    `- Sitio: ${sitio.dominioVisible}`,
    `- Centro de operación: ${sitio.cobertura.sede} (Meta)`,
    ...sitio.cobertura.zonas.map((z) => `- Cobertura en ${z.nombre}: ${z.municipios.join(", ")}`),
    `- Cotizaciones por WhatsApp: ${whatsapp} (indique fecha, lugar y número de invitados)`,
    `- Teléfono: ${sitio.telefono.visible}`,
    ...Object.entries(sitio.redes).map(([red, url]) => `- ${red}: ${url}`),
    "",
    "## Servicios",
    "",
    ...servicios.map(
      (s) =>
        `- ${enlace(s.nombre, RUTA_SERVICIO[s.tipo]!)}: ${s.seo.description} Inversión desde ${s.inversion.desde}.`,
    ),
    "",
    "## Portafolio de eventos",
    "",
    ...eventos.map(
      (e) =>
        `- ${enlace(e.titulo, rutaEvento(e.slug))}: estilo ${e.estilo.toLowerCase()}, ${e.fechaTexto}.`,
    ),
    "",
    "## Preguntas frecuentes",
    "",
    ...preguntasGenerales.flatMap((p) => [`### ${p.pregunta}`, "", p.respuesta, ""]),
    ...servicios.flatMap((s) =>
      s.preguntas.flatMap((p) => [`### ${p.pregunta}`, "", p.respuesta, ""]),
    ),
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
