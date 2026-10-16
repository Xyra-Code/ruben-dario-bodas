# Fotos pendientes

Sala de espera para fotos de eventos que todavía no se publican. Git ignora todo lo que
hay aquí (menos este archivo) y ningún script lo toca: ni `npm run dev` ni el build.

Una carpeta por evento, con el slug que tendrá en el sitio:

```
fotos-pendientes/
  boda-finca-las-heliconias-villavicencio/
    mesa principal.jpg
    arco ceremonia.jpg
  quince-salon-rosales-villavicencio/
```

Cuando el evento esté listo para armarse:

```
npm run fotos:importar -- "fotos-pendientes/boda-finca-las-heliconias-villavicencio" boda-finca-las-heliconias-villavicencio
```

Después de importar, esta carpeta se puede borrar: el máster queda en
`content/eventos/<slug>/fotos/`.

Esto **no es respaldo**: como git no lo guarda, si se borra la carpeta del proyecto se
pierden. Las originales siempre deben estar también en el Drive de la empresa.
