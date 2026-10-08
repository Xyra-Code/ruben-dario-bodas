# Contenido del sitio

Todo el texto y las fotos del sitio viven aquí, separados del código. Los esquemas que
definen cada archivo están en `src/lib/contenido/esquemas.ts`.

| Archivo | Qué contiene |
|---|---|
| `sitio.json` | Nombre, teléfono, WhatsApp, dirección, horario, redes, municipios, cifras. **Debe coincidir con Google Business.** |
| `servicios/bodas.json`, `servicios/quince-anos.json` | Páginas `/bodas` y `/quince-anos` |
| `proceso.json` | "Cómo trabajamos" de la portada: 3 a 6 pasos |
| `preguntas-generales.json` | Preguntas frecuentes de la portada (las de cada servicio van en su archivo) |
| `lugares.json` | Salones, haciendas y fincas. Los eventos los referencian por `slug` |
| `testimonios.json` | Solo se publican los que tienen `"autorizado": true` (Ley 1581) |
| `eventos/<slug>/` | Un evento del portafolio: `evento.json` + carpeta `fotos/` |

## Publicar un evento

1. Si el lugar es nuevo, agregarlo a `lugares.json` con su `municipio` y `departamento`
   (una zona de `sitio.json` → `cobertura`: Meta, Bogotá D.C. o Cundinamarca).
   `enGuia: true` solo con permiso del lugar.
2. Crear la carpeta `eventos/<slug>/` con el slug `tipo-lugar-municipio`, en minúsculas y
   sin tildes ni ñ: `boda-hacienda-el-caney-restrepo`, `quince-salon-rosales-villavicencio`.
3. Renombrar las fotos originales con lo que muestran ("mesa principal.jpg", no
   "IMG_1234.jpg"): el nombre va en la URL de la foto y ayuda al SEO. Luego importarlas:
   ```
   npm run fotos:importar -- "C:/ruta/a/las/originales" boda-hacienda-el-caney-restrepo
   ```
   El importador corrige la rotación, **borra los metadatos y la ubicación GPS**, reduce
   cada foto a un máster de 2400 px y la guarda como
   `fotos/boda-hacienda-el-caney-restrepo-mesa-principal.jpg`. Las originales en máxima
   calidad (no las que pasaron por WhatsApp) se guardan en el Drive de la empresa, no aquí.
4. Crear `evento.json` copiando el de otro evento (si ya existía al importar, las fotos se
   agregan solas con el alt `[PENDIENTE]`). El título se arma solo ("Boda en Hacienda El
   Caney, Restrepo"); cada foto necesita un `alt` que la describa.
5. `npm run validar`: dice exactamente qué falta o qué está mal.
6. Commit y push: Cloudflare publica. El sitemap, la galería, los filtros, los relacionados,
   los destacados y la guía de lugares se actualizan solos.

## Textos pendientes y ejemplos

- Lo que aún no entrega la empresa se escribe `"[PENDIENTE: …]"`.
- Lo de ejemplo lleva `"borrador": true` (eventos, lugares y testimonios).

En desarrollo ambos son avisos. `npm run build:produccion` (el que usa `npm run deploy`)
los convierte en errores: **no se puede publicar con textos pendientes ni ejemplos.**

## Retirar una foto

Si una persona pide que se retire una foto suya (Ley 1581): quitarla de `evento.json`,
borrarla de `fotos/` y publicar. El build elimina sus versiones web. La foto sigue en el
historial de git del repo privado; si se exige borrarla también de ahí, hay que reescribir
el historial (`git filter-repo`).
