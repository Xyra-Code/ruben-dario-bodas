# Mapa del sitio · Rubén Darío Diseñador de Bodas

Rutas, secciones, SEO y datos estructurados de cada página. Base para el diseño y el
desarrollo. Actualizado: 2026-10-05.

Criterio: cada decisión busca que el sitio quede excelente, más allá del alcance cotizado.
Lo que depende de contenido de la empresa se marca con **[contenido]**.

---

## 1. Rutas

```
/                                       Inicio · marca + "decoración de eventos en Villavicencio"
├── /bodas                              Servicio · "decoración de bodas Villavicencio"
├── /quince-anos                        Servicio · "decoración de 15 años Villavicencio"
├── /eventos                            Portafolio (filtros en el navegador)
│   └── /eventos/[slug]                 Evento · "boda en [lugar], [municipio]"
├── /sobre-ruben-dario                  Historia y equipo · búsquedas de marca
├── /lugares-para-bodas-villavicencio   Guía de salones y fincas · "fincas para bodas Villavicencio"
├── /politica-de-datos                  Tratamiento de datos (Ley 1581 de 2012)
├── /404                                No encontrada (con enlaces útiles)
├── /sitemap.xml · /robots.txt          Generados al compilar
└── favicon · imágenes Open Graph       Una por página, generadas al compilar
```

Reglas de rutas:
- Slug de evento: `tipo-lugar-municipio`, minúsculas, sin tildes ni ñ
  (`boda-hacienda-el-caney-restrepo`, `quince-salon-rosales-villavicencio`).
- Los filtros de `/eventos` no crean URLs indexables (sin `/eventos/bodas` ni `?tipo=`):
  competirían con `/bodas` y `/quince-anos`.
- Sin páginas por municipio (contenido delgado) ni blog (envejece sin publicación constante).
- Canonical propio en cada página.

---

## 2. Reparto SEO: que ninguna página pise a otra

| Página | Búsqueda principal | Público |
|---|---|---|
| `/` | Marca + *decoración de eventos en Villavicencio* / *decorador de eventos en el Meta* | Busca el nombre, no ha definido el evento, llega de Google Business o Instagram |
| `/bodas` | *decoración de bodas Villavicencio* / *diseño de bodas en el Meta* | Parejas |
| `/quince-anos` | *decoración de 15 años Villavicencio* | Mamá o quinceañera |
| `/eventos/[slug]` | *boda en [lugar], [municipio]* | Long-tail de salones y fincas |
| `/lugares-para-bodas-villavicencio` | *fincas / salones para bodas en Villavicencio* | Parejas en etapa de elegir lugar |
| `/sobre-ruben-dario` | *Rubén Darío decorador*, búsquedas de marca | Quien quiere saber quién diseña |

Reglas:
- **La portada resume y enlaza; las páginas de servicio profundizan.** Ningún párrafo se repite entre páginas.
- Un solo H1 por página, con palabra clave + ciudad.
- Enlaces internos con texto clave ("decoración de bodas" → `/bodas`), nunca "ver más".
- Cada evento enlaza a su página de servicio, no a la portada.
- `LocalBusiness` completo solo en la portada; el resto lo referencia por `@id`.
- Preguntas frecuentes: generales en la portada, específicas en cada servicio, sin repetirse.
- Nombre, dirección y teléfono idénticos a Google Business.

---

## 3. Elementos comunes (todas las páginas)

**Encabezado:** Logo → `/` · Bodas · 15 años · Eventos · Nosotros (→ `/sobre-ruben-dario`) ·
Contacto (→ `/#contacto`) · botón **Cotizar**.

**Botón flotante de WhatsApp:** acceso rápido, mensaje genérico, sin formulario.

**Footer:** nombre, dirección y teléfono (igual que en Google Business) · horario · mapa
estático enlazado a Google Maps · enlaces a todas las páginas · redes (enlace a Instagram,
sin embed) · municipios de cobertura en texto · correo corporativo · reseñas en Google
(ver / dejar reseña) · política de datos · crédito XyraCode.

### Formulario de cotización (componente único, reutilizado)

| Campo | Obligatorio (todos, decisión de la empresa del 2026-10-09) |
|---|---|
| Nombre | ✅ |
| Tipo de evento (Boda / 15 años / Otro) | ✅ (ya elegido según la página) |
| Fecha del evento | ✅ |
| Municipio o lugar | ✅ |
| N.º aproximado de invitados | ✅ |
| Presupuesto aproximado: botones con los rangos de `content/sitio.json` + "Aún no lo sé" | ✅ ("Aún no lo sé" es válida) |
| Mensaje | ✅ |

- Botón: **"Enviar por WhatsApp"**. Debajo: *"Se abrirá WhatsApp con su mensaje listo para enviar."*
- Junto al formulario: bloque **"Qué necesito para cotizarle"** (fecha, lugar, invitados, estilo).
- Al enviar, se abre `wa.me` con el mensaje armado. El visitante confirma el envío en WhatsApp
  (sitio estático: no hay envío automático sin servidor).

Mensaje generado:

```
Hola, quisiera cotizar la decoración de mi evento.
• Nombre: …
• Evento: Boda
• Fecha: 14 de marzo de 2027
• Lugar: Hacienda El Caney, Restrepo
• Invitados: 150
• Presupuesto: $35 a $45 millones
• Referencia: Boda en Hacienda El Caney, Restrepo   ← solo desde una página de evento
• Mensaje: …
```

| Página | Ubicación del formulario | Ya elegido |
|---|---|---|
| `/` | Sección `#contacto` | — |
| `/bodas` | Cierre | Boda |
| `/quince-anos` | Cierre | 15 años |
| `/eventos/[slug]` | Cierre (al que lleva "Quiero algo así") | Tipo + referencia del evento |
| `/sobre-ruben-dario` | Cierre | — |
| `/lugares-para-bodas-villavicencio` | Cierre | Boda |

### Mensajes de WhatsApp de los botones sueltos

| Origen | Mensaje |
|---|---|
| Flotante / encabezado | "Hola, quisiera información para decorar mi evento." |
| Tarjeta "Otros eventos" | "Hola, quisiera cotizar la decoración de un evento." |

---

## 4. Secciones por página

### `/` Inicio

- **Título:** Rubén Darío · Decoración de eventos en Villavicencio (≤ 60 caracteres para que Google no lo corte)
- **H1:** Diseño y decoración de eventos en Villavicencio y el Meta
- **Descripción:** Diseñamos y decoramos bodas y fiestas de 15 años en Villavicencio y todo el Meta. Vea nuestros eventos y cotice por WhatsApp.

| # | Sección (ancla) | Contenido |
|---|---|---|
| 1 | Portada `#inicio` | Foto de boda (fuerte de la empresa, LCP con prioridad) + H1 + botones Cotizar / Ver eventos |
| 2 | Servicios `#servicios` | Tarjetas cortas: Decoración de bodas → `/bodas` · Decoración de 15 años → `/quince-anos` · Otros eventos → WhatsApp |
| 3 | Eventos destacados `#eventos` | 3–6 tarjetas mezcladas + "Ver todos los eventos" → `/eventos` |
| 4 | Cómo trabajamos `#como-trabajamos` | 4–5 pasos: contacto → visita/idea → propuesta → montaje → el día |
| 5 | Sobre Rubén Darío `#sobre` | Resumen + "Conozca su historia" → `/sobre-ruben-dario` |
| 6 | Testimonios `#testimonios` | 3 mezclados + enlace a reseñas en Google |
| 7 | Cobertura `#cobertura` | Villavicencio (centro de operación), municipios del Meta, Bogotá y Cundinamarca + mapa estático + enlace a la guía de lugares |
| 8 | Preguntas frecuentes `#preguntas` | Generales: cobertura, anticipación, reserva, cómo cotizar |
| 9 | Contacto `#contacto` | Formulario + "Qué necesito para cotizarle" |

**Datos estructurados:** `LocalBusiness` (areaServed, `@id` global) · `WebSite` · `FAQPage`.

### `/bodas` y `/quince-anos` (misma plantilla)

- **H1 `/bodas`:** Decoración de bodas en Villavicencio y el Meta
- **H1 `/quince-anos`:** Decoración de fiestas de 15 años en Villavicencio

| # | Sección | Contenido |
|---|---|---|
| 1 | Migas | Inicio › Bodas |
| 2 | Portada | H1 + foto + botón Cotizar |
| 3 | Texto propio **[contenido]** | 2–3 párrafos: enfoque, estilos |
| 4 | Tipos / variantes | Bodas: ceremonia, recepción, en finca o al aire libre, íntima, civil · 15 años: temáticas y estilos |
| 5 | Qué incluye | Diseño, mobiliario, flores, iluminación, montaje y desmontaje… |
| 6 | Galería | Solo eventos del tipo, cada foto enlazada a su evento |
| 7 | Inversión "desde" **[contenido]** | Valor de referencia + qué hace variar el precio |
| 8 | Testimonios | Solo del tipo |
| 9 | Preguntas frecuentes propias | Específicas, sin repetir las de la portada |
| 10 | Cierre | Formulario con el tipo ya elegido |

**Datos estructurados:** `Service` (provider → `@id` del negocio) · `FAQPage` · `BreadcrumbList`.

### `/eventos` Portafolio

- **H1:** Bodas y 15 años decorados en Villavicencio y el Meta

| # | Sección | Contenido |
|---|---|---|
| 1 | Migas + H1 + intro corta | |
| 2 | Filtros (en el navegador) | Tipo · municipio · estilo |
| 3 | Tarjetas | Foto, tipo, lugar, municipio, año → `/eventos/[slug]` |
| 4 | Cierre | Botón Cotizar → WhatsApp |

**Datos estructurados:** `BreadcrumbList`.

### `/eventos/[slug]` Evento

- **H1:** Boda en Hacienda El Caney, Restrepo

| # | Sección | Contenido |
|---|---|---|
| 1 | Migas | Inicio › Eventos › Boda en Hacienda El Caney, Restrepo |
| 2 | H1 + ficha | Tipo · lugar · municipio · estilo · paleta (muestras) · mes y año |
| 3 | Galería | Cuadrícula + visor a pantalla completa (deslizar, teclado), alt en cada foto |
| 4 | Descripción del diseño **[contenido]** | Qué lo hizo especial |
| 5 | Testimonio del evento **[contenido]** | Frase de la pareja o la quinceañera |
| 6 | Créditos de proveedores | Lugar, fotografía, flores… con enlace a cada uno |
| 7 | Acciones | **Quiero algo así** (baja al formulario) · **Compartir** (Web Share API; respaldo: WhatsApp + copiar enlace) |
| 8 | Relacionados | 3 eventos: mismo tipo, luego mismo municipio |
| 9 | Enlace al servicio | "Decoración de bodas" → `/bodas` |
| 10 | Cierre | Formulario con tipo + referencia del evento |

**Datos estructurados:** `BreadcrumbList` · `ImageGallery` (no `Event`).
**Open Graph:** 1200×630 con la foto de portada y el nombre del evento.

### `/sobre-ruben-dario` **[contenido: 400–600 palabras + 4–5 fotos + hitos]**

- **H1:** Rubén Darío, diseñador de bodas en Villavicencio

| # | Sección | Contenido |
|---|---|---|
| 1 | Portada | Foto + H1 + frase que lo defina |
| 2 | Cómo empezó | Origen, primeros eventos |
| 3 | Trayectoria | Línea de tiempo con años, cantidad de eventos, lugares |
| 4 | Su forma de diseñar | Filosofía y estilo |
| 5 | El equipo | Fotos y roles |
| 6 | Video del montaje (si existe) | Timelapse, carga al tocar |
| 7 | Eventos que lo marcaron | 3 enlazados al portafolio |
| 8 | Reconocimientos (si existen) | |
| 9 | Cierre | Formulario |

**Datos estructurados:** `AboutPage` · `Person` (founder del negocio) · `BreadcrumbList`.

### `/lugares-para-bodas-villavicencio` **[contenido: lista de lugares + permiso de cada uno]**

- **H1:** Lugares para bodas en Villavicencio y el Meta

| # | Sección | Contenido |
|---|---|---|
| 1 | Migas + H1 + intro | Cómo elegir lugar, qué tener en cuenta |
| 2 | Lugares por municipio | Por cada salón o finca: foto de un montaje de la empresa, tipo de lugar, capacidad aproximada, eventos realizados allí (enlaces) |
| 3 | Consejos de decoración por tipo de lugar | Finca, salón, aire libre |
| 4 | Cierre | Formulario (Boda) |

**Datos estructurados:** `BreadcrumbList` · `ItemList` de lugares.

### `/politica-de-datos` **[contenido: texto de la empresa]**

Tratamiento de datos (Ley 1581 de 2012), uso de fotos con autorización, contacto del responsable.

### `/404`

Mensaje breve + enlaces a Bodas, 15 años, Eventos y WhatsApp.

---

## 5. Medición

- **Cloudflare Web Analytics:** visitas, páginas, procedencia (sin cookies).
- **Cloudflare Zaraz (gratis, sin cookies):** eventos de conversión: clic en cada botón de
  WhatsApp, envío del formulario, "Quiero algo así", compartir. Etiquetados por página y botón.
- **Google Search Console:** sitemap + reportes a las 2 y 4 semanas.

## 6. Calidad transversal

- PageSpeed móvil ≥ 90; imágenes WebP/AVIF en 3 tamaños, lazy, `sizes` responsive.
- Accesibilidad AA: contraste, visor de galería con teclado, alt, `prefers-reduced-motion`.
- Validaciones al compilar: todo evento debe tener título, descripción, portada y alt en cada foto; si falta algo, no se despliega.

## 7. Contenido de un evento

```
content/eventos/boda-hacienda-el-caney-restrepo/
├── evento.json   tipo, lugar (slug de lugares.json), estilo, paleta[], fecha, destacado,
│                 descripcion[], testimonio{texto, autor}, proveedores[{rol, nombre, url}],
│                 seo{title, description}, portada, fotos[{archivo, alt}], borrador?
└── fotos/        originales renombradas → WebP en 3 tamaños al compilar
```

El título (H1) se arma solo a partir del lugar: "Boda en Hacienda El Caney, Restrepo".
El municipio sale del lugar, así cada salón o finca se escribe igual en todo el sitio.
Implementado en la Fase 1: guía de uso en `content/LEEME.md`, esquemas en
`src/lib/contenido/esquemas.ts`, validación con `npm run validar`.

Publicar un evento = agregar la carpeta y desplegar. Sitemap, galerías, filtros,
relacionados, destacados y guía de lugares se actualizan solos.

## 8. Pendientes con la empresa (cuestionario de contenido)

- Historia, hitos, fotos y equipo para `/sobre-ruben-dario`.
- Lista de salones y fincas donde ha trabajado + permiso para nombrarlos.
- Proveedores de cada evento (fotógrafo, flores, lugar) y sus enlaces.
- Testimonio por evento.
- ¿Tiene portafolio de otros eventos (grados, aniversarios, corporativos)? Si sí, evaluar página propia.
- Texto de la política de datos.
- Video del montaje, si existe.
- Horario de atención y dirección exacta como en Google Business.
