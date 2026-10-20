type Props = {
  texto: string;
  autor: string;
  /** "Boda en Hacienda El Caney" o "Boda" / "15 años". */
  detalle?: string;
  /** Página del evento: el detalle pasa a ser un enlace ("Ver la boda"). */
  href?: string;
  /** "destacada": grande y centrada (página de evento). "tarjeta": en grillas. */
  variante?: "tarjeta" | "destacada";
};

/** Testimonio con comillas editoriales en dorado. */
export function Cita({ texto, autor, detalle, href, variante = "tarjeta" }: Props) {
  const destacada = variante === "destacada";
  return (
    <figure
      className={
        destacada
          ? "mx-auto max-w-3xl text-center"
          : "flex h-full min-w-0 flex-col rounded-sm border border-linea bg-superficie/60 p-6 sm:p-8"
      }
    >
      <span
        aria-hidden="true"
        className={`block font-titulo leading-none text-dorado ${destacada ? "text-6xl" : "text-5xl"}`}
      >
        “
      </span>
      <blockquote
        className={`font-titulo ${destacada ? "text-titulo-2 italic" : "flex-1 text-xl leading-snug"}`}
      >
        <p>{texto}</p>
      </blockquote>
      <figcaption className="mt-5 text-sm">
        <span className="font-medium text-carbon">{autor}</span>
        {detalle && !href && <span className="text-topo"> · {detalle}</span>}
        {detalle && href && (
          <a
            href={href}
            className="mt-1 inline-flex min-h-11 items-center gap-1.5 text-terracota underline-offset-4 hover:underline"
          >
            <span className="min-w-0">{detalle}</span>
            <span aria-hidden="true">→</span>
          </a>
        )}
      </figcaption>
    </figure>
  );
}
