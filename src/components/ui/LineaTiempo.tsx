type Hito = { anio: string; texto: string };

/**
 * Trayectoria: línea vertical con el año en dorado. En celular el año va arriba del
 * texto; desde sm, a la izquierda.
 */
export function LineaTiempo({ hitos }: { hitos: Hito[] }) {
  return (
    <ol className="relative border-l border-dorado/50 pl-6 sm:pl-10">
      {hitos.map((h) => (
        <li key={`${h.anio}-${h.texto}`} className="relative pb-10 last:pb-0">
          <span
            aria-hidden="true"
            className="absolute top-2 -left-[calc(1.5rem+5px)] size-2.5 rounded-full bg-dorado sm:-left-[calc(2.5rem+5px)]"
          />
          <div className="grid gap-1 sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-6">
            <p className="font-titulo text-3xl leading-none text-dorado-texto">{h.anio}</p>
            <p className="min-w-0 text-topo">{h.texto}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
