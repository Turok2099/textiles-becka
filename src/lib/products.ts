// Categorías y productos proporcionados por la clienta.

export type ProductCategory = {
  id: string;
  name: string;
  items: string[];
};

export type ProductsCover = { src: string; width: number; height: number; alt: string };

// Portada de la sección de productos. PENDIENTE: la imagen no está en el proyecto.
// Guardarla en public/productos/ (por ejemplo portada.webp) y asignar aquí { src, width, height, alt }.
export const productsCover: ProductsCover | undefined = undefined;

export const products: ProductCategory[] = [
  {
    id: "casual",
    name: "Casual y básicos",
    items: ["Playera básica", "Polo", "Sudadera premium", "Playera de manga larga", "Playera sin mangas", "Sudadera con cierre", "Hoodie con capucha", "Camiseta oversize", "Conjuntos casuales"],
  },
  {
    id: "chamarras",
    name: "Chamarras y chalecos",
    items: ["Chamarra de neopreno", "Bomber jacket", "Rompevientos", "Chaleco acolchado", "Chamarra impermeable", "Chamarra tipo varsity", "Chamarra de mezclilla", "Chaleco de fleece"],
  },
  {
    id: "trabajo-salud",
    name: "Uniformes de trabajo y salud",
    items: ["Overol", "Bata de laboratorio", "Filipinas", "Pantalón clínico", "Conjunto quirúrgico", "Bata de consulta", "Uniforme de limpieza", "Camisa de trabajo", "Mandil", "Filipina de chef", "Pantalón de cocina"],
  },
  {
    id: "escolares",
    name: "Uniformes escolares",
    items: ["Jumper", "Pants", "Falda", "Polo", "Playera deportiva", "Chamarra invernal", "Sudadera generacional", "Pantalón de vestir", "Camisa escolar", "Blusa escolar", "Suéter", "Short deportivo", "Bermuda", "Conjunto deportivo escolar"],
  },
  {
    id: "deportivos",
    name: "Ropa y uniformes deportivos",
    items: ["Pants", "Uniformes de fútbol y voleibol", "Pants infantil", "Leggings", "Traje de baño y leotardo de gimnasia", "Jersey deportivo", "Short", "Conjunto de entrenamiento", "Chamarra deportiva", "Uniforme de básquetbol", "Uniforme de béisbol", "Falda deportiva", "Top deportivo", "Playera deportiva infantil", "Short infantil"],
  },
  {
    id: "accesorios",
    name: "Accesorios",
    items: ["Bolsa tote", "Gorra", "Mochila", "Bolsa deportiva", "Visera", "Cosmetiquera", "Estuche textil"],
  },
];
