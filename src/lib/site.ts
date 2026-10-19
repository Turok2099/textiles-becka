// Datos comerciales de Beckatex. Editar aquí; los componentes solo leen este archivo.
// Lo confirmado viene de las redes de la clienta (nombre "Becka uniformes", "Pedidos y catálogo",
// enlace de WhatsApp en la bio de Instagram). Todo lo demás es propuesta editable.

export const site = {
  name: "Beckatex",
  description:
    "Uniformes escolares, deportivos y empresariales, playeras y sudaderas personalizadas con bordado, sublimación o DTF. Pedidos y catálogo por WhatsApp.",
  hero: {
    eyebrow: "Uniformes y textiles",
    title: "Uniformes y productos textiles con el sello de Beckatex",
    description: "Conoce lo que ofrecemos y escríbenos para pedidos y catálogo.",
    cta: { label: "Explorar productos", href: "#productos" },
  },
  nav: [
    { label: "Productos", href: "#productos" },
    { label: "Clientes", href: "#clientes" },
    { label: "Promocionales", href: "#promocionales" },
    { label: "Servicios", href: "#servicios" },
    { label: "Nosotros", href: "#nosotros" },
    { label: "Contacto", href: "#contacto" },
  ],
  about: {
    title: "Beckatex",
    // Propuesta editable. No incluye antigüedad, ubicación, capacidad ni certificaciones.
    paragraphs: [
      "Beckatex es un negocio de uniformes y productos textiles. Aquí reunimos lo que ofrecemos para que puedas conocerlo y consultarnos.",
      "Para pedidos y catálogo, escríbenos por WhatsApp o síguenos en redes sociales.",
    ],
  },
  contact: {
    description: "Escríbenos por WhatsApp o llámanos para pedidos y catálogo.",
    // Teléfono proporcionado por la clienta: +52 55 4568 3821.
    phone: { label: "+52 55 4568 3821", href: "tel:+525545683821" },
  },
  social: {
    instagram: { label: "Instagram", handle: "@beckauniformes", href: "https://www.instagram.com/beckauniformes/" },
    tiktok: { label: "TikTok", handle: "@rebecaat0", href: "https://www.tiktok.com/@rebecaat0" },
    // Número confirmado por el equipo: +52 55 2079 8115.
    whatsapp: {
      label: "WhatsApp",
      number: "525520798115",
      href: `https://wa.me/525520798115?text=${encodeURIComponent("Hola, quiero información sobre pedidos y catálogo de Beckatex.")}`,
    },
  },
} as const;
