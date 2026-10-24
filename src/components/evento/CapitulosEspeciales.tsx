import { Boton } from "@/components/ui/Boton";
import { Foto } from "@/components/ui/Foto";
import type { Evento } from "@/lib/contenido/cargar";
import type { Sobre } from "@/lib/contenido/esquemas";
import { obtenerImagen } from "@/lib/imagenes";

const seccion = "py-(--spacing-seccion)";

/**
 * Capítulos de la boda especial (Liz & Yei): cada uno con su texto y hasta 3 fotos, el
 * texto alternando de lado. Van después de "Sobre el diseño".
 */
export function CapitulosEspeciales({ evento: e }: { evento: Evento }) {
  if (!e.especial) return null;
  return e.especial.capitulos.map((c, i) => {
    const fotos = c.fotos.map((a) => e.fotos.find((f) => f.archivo === a)!);
    const [principal, ...resto] = fotos;
    const id = `capitulo-${i + 1}`;
    // Principal vertical: grande a la izquierda y las otras apiladas al lado. Horizontal
    // (p. ej. el velo extendido con el paisaje): completa arriba y las otras debajo, para
    // no recortar a la persona ni el paisaje.
    const medidas = obtenerImagen(e.slug, principal.archivo);
    const horizontal = medidas.ancho > medidas.alto;
    return (
      <section
        key={c.titulo}
        aria-labelledby={id}
        className={`${seccion} ${i % 2 === 0 ? "bg-rubor" : "border-t border-linea"}`}
      >
        <div className="contenedor grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className={`min-w-0 lg:col-span-5 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
            <p className="antetitulo tabular-nums">{String(i + 1).padStart(2, "0")}</p>
            <h2 id={id} className="mt-3 text-titulo-2">
              {c.titulo}
            </h2>
            <p className="mt-5 font-titulo text-titulo-3 text-topo">{c.texto}</p>
          </div>

          {/* Vertical: una foto grande y, al lado, las otras dos apiladas (también en
              celular). Horizontal: la grande arriba a todo el ancho y las otras debajo. */}
          <div
            className={`grid min-w-0 gap-3 sm:gap-4 lg:col-span-7 ${
              !resto.length ? "" : horizontal ? "grid-cols-2" : "grid-cols-[3fr_2fr]"
            }`}
          >
            <Foto
              evento={e.slug}
              archivo={principal.archivo}
              alt={principal.alt}
              sizes={
                horizontal ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 35vw, 60vw"
              }
              className={`w-full rounded-sm object-cover ${
                horizontal
                  ? "col-span-2 aspect-3/2"
                  : resto.length
                    ? "row-span-2 h-full"
                    : "aspect-4/5"
              }`}
            />
            {resto.map((f) => (
              <Foto
                key={f.archivo}
                evento={e.slug}
                archivo={f.archivo}
                alt={f.alt}
                sizes={
                  horizontal ? "(min-width: 1024px) 29vw, 50vw" : "(min-width: 1024px) 24vw, 40vw"
                }
                className={`w-full rounded-sm object-cover ${horizontal ? "aspect-3/2" : "aspect-4/5"}`}
              />
            ))}
          </div>
        </div>
      </section>
    );
  });
}

/** Cierre de la boda especial: la frase de Rubén Darío con su firma y el salto al portafolio. */
export function CierreEspecial({ evento: e, firma }: { evento: Evento; firma?: Sobre["firma"] }) {
  if (!e.especial?.cierre) return null;
  return (
    <section aria-label="Palabras de Rubén Darío" className={`${seccion} border-t border-linea`}>
      <div className="contenedor max-w-3xl text-center">
        <span aria-hidden="true" className="block font-titulo text-6xl leading-none text-dorado">
          “
        </span>
        <blockquote className="mt-2 font-titulo text-titulo-2">
          <p>{e.especial.cierre}</p>
        </blockquote>
        <div className="mt-8 inline-flex items-center gap-4 text-left">
          {firma && (
            <Foto
              evento="sobre"
              archivo={firma.archivo}
              alt=""
              sizes="56px"
              className="size-14 shrink-0 rounded-full object-cover"
            />
          )}
          <span className="min-w-0">
            <span className="block font-titulo text-titulo-3">Rubén Darío</span>
            <span className="block text-sm text-topo">
              {e.especial.etiqueta} · {e.especial.anio}
            </span>
          </span>
        </div>
        <div className="mt-10">
          <Boton href="/eventos" variante="secundario">
            Mira cómo ha evolucionado su trabajo
          </Boton>
        </div>
      </div>
    </section>
  );
}
