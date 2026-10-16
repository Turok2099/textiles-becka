// Artículos promocionales: subcategorías y productos proporcionados por la clienta.

export type PromoCategory = {
  id: string;
  name: string;
  items: string[];
};

export const promoCategories: PromoCategory[] = [
  { id: "termos", name: "Termos y botellas", items: ["Termos", "Vasos térmicos", "Botellas para agua", "Botellas deportivas"] },
  { id: "tazas", name: "Tazas y tarros", items: ["Tazas de cerámica", "Tazas mágicas", "Tazas con foto o logotipo", "Tarros cerveceros"] },
  { id: "vasos", name: "Vasos personalizados", items: ["Vasos con tapa y popote", "Vasos de plástico reutilizables", "Vasos de vidrio", "Tequileros"] },
  { id: "papeleria", name: "Papelería y oficina", items: ["Plumas", "Libretas personalizadas", "Libretas de pasta dura", "Libretas de bolsillo", "Agendas personalizadas"] },
  { id: "accesorios", name: "Accesorios promocionales", items: ["Pines"] },
];
