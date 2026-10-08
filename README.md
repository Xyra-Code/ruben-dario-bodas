# Rubén Darío Diseñador de Bodas · Sitio web

Sitio de **Rubén Darío Diseñador de Bodas** (Villavicencio, Meta): diseño y decoración de
bodas y fiestas de 15 años. Proyecto de **XyraCode**.

- Dominio: `rubendariodiseñadordebodas.com` (punycode `xn--rubendariodiseadordebodas-moc.com`).
- Objetivo: posicionar en Google en Villavicencio y el Meta (SEO local) y convertir
  visitas en conversaciones por WhatsApp.
- Sitio **100% estático**: sin base de datos, sin API, sin panel. Costo mensual USD 0.

Las decisiones del proyecto (alcance, comercial, infraestructura, SEO y plan) están en
[CLAUDE.md](CLAUDE.md).

## Stack

| Pieza | Herramienta |
|---|---|
| Framework | Next.js 16 con `output: "export"` (genera `./out`) |
| UI | React 19 · Tailwind CSS 4 · fuentes autoalojadas (Cormorant Garamond y Jost) |
| Contenido | Archivos JSON en `content/`, validados con zod |
| Imágenes | Pipeline propio con sharp: WebP en 480/960/1600 px, LQIP y Open Graph |
| Hosting | Cloudflare Workers (archivos estáticos, plan Free) vía wrangler |
| Contacto | Formulario que arma el mensaje y abre `wa.me` (sin servidor) |

Requiere **Node.js ≥ 20.9**.

## Comandos

```bash
npm install
npm run dev               # procesa las fotos y abre el servidor de desarrollo
npm run validar           # revisa el contenido (pendientes y borradores = avisos)
npm run build             # validar + imágenes + next build + conteo de archivos
npm run preview           # build y servidor local de Cloudflare (wrangler dev)
npm run deploy            # build de producción (estricto) y publicación en Cloudflare
npm run lint              # ESLint
npm run typecheck         # tipos de rutas + tsc
npm run format            # Prettier (con orden de clases de Tailwind)
npm run fotos:importar -- "<carpeta con originales>" <slug-del-evento>
```

`build:produccion` (el que usa `deploy`) convierte en errores los textos
`[PENDIENTE: …]` y el contenido marcado `"borrador": true`: **no se puede publicar con
contenido incompleto o de ejemplo.**

## Estructura

```
content/                 Todo el texto y las fotos del sitio (guía: content/LEEME.md)
  sitio.json             Nombre, contacto, horario, redes, cobertura (= Google Business)
  servicios/             /bodas y /quince-anos
  eventos/<slug>/        Un evento: evento.json + fotos/ (másters de 2400 px)
  sobre/ lugares.json testimonios.json proceso.json preguntas-generales.json …
src/
  app/                   Rutas, metadata, sitemap.ts, robots.ts, llms.txt, manifest
  components/            Marco, plantillas, galería con visor, formulario, tarjetas, SEO
  lib/contenido/         Esquemas zod y carga con validación cruzada
  lib/seo/               Metadata y datos estructurados (JSON-LD)
  lib/imagenes.ts        Anchos, rutas públicas y manifiesto de las fotos
  lib/whatsapp.ts        Mensajes y enlaces de WhatsApp
scripts/
  importar-fotos.ts      Originales → másters sin metadatos ni GPS
  imagenes.ts            Genera public/img/ y src/generado/imagenes.json (incremental)
  validar-contenido.ts   Valida content/ (--estricto antes de publicar)
  contar-archivos.mjs    Verifica los topes de Cloudflare (20.000 archivos, 25 MiB)
  capturas.mjs           Capturas de QA a 320/390/1440 px y control de scroll horizontal
  marca/                 Extracción del logo (PDF → SVG) e íconos
docs/                    Brief de diseño, mapa del sitio, checklist de arranque, marca
```

`public/img/`, `src/generado/` y `out/` se generan al compilar y no van al repo.

## Rutas

| Ruta | Página |
|---|---|
| `/` | Portada: servicios, destacados, proceso, sobre, testimonios, cobertura, preguntas, contacto |
| `/bodas` | Servicio de bodas (*decoración de bodas Villavicencio*) |
| `/quince-anos` | Servicio de 15 años (*decoración de 15 años Villavicencio*) |
| `/eventos` | Portafolio con filtros por tipo, municipio y estilo |
| `/eventos/[slug]` | Página de cada evento (galería, ficha, "Quiero algo así") |
| `/sobre-ruben-dario` | Trayectoria, principios y equipo |
| `/lugares-para-bodas-villavicencio` | Guía de salones, haciendas y fincas |
| `/politica-de-datos` | Política de tratamiento de datos (Ley 1581 de 2012) |
| `/guia-de-estilos` | Colores, tipografía y componentes (noindex, fuera del sitemap) |

Mapa completo con secciones y SEO por página: [docs/mapa-del-sitio.md](docs/mapa-del-sitio.md).

## SEO técnico incluido

Metadata y canonical por página (en punycode), Open Graph pensado para WhatsApp,
JSON-LD (`LocalBusiness` con área de servicio, `FAQPage`, `Service`, `BreadcrumbList`,
`ImageGallery` y más), `sitemap.xml` con imágenes, `robots.txt` que permite asistentes de
IA, `/llms.txt` generado desde el contenido y fotos con `srcset`, `sizes`, carga diferida
y `alt` obligatorio.

## Publicar un evento nuevo

1. Agregar el lugar a `content/lugares.json` si es nuevo.
2. Importar las fotos (renombradas con lo que muestran):
   `npm run fotos:importar -- "C:/ruta/originales" boda-hacienda-el-caney-restrepo`
3. Crear o completar `content/eventos/<slug>/evento.json` (un `alt` por foto).
4. `npm run validar`, commit y despliegue. Sitemap, galería, filtros, relacionados y
   destacados se actualizan solos.

Detalle completo, textos pendientes y cómo retirar una foto (Ley 1581):
[content/LEEME.md](content/LEEME.md).

## QA

```bash
node scripts/capturas.mjs <carpeta> [/rutas]   # en Git Bash: MSYS_NO_PATHCONV=1 node …
```

Toma capturas a 320, 390 y 1440 px con el Edge instalado y avisa si hay scroll
horizontal. Meta de rendimiento: PageSpeed móvil ≥ 90.

## Lanzamiento (recordatorio)

En Cloudflare, desactivar el bloqueo de bots de IA y el robots.txt administrado, y
comprobar `/robots.txt` y `/llms.txt` en producción. Lista completa en
[CLAUDE.md](CLAUDE.md) → Plan de ejecución.
