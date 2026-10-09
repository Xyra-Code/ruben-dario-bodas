import { FormularioCotizacion } from "@/components/formulario/FormularioCotizacion";
import { obtenerContenido } from "@/lib/contenido/cargar";
import type { TipoEvento } from "@/lib/contenido/esquemas";

const NECESITO = [
  { dato: "Fecha", detalle: "Aunque sea aproximada: nos dice si tenemos disponibilidad." },
  { dato: "Lugar", detalle: "Hacienda, finca o salón, y el municipio." },
  { dato: "Invitados", detalle: "Un número aproximado basta para dimensionar el montaje." },
  { dato: "Estilo", detalle: "Colores, referencias o fotos que le gusten." },
];

type Props = {
  tipoInicial?: TipoEvento;
  referencia?: string;
  origen: string;
  titulo?: string;
};

/**
 * Cierre de casi todas las páginas (#contacto): formulario + "Qué necesito para
 * cotizarle". En celular el bloque va arriba; desde lg, al lado.
 */
export function SeccionContacto({
  tipoInicial,
  referencia,
  origen,
  titulo = "Cuéntenos de su evento",
}: Props) {
  const { sitio } = obtenerContenido();
  return (
    <section
      id="contacto"
      aria-labelledby="contacto-titulo"
      className="bg-rubor py-(--spacing-seccion)"
    >
      <div className="contenedor grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="min-w-0">
          <p className="antetitulo">Cotización</p>
          <h2 id="contacto-titulo" className="mt-3 text-titulo-2">
            {titulo}
          </h2>
          <p className="mt-4 text-topo">Con la fecha y el lugar le respondemos más rápido.</p>

          <div className="mt-8 border-t border-linea pt-8">
            <h3 className="text-titulo-3">Qué necesito para cotizarle</h3>
            {/* Lista ordenada (no <dl>): el número es decorativo y el orden lo da la lista. */}
            <ol className="mt-5 grid gap-4">
              {NECESITO.map((n, i) => (
                <li key={n.dato} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3">
                  <span aria-hidden="true" className="font-titulo text-xl text-dorado-texto">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium">{n.dato}</p>
                    <p className="text-[0.9375rem] text-topo">{n.detalle}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="min-w-0 rounded-sm bg-marfil p-4 shadow-[0_1px_24px_rgba(43,39,36,0.06)] sm:p-6">
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
