import { FormularioCotizacion } from "@/components/formulario/FormularioCotizacion";
import { obtenerContenido } from "@/lib/contenido/cargar";
import type { TipoEvento } from "@/lib/contenido/esquemas";

const NECESITO = [
  { dato: "Fecha", detalle: "Aunque sea aproximada: nos dice si tenemos disponibilidad." },
  { dato: "Lugar", detalle: "Hacienda, finca o salón, y el municipio." },
  { dato: "Invitados", detalle: "Un número aproximado basta para dimensionar el montaje." },
  { dato: "Estilo", detalle: "Colores, referencias o fotos que te gusten." },
  { dato: "Presupuesto", detalle: "Un rango aproximado: así te proponemos un diseño a tu medida." },
];

type Props = {
  tipoInicial?: TipoEvento;
  referencia?: string;
  origen: string;
  titulo?: string;
};

// Sobre terracota, el texto va en blanco (5,8 : 1) y los números en oro claro (decorativos).
const c = {
  seccion: "grano bg-terracota text-sobre-principal",
  ante: "text-sobre-principal/85!",
  suave: "text-sobre-principal/85",
  borde: "border-sobre-principal/25",
  numero: "text-[#f1d29b]",
};

/**
 * Cierre de casi todas las páginas (#contacto): formulario + "Qué necesito para
 * cotizarte". En celular el bloque va arriba; desde lg, al lado. Es la única banda
 * terracota de cada página (src/lib/fondos.ts): en todas, terracota = aquí se cotiza.
 */
export function SeccionContacto({
  tipoInicial,
  referencia,
  origen,
  titulo = "Cuéntanos de tu evento",
}: Props) {
  const { sitio } = obtenerContenido();
  return (
    <section
      id="contacto"
      aria-labelledby="contacto-titulo"
      className={`${c.seccion} py-(--spacing-seccion)`}
    >
      <div className="contenedor grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="min-w-0">
          <p className={`antetitulo ${c.ante}`}>Cotización</p>
          <h2 id="contacto-titulo" className="mt-3 text-titulo-2">
            {titulo}
          </h2>
          <p className={`mt-4 ${c.suave}`}>Con la fecha y el lugar te respondemos más rápido.</p>

          <div className={`mt-8 border-t pt-8 ${c.borde}`}>
            <h3 className="text-titulo-3">Qué necesito para cotizarte</h3>
            {/* Lista ordenada (no <dl>): el número es decorativo y el orden lo da la lista. */}
            <ol className="mt-5 grid gap-4">
              {NECESITO.map((n, i) => (
                <li key={n.dato} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3">
                  <span aria-hidden="true" className={`font-titulo text-xl ${c.numero}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium">{n.dato}</p>
                    <p className={`text-[0.9375rem] ${c.suave}`}>{n.detalle}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="min-w-0 rounded-sm bg-marfil p-4 text-carbon shadow-[0_1px_24px_rgba(43,39,36,0.06)] sm:p-6">
          <FormularioCotizacion
            whatsapp={sitio.whatsapp}
            presupuestos={sitio.presupuestos}
            tipoInicial={tipoInicial}
            referencia={referencia}
            origen={origen}
          />
        </div>
      </div>
    </section>
  );
}
