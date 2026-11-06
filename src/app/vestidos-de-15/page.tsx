import { PaginaVestidos } from "@/components/plantillas/PaginaVestidos";
import { obtenerContenido } from "@/lib/contenido/cargar";
import { ogPagina } from "@/lib/imagenes";
import { RUTA_SERVICIO, RUTA_VESTIDOS, RUTA_VESTIDOS_QUINCE } from "@/lib/rutas";
import { metadatos } from "@/lib/seo/metadatos";
import { MENSAJES } from "@/lib/whatsapp";

const seo = obtenerContenido().vestidosQuince;

export const metadata = metadatos({
  titulo: seo.seo.title,
  descripcion: seo.seo.description,
  ruta: RUTA_VESTIDOS_QUINCE,
  imagen: ogPagina("vestidosQuince", seo.nombre),
});

/** Vestidos de 15 años a medida: otra búsqueda que /fiestas-de-15, que compite por decoración. */
export default function VestidosQuince() {
  return (
    <PaginaVestidos
      contenido={obtenerContenido().vestidosQuince}
      ruta={RUTA_VESTIDOS_QUINCE}
      miga="Vestidos de 15 años"
      mensaje={MENSAJES.vestidoQuince}
      origen="vestidos-quince"
      origenPreguntas="vestidoQuince"
      otroVestido={{ ruta: RUTA_VESTIDOS, texto: "¿Es para tu boda? Mira los vestidos de novia" }}
      cierre={{
        texto: "Escríbenos con la fecha de tus 15 y, si las tienes, fotos de vestidos que te gusten.",
        enlace: {
          ruta: RUTA_SERVICIO.quince!,
          pregunta: "¿También buscas la fiesta?",
          texto: "Decoración y organización de 15 años",
        },
      }}
    />
  );
}
