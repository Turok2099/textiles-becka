// Productos. IMPORTANTE: mientras `productsAreDemo` sea true, estas tarjetas son DATOS DE DEMOSTRACIÓN,
// no un catálogo confirmado. Reemplazar por productos reales con foto autorizada.
// Para agregar foto: colocar el archivo en /public/productos y completar `image`.

export type Product = {
  id: string;
  name: string;
  description: string;
  image?: { src: string; alt: string; width: number; height: number };
};

export const productsAreDemo = true;

export const products: Product[] = [
  { id: "uniformes", name: "Uniformes", description: "Línea principal de Becka. Aquí irá la descripción real." },
  { id: "ejemplo-2", name: "Producto de ejemplo", description: "Texto de demostración. Reemplazar con un producto confirmado." },
  { id: "ejemplo-3", name: "Producto de ejemplo", description: "Texto de demostración. Reemplazar con un producto confirmado." },
  { id: "ejemplo-4", name: "Producto de ejemplo", description: "Texto de demostración. Reemplazar con un producto confirmado." },
];
