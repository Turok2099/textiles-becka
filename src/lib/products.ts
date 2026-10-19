// Categorías y productos proporcionados por la clienta.

export type ProductCategory = {
  id: string;
  name: string;
  items: string[];
  image?: { src: string; width: number; height: number; alt: string };
};

export type ProductsCover = { src: string; width: number; height: number; alt: string };

// Portada de la sección de productos (public/productos/portada.webp, recortada de la imagen original).
export const productsCover: ProductsCover | undefined = {
  src: "/productos/portada.webp",
  width: 1578,
  height: 666,
  alt: "Chamarras, sudaderas, camisas y polos con logotipos bordados y estampados, presentados en maniquíes y percheros",
};

export const products: ProductCategory[] = [
  {
    id: "casual",
    name: "Casual y básicos",
    image: { src: "/productos/casual.webp", width: 928, height: 1152, alt: "Polo negro con cuello y puños en gris jaspeado y logotipo bordado en el pecho" },
    items: ["Playera básica", "Polo", "Sudadera premium", "Playera de manga larga", "Playera sin mangas", "Sudadera con cierre", "Hoodie con capucha", "Camiseta oversize", "Conjuntos casuales"],
  },
  {
    id: "chamarras",
    name: "Chamarras y chalecos",
    image: { src: "/productos/chamarras.webp", width: 928, height: 1152, alt: "Sudadera con capucha en bloques blanco, rojo y azul marino, con letras y número estampados" },
    items: ["Chamarra de neopreno", "Bomber jacket", "Rompevientos", "Chaleco acolchado", "Chamarra impermeable", "Chamarra tipo varsity", "Chamarra de mezclilla", "Chaleco de fleece"],
  },
  {
    id: "trabajo-salud",
    name: "Uniformes de trabajo y salud",
    image: { src: "/productos/trabajo-salud.webp", width: 928, height: 1152, alt: "Hombre y mujer con camisas de trabajo de manga larga, azul marino y azul claro de rayas finas, con logotipo bordado en el pecho" },
    items: ["Overol", "Bata de laboratorio", "Filipinas", "Pantalón clínico", "Conjunto quirúrgico", "Bata de consulta", "Uniforme de limpieza", "Camisa de trabajo", "Mandil", "Filipina de chef", "Pantalón de cocina"],
  },
  {
    id: "escolares",
    name: "Uniformes escolares",
    image: { src: "/productos/escolares.webp", width: 928, height: 1152, alt: "Estudiante con uniforme escolar: chamarra roja y azul marino, polo blanco y pants azul marino" },
    items: ["Jumper", "Pants", "Falda", "Polo", "Playera deportiva", "Chamarra invernal", "Sudadera generacional", "Pantalón de vestir", "Camisa escolar", "Blusa escolar", "Suéter", "Short deportivo", "Bermuda", "Conjunto deportivo escolar"],
  },
  {
    id: "deportivos",
    name: "Ropa y uniformes deportivos",
    image: { src: "/productos/deportivos.webp", width: 928, height: 1152, alt: "Chamarra tipo varsity azul con mangas blancas, rayas en cuello y puños, y letras bordadas en las mangas" },
    items: ["Pants", "Uniformes de fútbol y voleibol", "Pants infantil", "Leggings", "Traje de baño y leotardo de gimnasia", "Jersey deportivo", "Short", "Conjunto de entrenamiento", "Chamarra deportiva", "Uniforme de básquetbol", "Uniforme de béisbol", "Falda deportiva", "Top deportivo", "Playera deportiva infantil", "Short infantil"],
  },
  {
    id: "accesorios",
    name: "Accesorios",
    image: { src: "/productos/accesorios.webp", width: 928, height: 1152, alt: "Gorras negras con logotipo bordado en colores al frente y en la parte trasera" },
    items: ["Bolsa tote", "Gorra", "Mochila", "Bolsa deportiva", "Visera", "Cosmetiquera", "Estuche textil"],
  },
];
