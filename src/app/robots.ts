import type { MetadataRoute } from "next";

import { urlAbsoluta } from "@/lib/seo/metadatos";

export const dynamic = "force-static";

/**
 * Todo el sitio es público. Los asistentes de IA se permiten de forma explícita: a un
 * negocio local le conviene que ChatGPT, Claude, Perplexity o Gemini lo recomienden.
 * Ojo: Cloudflare puede bloquear bots de IA por su cuenta (opción del panel); revisarla
 * en el lanzamiento o este archivo no basta.
 */
const ASISTENTES_IA = [
  "OAI-SearchBot", // búsqueda de ChatGPT
  "ChatGPT-User",
  "GPTBot",
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended", // Gemini
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: ASISTENTES_IA, allow: "/" },
    ],
    sitemap: urlAbsoluta("/sitemap.xml"),
  };
}
