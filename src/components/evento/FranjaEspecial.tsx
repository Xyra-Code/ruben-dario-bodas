import { ConAmpersand } from "@/components/ui/ConAmpersand";
import { EnlaceLugar } from "@/components/ui/EnlaceLugar";
import { Foto } from "@/components/ui/Foto";
import type { Evento } from "@/lib/contenido/cargar";
import { rutaEvento } from "@/lib/rutas";

/**
 * Franja de la portada para la boda especial ("Donde empezó todo"): la única sección
 * oscura de la página, para que se lea como un capítulo aparte de la trayectoria.
 * Foto de la pareja, el año grande en dorado, la frase de Rubén Darío y el enlace.
 */
export function FranjaEspecial({ evento: e }: { evento: Evento }) {
  if (!e.especial) return null;
  const foto = e.fotos.find((f) => f.archivo === e.portada)!;
  return (
    <section
      aria-labelledby="especial-titulo"
      className="bg-bosque grano py-(--spacing-seccion) text-marfil"
    >
      <div className="contenedor grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="relative mx-auto w-full max-w-md min-w-0 lg:col-span-5 lg:max-w-none">
          <span
            aria-hidden="true"
            className="absolute inset-0 translate-x-3 translate-y-3 border border-dorado/60 sm:translate-x-4 sm:translate-y-4"
          />
          <Foto
            evento={e.slug}
            archivo={foto.archivo}
            alt={foto.alt}
            posicion={foto.encuadre}
            sizes="(min-width: 1024px) 40vw, (min-width: 448px) 28rem, 100vw"
            className="relative aspect-4/5 w-full rounded-sm object-cover"
          />
        </div>

        <div className="min-w-0 lg:col-span-7">
          <p className="text-xs font-semibold tracking-[0.22em] text-dorado uppercase">
            {e.especial.etiqueta}
          </p>
          <p
            aria-hidden="true"
            className="mt-2 font-titulo text-[clamp(4rem,3rem+5vw,7.5rem)] leading-none text-dorado"
          >
            {e.especial.anio}
          </p>
          <h2 id="especial-titulo" className="sr-only">
            {e.especial.etiqueta}: la boda de {e.nombres}, {e.especial.anio}
          </h2>
          <blockquote className="mt-6 font-titulo text-titulo-2">
            <p>“{e.especial.frase}”</p>
          </blockquote>
          <p className="mt-5 text-marfil/75">
            Rubén Darío, sobre la boda de{" "}
            {e.nombres ? <ConAmpersand texto={e.nombres} /> : e.titulo} ·{" "}
            <EnlaceLugar lugar={e.lugar} sobreOscuro />
          </p>
          <a
            href={rutaEvento(e.slug)}
            className="mt-8 inline-flex min-h-12 items-center gap-2.5 rounded-boton border border-dorado px-6 text-[0.9375rem] font-medium tracking-wide text-dorado transition-colors duration-200 hover:bg-dorado hover:text-carbon"
          >
            Conoce esta historia
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
