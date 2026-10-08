import Link from "next/link";

import { metadatos } from "@/lib/seo/metadatos";

export const metadata = metadatos({
  titulo: "Página no encontrada | Rubén Darío Diseñador de Bodas",
  descripcion:
    "La página que busca no existe. Vea nuestra decoración de bodas, fiestas de 15 años y el portafolio de eventos en Villavicencio y el Meta.",
  ruta: "/404",
  noIndexar: true,
});

// Esqueleto de la Fase 3. Se publica como out/404.html (wrangler: not_found_handling).
export default function NoEncontrada() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl">Esta página no existe, pero su evento sí puede</h1>
      <ul className="mt-4">
        <li>
          <Link href="/bodas">Decoración de bodas</Link>
        </li>
        <li>
          <Link href="/quince-anos">Decoración de 15 años</Link>
        </li>
        <li>
          <Link href="/eventos">Eventos realizados</Link>
        </li>
      </ul>
    </main>
  );
}
