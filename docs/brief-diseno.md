# Brief de diseño · Sitio web Rubén Darío Bodas y Eventos

Necesito el diseño (maqueta de alta fidelidad) de un sitio web completo para una empresa de
diseño y decoración de eventos. Diseña **todas las pantallas listadas abajo**, en **móvil
(390 px) y escritorio (1440 px)**. El diseño es **móvil primero**: la mayoría de visitantes
llega desde el celular, muchas veces desde un enlace compartido por WhatsApp.

Todo el texto del sitio va **en español de Colombia, con trato formal (usted)**.

---

## 1. La empresa

- **Nombre:** Rubén Darío Bodas y Eventos.
- **Ubicación:** Villavicencio, Meta (Colombia). Atiende Villavicencio y municipios del Meta
  (Restrepo, Acacías, Cumaral, Puerto López, Granada, entre otros).
- **Qué hace:** diseño y decoración de eventos. **Su fuerte son las bodas**; también hace
  fiestas de 15 años y otros eventos.
- **Diferencial:** diseño de autor. No alquila decoración genérica: cada evento se diseña
  con un estilo y una paleta propios (rústico, clásico, moderno, bohemio, etc.), en salones,
  haciendas y fincas de los Llanos.
- **Logo:** aún no está disponible. Usa un logotipo tipográfico provisional con el nombre
  "Rubén Darío" y el descriptor "Bodas y Eventos".

## 2. Objetivo del sitio

1. Mostrar el trabajo (las fotos de eventos son el protagonista).
2. Generar confianza (trayectoria, testimonios, proceso claro).
3. **Convertir visitas en conversaciones por WhatsApp** con la fecha y los datos del evento.
   No hay pagos, reservas ni cuentas de usuario.

## 3. Público

- **Parejas que se van a casar** (25–40 años): buscan inspiración, quieren sentir que el
  diseñador entiende su estilo; comparan varias opciones.
- **Mamás y quinceañeras** (fiestas de 15 años): buscan temáticas, impacto visual y
  seguridad de que todo saldrá bien.
- Navegan desde el celular, con conexiones a veces lentas, y comparten enlaces por WhatsApp.

## 4. Dirección visual

Sensación buscada: **elegante, cálida, editorial y luminosa**. Como una revista de bodas
fina, pero cercana y regional, no fría ni de lujo inalcanzable.

- **La fotografía manda.** Fotos grandes, generosas, con mucho aire alrededor. La interfaz
  acompaña, no compite.
- **Paleta sugerida** (puedes proponer variaciones):
  - Marfil / blanco cálido para fondos: `#FAF7F2`
  - Carbón cálido para texto: `#2B2724`
  - Verde salvia u oliva (guiño a los Llanos): `#7A8B6F`
  - Acento dorado suave / champaña para detalles y botones secundarios: `#B89B6A`
  - Un tono arena para fondos de sección alternos: `#EFE8DD`
  - El botón principal de WhatsApp puede usar el acento de la marca, no necesariamente el verde de WhatsApp; el **ícono** de WhatsApp sí debe reconocerse.
- **Tipografía:** una serif elegante para títulos (tipo Cormorant Garamond, Playfair Display
  o similar) y una sans limpia y muy legible para textos y botones (tipo Inter, Manrope o
  DM Sans). Cuerpo de texto mínimo 16 px en móvil.
- **Detalles:** líneas finas, esquinas suaves o rectas (evitar estilo "app" muy redondeado),
  numeración editorial en los pasos, transiciones sutiles. Nada recargado.
- **Evitar:** estética de plantilla genérica, exceso de íconos, fondos oscuros pesados,
  carruseles automáticos, textos sobre fotos sin contraste suficiente, embeds de Instagram.

Proporciona un modo claro únicamente.

## 5. Requisitos generales

- **Un solo H1 por página** (indicado en cada pantalla). Úsalo tal cual.
- **Rendimiento:** el diseño debe poder cargar rápido en móvil. Una sola imagen grande en
  la portada de cada página; galerías en cuadrícula, no sliders pesados.
- **Accesibilidad:** contraste AA, botones de al menos 44 px de alto, estados de foco visibles.
- **Fotos:** usa imágenes de ejemplo de bodas, decoración de mesas, arcos florales,
  iluminación, salones y fincas tropicales; en 15 años, decoraciones de fiesta juveniles y
  elegantes. Proporciones sugeridas: portadas 16:9 en escritorio / 4:5 en móvil; tarjetas 4:5.

## 6. Elementos comunes a todas las páginas

### Encabezado
- Izquierda: logotipo tipográfico.
- Enlaces: Bodas · 15 años · Eventos · Nosotros · Contacto.
- Derecha: botón **"Cotizar"** (lleva al formulario).
- Móvil: logotipo + botón "Cotizar" pequeño + menú hamburguesa que abre un panel a pantalla completa.
- Se mantiene fijo al hacer scroll, más compacto.

### Botón flotante de WhatsApp
- Esquina inferior derecha, siempre visible, ícono de WhatsApp. No debe tapar el contenido
  ni el botón de enviar del formulario en móvil.

### Formulario de cotización (componente reutilizable)
Aparece al final de casi todas las páginas. Diseño cálido, no de "formulario de oficina".

- Título: **"Cuéntenos de su evento"**
- Subtítulo: "Con la fecha y el lugar le respondemos más rápido."
- Campos: Nombre* · Tipo de evento* (selector tipo botones: Boda / 15 años / Otro) ·
  Fecha del evento* · Municipio o lugar · Número aproximado de invitados · Mensaje (opcional).
- Botón: **"Enviar por WhatsApp"** con ícono.
- Texto bajo el botón: *"Se abrirá WhatsApp con su mensaje listo para enviar."*
- Al lado (escritorio) o arriba (móvil), bloque **"Qué necesito para cotizarle"**: fecha,
  lugar, número de invitados, estilo o referencias.
- Variante: cuando viene desde un evento, muestra una etiqueta arriba:
  "Referencia: Boda en Hacienda El Caney, Restrepo".
- Diseña también el estado de error (campo obligatorio vacío).

### Footer
- Logotipo y frase corta.
- Datos de contacto: dirección, teléfono, correo, horario de atención.
- Mapa estático pequeño (imagen) con enlace "Cómo llegar".
- Enlaces: Bodas, 15 años, Eventos, Nosotros, Lugares para bodas, Política de datos.
- "Atendemos en: Villavicencio, Restrepo, Acacías, Cumaral, Puerto López, Granada…"
- Redes sociales (Instagram, Facebook) y "Vea nuestras reseñas en Google".
- Línea final: © Rubén Darío Bodas y Eventos · Sitio por XyraCode.

### Migas de pan
En todas las páginas internas: `Inicio › Bodas`, `Inicio › Eventos › Boda en …`.

---

## 7. Pantallas a diseñar

### 7.1 Inicio `/`

**H1:** "Diseño y decoración de eventos en Villavicencio y el Meta"

1. **Portada:** foto grande de una boda decorada. H1, subtítulo ("Bodas y fiestas de 15
   años diseñadas con detalle, de principio a fin."), botones **"Cotizar mi evento"** y
   **"Ver eventos"**.
2. **Servicios:** 3 tarjetas con foto:
   - "Decoración de bodas": 2 líneas + enlace "Conozca el servicio".
   - "Decoración de 15 años": 2 líneas + enlace.
   - "Otros eventos": 2 líneas + botón "Escríbanos".
   La tarjeta de bodas puede ser más grande (es el fuerte de la empresa).
3. **Eventos destacados:** 6 tarjetas de eventos (foto 4:5, etiqueta "Boda" o "15 años",
   título "Boda en Hacienda El Caney", municipio "Restrepo"). Botón "Ver todos los eventos".
4. **Cómo trabajamos:** 5 pasos numerados con estilo editorial (01, 02…):
   Conversemos · Visita e idea · Propuesta de diseño · Montaje · Su día.
5. **Sobre Rubén Darío:** foto del diseñador trabajando + 1 párrafo + 3 cifras
   (ej. "15 años de experiencia", "+300 eventos", "20 municipios") + enlace
   "Conozca su historia".
6. **Testimonios:** 3 testimonios (cita, nombre, tipo de evento) + enlace
   "Vea nuestras reseñas en Google".
7. **Cobertura:** texto "Llegamos a Villavicencio y todo el Meta" + lista de municipios
   + mapa estático estilizado + enlace "Lugares para bodas en Villavicencio".
8. **Preguntas frecuentes:** acordeón con 5–6 preguntas generales (¿Con cuánta
   anticipación debo reservar? ¿Atienden fuera de Villavicencio? ¿Cómo se separa la fecha?).
9. **Formulario de cotización** (sin tipo preseleccionado).

### 7.2 Servicio: Bodas `/bodas`

**H1:** "Decoración de bodas en Villavicencio y el Meta"

1. Migas.
2. **Portada:** foto de boda + H1 + 1 frase + botón "Cotizar mi boda".
3. **Texto de presentación:** 2–3 párrafos con buena tipografía editorial, quizá con una
   foto vertical al lado.
4. **Tipos de boda:** tarjetas o lista visual: Ceremonia · Recepción · Boda en finca o al
   aire libre · Boda íntima · Matrimonio civil.
5. **Qué incluye:** lista con íconos finos o numeración: diseño a medida, mobiliario,
   flores, iluminación, mantelería y vajilla, montaje y desmontaje.
6. **Galería:** cuadrícula tipo mosaico de 8–12 fotos; cada foto lleva al evento.
7. **Inversión:** bloque destacado "Desde $X.XXX.XXX" + "El valor final depende del número
   de invitados, el lugar y el diseño" + botón "Cotizar".
8. **Testimonios** de parejas (2–3).
9. **Preguntas frecuentes** sobre bodas (acordeón).
10. **Formulario** con "Boda" preseleccionado.

### 7.3 Servicio: 15 años `/quince-anos`

**H1:** "Decoración de fiestas de 15 años en Villavicencio"

Misma estructura que Bodas, con estas diferencias:
- En lugar de "Tipos de boda": **"Temáticas y estilos"** (ej. Clásico elegante, Moderno,
  Encantado, Neón / Glow, Personalizado).
- Fotos y tono algo más juveniles y festivos, sin perder la elegancia de la marca.
- Formulario con "15 años" preseleccionado.

### 7.4 Portafolio `/eventos`

**H1:** "Bodas y 15 años decorados en Villavicencio y el Meta"

1. Migas + H1 + 1 línea de introducción.
2. **Filtros:** chips para tipo (Todos / Bodas / 15 años), selector de municipio,
   selector de estilo. En móvil, en una fila deslizable o un botón "Filtrar" que abre un panel.
3. **Cuadrícula de tarjetas** (2 columnas en móvil, 3 en escritorio): foto 4:5, etiqueta
   de tipo, título, municipio y año.
4. Estado vacío del filtro: "No hay eventos con esos filtros" + botón para limpiar.
5. Cierre: "¿Le gustó lo que vio? Cuéntenos de su evento" + botón Cotizar.

### 7.5 Evento `/eventos/boda-hacienda-el-caney-restrepo`

**H1:** "Boda en Hacienda El Caney, Restrepo"

1. Migas.
2. **Cabecera:** H1 + **ficha** del evento: Tipo (Boda) · Lugar (Hacienda El Caney) ·
   Municipio (Restrepo, Meta) · Estilo (Rústico elegante) · Fecha (Marzo 2026) ·
   **Paleta** (4–5 círculos de color con su nombre: Terracota, Salvia, Marfil, Dorado).
3. **Galería:** foto principal grande + cuadrícula de 15–20 fotos.
4. **Visor a pantalla completa** (diseña esta pantalla aparte): fondo oscuro, foto centrada,
   flechas, contador "3 / 18", botón cerrar; en móvil se desliza con el dedo.
5. **Sobre el diseño:** 2–3 párrafos de lo que hizo especial al evento.
6. **Testimonio de la pareja:** cita destacada con nombres.
7. **Proveedores:** lista discreta: Lugar · Fotografía · Flores · Música, cada uno con enlace.
8. **Acciones:** botón principal **"Quiero algo así"** y botón secundario **"Compartir"**.
9. **Eventos relacionados:** 3 tarjetas.
10. Enlace "Conozca nuestro servicio de decoración de bodas".
11. **Formulario** con la referencia del evento visible.

### 7.6 Sobre Rubén Darío `/sobre-ruben-dario`

**H1:** "Rubén Darío, diseñador de bodas en Villavicencio"

1. **Portada:** retrato del diseñador (foto vertical) + H1 + una frase personal.
2. **Cómo empezó:** texto narrativo con estilo editorial (letra capital, cita destacada).
3. **Trayectoria:** línea de tiempo con 5–6 hitos (año + logro).
4. **Su forma de diseñar:** 3 principios con texto corto.
5. **El equipo:** 3–4 fotos con nombre y rol.
6. **Video del montaje:** miniatura con botón de reproducir (timelapse de un montaje).
7. **Eventos que lo marcaron:** 3 tarjetas de eventos.
8. **Formulario.**

### 7.7 Guía de lugares `/lugares-para-bodas-villavicencio`

**H1:** "Lugares para bodas en Villavicencio y el Meta"

1. Migas + H1 + introducción: cómo elegir el lugar de su boda.
2. **Lugares agrupados por municipio** (Villavicencio, Restrepo, Acacías…). Cada lugar es
   una tarjeta: foto de un montaje de la empresa en ese lugar, nombre, tipo (Hacienda,
   Salón, Finca, Club), capacidad aproximada y "Ver eventos aquí (2)".
3. **Consejos de decoración según el lugar:** 3 bloques (Finca o aire libre · Salón · Hacienda).
4. **Formulario** con "Boda" preseleccionado.

### 7.8 Política de datos `/politica-de-datos`

**H1:** "Política de tratamiento de datos personales"
Página de texto legal, sobria y muy legible: índice de secciones, ancho de lectura
cómodo (≈ 70 caracteres), títulos claros.

### 7.9 Página no encontrada (404)

Mensaje amable ("Esta página no existe, pero su evento sí puede"), y accesos a Bodas,
15 años, Eventos y botón de WhatsApp. Una foto suave de decoración.

---

## 8. Componentes que deben quedar definidos

Botones (principal, secundario, texto, WhatsApp), tarjeta de servicio, tarjeta de evento,
etiqueta de tipo de evento, chips de filtro, ficha de evento con paleta de colores,
galería en mosaico, visor a pantalla completa, paso numerado, testimonio, acordeón de
preguntas, línea de tiempo, tarjeta de lugar, formulario con estados (normal, foco,
error), migas de pan, encabezado (normal y compacto), menú móvil, footer, botón flotante.

## 9. Entregables

- Las 9 pantallas en móvil y escritorio (más el visor de galería y el menú móvil abierto).
- Guía de estilos: colores, tipografías con escala de tamaños, espaciados, componentes.
