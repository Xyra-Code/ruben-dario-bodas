type Paso = { titulo: string; descripcion: string };

/**
 * Pasos numerados con estilo editorial (01, 02…): una columna en celular, en fila desde
 * lg. Es una lista ordenada: el orden importa y los lectores de pantalla lo anuncian.
 */
export function Pasos({ pasos }: { pasos: Paso[] }) {
  return (
    <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(min(11rem,100%),1fr))]">
      {pasos.map((p, i) => (
        <li key={p.titulo} className="min-w-0 border-t border-linea pt-5">
          <span aria-hidden="true" className="block font-titulo text-4xl text-dorado-texto">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-3 text-titulo-3">{p.titulo}</h3>
          <p className="mt-2 text-[0.9375rem] text-topo">{p.descripcion}</p>
        </li>
      ))}
    </ol>
  );
}
