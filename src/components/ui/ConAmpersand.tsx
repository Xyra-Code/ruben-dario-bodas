/**
 * Texto con la "&" de las parejas ("Caro & Andy") en la cursiva de cita. La "&" de la
 * letra de títulos se ve rara; en invitaciones es clásico tomarla de otra familia.
 * Solo para textos en letra de título: en Manrope la "&" normal se ve bien.
 */
export function ConAmpersand({ texto }: { texto: string }) {
  const partes = texto.split("&");
  return partes.map((parte, i) => (
    <span key={i}>
      {parte}
      {i < partes.length - 1 && <span className="ampersand">&amp;</span>}
    </span>
  ));
}
