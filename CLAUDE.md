# Rubén Darío Bodas y Eventos · Sitio web

Proyecto de **XyraCode** (agencia, Villavicencio). Es el **primer proyecto pago de la agencia**:
aprobado por el cliente el 2026-10-05. Este archivo resume todo lo decidido antes de
empezar el desarrollo.

## Next.js: leer antes de escribir código

La versión de Next.js que se instale puede tener cambios incompatibles con lo conocido:
APIs, convenciones y estructura de archivos. Antes de configurar o escribir código, lee la
guía relevante en `node_modules/next/dist/docs/` y respeta los avisos de deprecación.
Esto aplica especialmente a la **exportación estática**.

## El cliente

- **Rubén Darío Bodas y Eventos**, Villavicencio (Meta, Colombia).
- Diseño y decoración de eventos. **Su fuerte son las bodas**; también diseña **fiestas de 15 años**.
- Con el cliente: **trato formal (usted)** en documentos y mensajes. Referirse a "la empresa".
- Pronombres del cliente: no asumidos; usar el nombre de la empresa.

## Objetivo

Un sitio que presente su trabajo de bodas y 15 años, **lo posicione en Google en
Villavicencio y el Meta** y convierta visitas en conversaciones por WhatsApp con la fecha
y los detalles del evento. El SEO local es el eje del proyecto.

## Alcance aprobado

### A · Página principal (navegación continua por secciones, enfoque en bodas)
Portada con foto de sus eventos · Servicios (bodas, 15 años, otros eventos) · Eventos
destacados del portafolio · Cómo trabajamos, paso a paso · Sobre Rubén Darío (trayectoria
y equipo) · Testimonios · Cobertura Villavicencio y el Meta · Preguntas frecuentes ·
Formulario de contacto que arma el mensaje y abre WhatsApp · Botón de WhatsApp siempre
visible · Redes y footer · 100% responsive.

### B · Páginas de servicio: `/bodas` y `/quince-anos`
Cada una con: texto propio, qué incluye, galería, referencia de inversión "desde",
preguntas frecuentes propias, cierre hacia WhatsApp. Título y descripción por página,
URLs amigables, datos estructurados de negocio local.
Bodas y 15 años son búsquedas y públicos distintos: **cada página compite por la suya**.

### C · Portafolio de eventos (página propia por evento)
- Galería: tarjetas con foto, tipo de evento y lugar; filtro bodas / 15 años; destacados en portada.
- Página del evento: galería a pantalla completa; lugar, estilo y paleta; descripción del
  diseño; eventos relacionados; botón "Quiero algo así" → WhatsApp con el evento de
  referencia ya escrito; botón para compartir.
- SEO: título y descripción por evento, alt en cada foto, sitemap automático, Open Graph.
- Nombrar lugar y estilo de cada evento (p. ej. "Boda en hacienda, Restrepo") para captar
  búsquedas long-tail de salones y fincas de la zona.

### Valor agregado comprometido (sin costo)
- Infraestructura configurada (publicación, DNS, SSL, CDN).
- Registro y configuración del dominio a nombre de la empresa (el valor anual lo paga la empresa).
- Hasta 2 correos corporativos (redirecciones, solo reciben).
- SEO técnico: metadata, URLs, sitemap, robots.txt, Open Graph, datos estructurados,
  rendimiento, registro en Google Search Console.
- **Optimización del perfil de Google Business** (categoría, servicios, cobertura, fotos, enlace al sitio).
- **Carga inicial de 10 eventos** en el portafolio.
- **Publicación de 6 eventos adicionales durante el primer año** (los publica XyraCode con
  fotos y datos que envía la empresa).
- Publicación en producción · Garantía de 30 días · Todas las cuentas a nombre de la empresa.

### No incluye
Dominio anual · Logo / identidad de marca · Eventos más allá de 10 + 6 · **Panel
administrativo** para que la empresa publique sola · Redacción de textos · Fotografía ·
Reservas, agenda o pagos en línea · Blog · Pauta y redes sociales · Lo no descrito.
Todo pedido fuera de esto se anota y se cotiza aparte.

### Condiciones relevantes
- Textos, fotos e información de eventos los provee la empresa (sin texto propio no se posiciona).
- Fotos con clientes o invitados: **autorización previa de los titulares (Ley 1581 de 2012)**, a cargo de la empresa.
- Google Business: la verificación la hace la empresa directamente.
- No se garantiza posición en Google; se entrega la configuración técnica.

## Comercial

- Tiempo: **3–4 semanas** desde la aprobación y la entrega del contenido.
- **Valor final: $600.000 COP** (definido el 2026-10-06; reemplaza los $990.000 de la propuesta).
- Pago: **50% al iniciar ($300.000) / 50% al finalizar ($300.000), antes de publicar**.
  Medio de pago: Nequi 310 679 0518.
  Consta en la última hoja del documento del mapa del sitio
  (`xyracode.com/documentos/ruben-dario-bodas/mapa-del-sitio-ruben-dario-bodas.html`).
- Propuesta original: $1.390.000 − $400.000 = $990.000, con pago 30/70 (ya no vigente).
- Documentos del cliente (propuesta, contrato, cuentas de cobro) se generan desde el repo
  de la agencia con la skill `documentos-xyracode`, en
  `PROYECTOS DEV/xyracode.com/documentos/ruben-dario-bodas/`. Propuesta actual:
  `propuesta-ruben-dario-bodas.html` (PDF aún sin generar).

## Arquitectura e infraestructura decididas

Sitio **100% estático**: sin base de datos, sin API, sin panel.

| Pieza | Decisión |
|---|---|
| Framework | Next.js con exportación estática |
| Hosting | Cloudflare Workers, como archivos estáticos (plan Free) |
| Eventos del portafolio | Un archivo por evento (JSON o MDX) en el repo; publicar uno = agregar archivo + desplegar |
| Imágenes | Procesadas al compilar: WebP en 3 tamaños, carga diferida, dentro del mismo despliegue. Nada de servicios de imágenes pagos |
| Formulario de contacto | Solo cliente: arma el texto y abre `wa.me` |
| DNS · CDN · SSL | Cloudflare Free |
| Correo | Cloudflare Email Routing, 2 direcciones, solo recepción |
| Analítica | Cloudflare Web Analytics (sin cookies) |
| Dominio | Recomendado Cloudflare Registrar (.com a costo, ~USD 10,44/año, ~$34.200 COP) |

**Costo mensual al publicar: USD 0.** Topes del plan gratis: visitas sin límite para
archivos estáticos; **20.000 archivos por despliegue**; 25 MiB por archivo. Estimado del
primer año: ~1.000 archivos (16 eventos × ~20 fotos × 3 tamaños). Superar el tope →
Workers Paid USD 5/mes (~$16.400 COP, TRM $3.273,49 del 2026-10-05).
Si el cliente pide luego un panel para publicar solo, eso exige servidor y base de datos
(Workers Paid + Neon): se cotiza aparte con su costo mensual.

## Estrategia SEO

Palabras clave objetivo (una principal por página):
- Inicio: marca + *decoración de eventos en Villavicencio* (resume y enlaza; no compite con los servicios)
- `/bodas`: *decoración de bodas Villavicencio* / *diseño de bodas en el Meta*
- `/quince-anos`: *decoración de 15 años Villavicencio*
- Cada evento: *boda en [lugar], [municipio]* (salones y fincas de la zona)

Mapa completo de rutas, secciones y SEO por página: `docs/mapa-del-sitio.md`.

Reglas:
- Un solo H1 por página con palabra clave + ciudad.
- Nombre, dirección y teléfono escritos igual que en Google Business.
- Datos estructurados `LocalBusiness` con área de servicio. `FAQPage` en las preguntas frecuentes.
- Fotos: WebP/AVIF, `sizes` responsive, lazy, alt descriptivo, nombre de archivo limpio
  (`boda-hacienda-restrepo-mesa-principal.webp`). La galería es el mayor riesgo para el LCP.
- **No usar el embed de Instagram** (lento); fotos propias optimizadas + enlace al perfil.
- Open Graph cuidado: el sitio se comparte sobre todo por WhatsApp.
- Meta: PageSpeed móvil ≥ 90.

## Plan de ejecución

0. **Arranque:** reunión de inicio (un solo decisor, referencias visuales, lista de los 10
   eventos), grupo de WhatsApp como canal único, cronograma con fecha límite de entrega
   de contenido, cuentas a nombre del cliente (Cloudflare, dominio, acceso admin a Google
   Business), tablero de tareas.
1. **SEO y estructura (días 1–3):** palabras clave, revisión de competencia en Google,
   mapa del sitio y secciones por página. Va antes del diseño.
2. **Diseño (semana 1):** dirección visual; 3 plantillas (inicio, servicio, evento),
   móvil primero; una ronda de revisión consolidada y aprobación por escrito.
3. **Contenido (en paralelo):** cuestionario por evento (lugar, estilo, paleta, qué lo
   hizo especial) y por servicio (qué incluye, desde cuánto, preguntas frecuentes); selección de 15–20
   fotos por evento, renombradas; autorizaciones Ley 1581.
4. **Desarrollo (semanas 2–3):** preview en Cloudflare desde el día 1; eventos como
   archivos; pipeline de imágenes; SEO técnico completo.
5. **QA (final semana 3):** celulares reales (Android e iPhone), PageSpeed, mensajes de
   WhatsApp de cada botón, vista previa al compartir, ortografía, 404, favicon; una ronda
   de ajustes consolidada.
6. **Lanzamiento (semana 4):** cobrar el 70% antes de publicar; dominio, DNS, SSL,
   correos; Search Console + sitemap; Google Business (enlace, servicios, fotos, enlace
   para pedir reseñas); explicar al cliente cómo enviar eventos nuevos.
7. **Post-lanzamiento:** garantía 30 días (error → se corrige; cambio → se cotiza);
   revisar Search Console a las 2 y 4 semanas con mini reporte; calendarizar los 6
   eventos del año (uno cada ~2 meses); pedir testimonio y permiso para usar el caso en el
   portafolio de XyraCode.

Hábitos de agencia: **registrar horas por fase** (para calibrar precios futuros), anotar
y cotizar todo pedido fuera de alcance, reporte semanal fijo (qué se hizo, enlace de
preview, qué falta del cliente).

## Pendientes inmediatos

- [x] Precio final: $600.000 COP, 50/50.
- [ ] Contrato de prestación de servicios y cuenta de cobro del anticipo (50%, $300.000).
- [ ] Cronograma con fechas concretas.
- [ ] Cuestionario de contenido para el cliente (eventos y servicios) + lista de insumos.
- [ ] Definir dominio y nombre definitivo del repo/carpeta.
- [ ] Iniciar el proyecto (Next estático + git) en esta carpeta.
