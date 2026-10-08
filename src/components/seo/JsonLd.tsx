/**
 * Inserta datos estructurados en la página. Varios nodos van en un solo `@graph`.
 * Se escapa `<` (recomendación de Next) para que ningún texto rompa el <script>.
 */
export function JsonLd({ datos }: { datos: Record<string, unknown>[] }) {
  const grafo = { "@context": "https://schema.org", "@graph": datos };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(grafo).replace(/</g, "\\u003c") }}
    />
  );
}
