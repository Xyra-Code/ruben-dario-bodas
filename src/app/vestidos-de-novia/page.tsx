import { PaginaVestidos } from "@/components/plantillas/PaginaVestidos";
import { obtenerContenido } from "@/lib/contenido/cargar";
import { ogPagina } from "@/lib/imagenes";
import { RUTA_SERVICIO, RUTA_VESTIDOS, RUTA_VESTIDOS_QUINCE } from "@/lib/rutas";
import { metadatos } from "@/lib/seo/metadatos";
import { MENSAJES } from "@/lib/whatsapp";

const seo = obtenerContenido().vestidos;

export const metadata = metadatos({
  titulo: seo.seo.title,
  descripcion: seo.seo.description,
  ruta: RUTA_VESTIDOS,
  imagen: ogPagina("vestidos", seo.nombre),
});

/** Vestidos de novia a medida: otra búsqueda que /bodas, por eso tiene página propia. */
export default function Vestidos() {
  return (
    <PaginaVestidos
      contenido={obtenerContenido().vestidos}
      ruta={RUTA_VESTIDOS}
      miga="Vestidos de novia"
      mensaje={MENSAJES.vestido}
      origen="vestidos"
      origenPreguntas="vestido"
      otroVestido={{ ruta: RUTA_VESTIDOS_QUINCE, texto: "¿Es para tus 15? Mira los vestidos de 15 años" }}
      cierre={{
        texto: "Escríbenos con la fecha de tu boda y, si las tienes, fotos de vestidos que te gusten.",
        enlace: {
          ruta: RUTA_SERVICIO.boda!,
          pregunta: "¿También buscas la decoración?",
          texto: "Wedding planner y decoración de bodas",
        },
      }}
    />
  );
}
