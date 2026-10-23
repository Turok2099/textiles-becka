// Datos estructurados (schema.org) en una etiqueta JSON-LD. Sin datos (p. ej. sin dominio configurado), no se emite nada.
export function JsonLd({ data }: Readonly<{ data: object | undefined }>) {
  if (!data) return null;
  // "<" escapado para que ningún texto pueda cerrar la etiqueta <script>.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
