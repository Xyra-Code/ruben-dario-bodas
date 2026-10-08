import { Boton } from "@/components/ui/Boton";
import { Foto } from "@/components/ui/Foto";
import { obtenerContenido } from "@/lib/contenido/cargar";
import { metadatos } from "@/lib/seo/metadatos";
import { MENSAJES, enlaceWhatsApp } from "@/lib/whatsapp";

export const metadata = metadatos({
  titulo: "Página no encontrada | Rubén Darío Diseñador de Bodas",
  descripcion:
    "La página que busca no existe. Vea nuestra decoración de bodas, fiestas de 15 años y el portafolio de eventos en Villavicencio y el Meta.",
  ruta: "/404",
  noIndexar: true,
});

/** 404 (brief §7.9): mensaje amable y caminos útiles. Se publica como out/404.html. */
export default function NoEncontrada() {
  const { sitio, eventos } = obtenerContenido();
  const evento = eventos[0];
  const foto = evento?.fotos.find((f) => f.archivo !== evento.portada) ?? evento?.fotos[0];

  return (
    <main className="contenedor grid items-center gap-10 pt-8 pb-(--spacing-seccion) lg:grid-cols-2 lg:gap-16 lg:pt-14">
      <div className="min-w-0">
        <p className="antetitulo">Error 404</p>
        <h1 className="mt-4 text-titulo-1">Esta página no existe, pero su evento sí puede</h1>
        <p className="mt-5 text-lg text-topo">
          Puede que el enlace haya cambiado. Estos caminos lo llevan a lo que busca:
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Boton href="/bodas">Decoración de bodas</Boton>
          <Boton href="/quince-anos" variante="secundario">
            Decoración de 15 años
          </Boton>
          <Boton href="/eventos" variante="secundario">
            Eventos realizados
          </Boton>
        </div>
        <div className="mt-6">
          <Boton
            href={enlaceWhatsApp(sitio.whatsapp, MENSAJES.general)}
            whatsapp
            variante="texto"
            origen="404"
          >
            Escríbanos por WhatsApp
          </Boton>
        </div>
      </div>
      {evento && foto && (
        <div className="min-w-0">
          <Foto
            evento={evento.slug}
            archivo={foto.archivo}
            alt={foto.alt}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="aspect-[4/5] w-full rounded-sm object-cover opacity-90 sm:aspect-[3/2] lg:aspect-[4/5]"
          />
        </div>
      )}
    </main>
  );
}
