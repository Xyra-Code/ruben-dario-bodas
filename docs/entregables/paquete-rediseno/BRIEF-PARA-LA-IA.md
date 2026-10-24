# Rediseño UX/UI · Rubén Darío Diseñador de Bodas

Necesito que propongas mejoras de UX y UI para este sitio web. Te paso el HTML real de
cada página, el CSS compilado y capturas en celular (390 px) y escritorio (1440 px).

## El negocio

Rubén Darío Diseñador de Bodas diseña y decora bodas (su fuerte) y fiestas de 15 años en
Villavicencio (Meta, Colombia). También atiende el resto del Meta, Bogotá y Cundinamarca.

- **Objetivo del sitio:** que quien llega (casi siempre desde el celular, muchas veces
  por un enlace de WhatsApp) vea el trabajo, confíe y **escriba por WhatsApp** con la
  fecha y los detalles del evento. No hay reservas ni pagos en línea.
- **Público:** parejas que se casan y familias que organizan unos 15 años, en el Meta.
- **El SEO local es el eje:** el sitio tiene que posicionar en Google en Villavicencio.

## Qué contiene este paquete

| Carpeta | Contenido |
|---|---|
| `capturas/` | Cada página a 390 px (celular) y 1440 px (escritorio), página completa |
| `html/` | HTML final de cada página, sin scripts. Las clases son de Tailwind CSS v4 |
| `estilos/` | `paleta.css` y `tipografia.css` (los tokens), `globals.css` (fuente) y `sitio-compilado.css` |
| `marca/` | Logo en SVG: horizontal, vertical, firma, monograma, y versiones a una tinta |

Páginas: inicio (`index`), `/bodas`, `/quince-anos`, `/eventos` (portafolio), una página
de evento (`eventos/boda-hacienda-el-caney-restrepo`), `/sobre-ruben-dario`, guía de
lugares para bodas, política de datos y 404.

**Ojo con el contenido:** las fotos son de ejemplo ("FOTO DE EJEMPLO") y los textos
`[PENDIENTE: …]` todavía no los entrega la empresa. Evalúa el diseño, no esos textos. En
el sitio real habrá fotos profesionales de eventos.

**Lo interactivo** no se ve en el HTML ni en las capturas: menú móvil desplegable,
acordeón de preguntas frecuentes, filtro bodas / 15 años en el portafolio, visor de fotos
a pantalla completa, validación del formulario y un botón flotante de WhatsApp animado.

## Lo que NO se cambia (ya aprobado por la empresa)

- **Paleta "Terracota Atardecer Llanero":** fondo `#FDFAF7`, fondo alterno `#F7EFE7`,
  texto `#2A1E1B`, texto secundario `#6E5D57`, principal `#9C4A3B` (hover `#7C3A2E`),
  acento melocotón `#C47A71` (solo decorativo o texto ≥ 24 px), oro `#D4A359`
  (decorativo) y oro para texto `#855A16`, bordes `#E8DED6`.
- **Tipografía "Alta Costura":** títulos y citas en Bodoni Moda 400 (cursiva en citas);
  texto, menú y botones en Manrope; antetítulos en Manrope 600, mayúsculas espaciadas.
- **Solo modo claro.**

Puedes proponer cómo usar mejor estos colores y fuentes, pero no reemplazarlos.

## Reglas que el diseño debe respetar

1. **Móvil primero.** Se diseña para 390 px y se amplía. Nada se puede salir de la
   pantalla a 320 px.
2. **Un solo H1 por página**, con la palabra clave y la ciudad (por ejemplo,
   "Decoración de bodas en Villavicencio y el Meta"). No cambies la jerarquía de títulos
   sin explicar por qué.
3. **Todos los textos tutean al visitante** (tú, nunca usted), en español de Colombia.
4. **WhatsApp es la acción principal.** Todo camino termina en un botón o en el
   formulario que arma el mensaje y abre WhatsApp.
5. **La fotografía manda:** fotos grandes, con aire. La interfaz acompaña, no compite.
6. **Accesibilidad:** contraste AA, áreas táctiles de al menos 44 × 44 px, texto de
   cuerpo de al menos 16 px en celular, foco visible.
7. **Rendimiento (PageSpeed móvil ≥ 90):** nada de carruseles automáticos, videos de
   fondo pesados ni embeds de Instagram.
8. **Estilo:** elegante, cálido, editorial y luminoso, como una revista de bodas fina pero
   cercana. Líneas finas, esquinas rectas o apenas suaves (nada de estilo "app" muy
   redondeado), sin exceso de íconos ni fondos oscuros.

## Qué te pido

1. **Diagnóstico por página y por sección:** qué funciona, qué no y por qué, pensando en
   alguien que llega desde el celular y debería terminar escribiendo por WhatsApp.
2. **Propuesta concreta de cambios**, priorizada (alto impacto primero): orden de las
   secciones, jerarquía visual, espaciado, llamados a la acción, tarjetas, galería,
   formulario, encabezado y pie.
3. **Para cada cambio:** cómo se vería en celular y en escritorio. Si das código, usa
   HTML con clases de Tailwind v4 y los nombres de color que ya usa el sitio, sin
   colores nuevos: `marfil` (fondo), `rubor` (fondo alterno), `superficie`, `carbon`
   (texto), `topo` (texto secundario), `terracota` y `terracota-profundo` (principal),
   `rosa`, `dorado`, `dorado-texto`, `linea` y `borde`. Por ejemplo `bg-rubor`,
   `text-terracota`, `border-linea`.
