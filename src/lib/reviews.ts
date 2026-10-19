// Opiniones de clientes. Solo reseñas reales y autorizadas por quien las escribió.

export type Review = {
  id: string;
  name: string;
  detail?: string; // empresa, ciudad o producto comprado
  text: string;
  rating: 1 | 2 | 3 | 4 | 5;
};

// Agregar aquí las reseñas reales. Al haber al menos una, desaparecen los textos de ejemplo.
const realReviews: Review[] = [];

// MAQUETA: textos ficticios solo para ver el diseño. No publicar como opiniones reales.
const mockReviews: Review[] = [
  { id: "m1", name: "María G.", detail: "Uniformes de empresa", text: "Texto de ejemplo: describe aquí la experiencia del cliente con la calidad de las prendas y la atención recibida.", rating: 5 },
  { id: "m2", name: "Carlos R.", detail: "Uniformes escolares", text: "Texto de ejemplo: opinión breve sobre los tiempos de entrega y el acabado del bordado.", rating: 5 },
  { id: "m3", name: "Laura M.", detail: "Artículos promocionales", text: "Texto de ejemplo: comentario sobre la personalización de termos, libretas u otros productos.", rating: 5 },
  { id: "m4", name: "José H.", detail: "Ropa deportiva", text: "Texto de ejemplo: comentario sobre la comodidad de los uniformes deportivos y el trato del equipo.", rating: 5 },
  { id: "m5", name: "Ana P.", detail: "Chamarras personalizadas", text: "Texto de ejemplo: opinión sobre el diseño de las chamarras y cómo cumplieron con lo acordado.", rating: 5 },
  { id: "m6", name: "Luis F.", detail: "Pedido para evento", text: "Texto de ejemplo: comentario sobre la rapidez en la cotización y la comunicación durante el pedido.", rating: 5 },
];

export const isMockReviews = realReviews.length === 0;
export const reviews: Review[] = isMockReviews ? mockReviews : realReviews;
