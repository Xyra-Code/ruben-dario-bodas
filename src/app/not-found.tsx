import Link from "next/link";

import { Boton, clasesBoton } from "@/components/ui/Boton";
import { obtenerContenido } from "@/lib/contenido/cargar";
import { RUTA_VESTIDOS, RUTA_VESTIDOS_QUINCE } from "@/lib/rutas";
import { metadatos } from "@/lib/seo/metadatos";
import { MENSAJES, enlaceWhatsApp } from "@/lib/whatsapp";

export const metadata = metadatos({
  titulo: "Página no encontrada | Rubén Darío Diseñador de Bodas",
  descripcion:
    "La página que buscas no existe. Mira nuestra decoración de bodas, fiestas de 15 años y el portafolio de eventos en Villavicencio y el Meta.",
  ruta: "/404",
  noIndexar: true,
});

/** Nombres cortos, como en el menú: en celular caben en dos filas. */
const CAMINOS = [
  { nombre: "Bodas", ruta: "/bodas" },
  { nombre: "Fiestas de 15", ruta: "/fiestas-de-15" },
  { nombre: "Eventos", ruta: "/eventos" },
  { nombre: "Vestidos de novia", ruta: RUTA_VESTIDOS },
  { nombre: "Vestidos de 15", ruta: RUTA_VESTIDOS_QUINCE },
];

/**
 * 404 (brief §7.9): a propósito no se parece a las demás páginas. Sin foto y centrada, con el
 * número como elemento dominante, para que se entienda de inmediato que la página no existe.
 * Todo cabe en una pantalla, sin scroll: `pagina-404` oculta el pie (globals.css), y el número
 * y los espacios (--e) dependen de la altura. En celular horizontal va a dos columnas, y bajo
 * 560 px de alto las frases de apoyo solo quedan para lectores de pantalla. Nada se recorta: si
 * la pantalla no alcanza (zoom alto), la página vuelve a desplazarse.
 * Se publica como out/404.html.
 */
export default function NoEncontrada() {
  const { sitio } = obtenerContenido();

  return (
    <main className="pagina-404 contenedor flex flex-1 flex-col items-center justify-center py-[clamp(0.75rem,3svh,2rem)] text-center [--e:clamp(0.375rem,2.4svh,1.5rem)] [@media(max-height:500px)_and_(orientation:landscape)]:flex-row [@media(max-height:500px)_and_(orientation:landscape)]:gap-4">
      <div className="flex flex-col items-center [@media(max-height:500px)_and_(orientation:landscape)]:min-w-0 [@media(max-height:500px)_and_(orientation:landscape)]:flex-1">
        {/* El h1 ya dice lo mismo con palabras: el lector de pantalla no necesita el número. */}
        <p
          aria-hidden="true"
          className="font-titulo text-[clamp(4.5rem,min(30vw,22svh),15rem)] leading-[0.85] text-terracota [@media(max-height:560px)]:text-[4rem]"
        >
          404
        </p>
        <h1 className="mt-(--e) text-titulo-2">Esta página no existe</h1>
        <p className="mt-[calc(var(--e)/2)] max-w-[60ch] text-topo sm:text-lg">
          Puede que el enlace esté mal escrito o que la página ya no exista.
        </p>
      </div>

      <div className="mt-(--e) flex flex-col items-center [@media(max-height:500px)_and_(orientation:landscape)]:mt-0 [@media(max-height:500px)_and_(orientation:landscape)]:min-w-0 [@media(max-height:500px)_and_(orientation:landscape)]:flex-1">
        <Boton href="/">Volver al inicio</Boton>

        <nav aria-labelledby="caminos-404" className="mt-(--e)">
          <p id="caminos-404" className="text-sm text-topo [@media(max-height:560px)]:sr-only">
            O ve directo a
          </p>
          <ul className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6">
            {CAMINOS.map((c) => (
              <li key={c.ruta}>
                <Link href={c.ruta} className={clasesBoton("texto")}>
                  {c.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-[calc(var(--e)/2)]">
          <p className="text-sm text-topo [@media(max-height:560px)]:sr-only">
            ¿No encuentras lo que buscas?
          </p>
          <Boton
            href={enlaceWhatsApp(sitio.whatsapp, MENSAJES.noEncontrada)}
            whatsapp
            variante="texto"
            origen="404"
          >
            Escríbenos por WhatsApp
          </Boton>
        </div>
      </div>
    </main>
  );
}
