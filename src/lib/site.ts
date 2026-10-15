// Datos comerciales de Textiles Becka. Editar aquí; los componentes solo leen este archivo.
// Lo confirmado viene de las redes de la clienta (nombre "Becka uniformes", "Pedidos y catálogo",
// enlace de WhatsApp en la bio de Instagram). Todo lo demás es propuesta editable.

export const site = {
  name: "Textiles Becka",
  description:
    "Textiles Becka: uniformes y productos textiles. Conoce los productos y escribe por WhatsApp para pedidos y catálogo.",
  hero: {
    eyebrow: "Uniformes y textiles",
    title: "Uniformes y productos textiles con el sello de Becka",
    description: "Conoce lo que ofrecemos y escríbenos para pedidos y catálogo.",
    cta: { label: "Explorar productos", href: "#productos" },
  },
  nav: [
    { label: "Productos", href: "#productos" },
    { label: "Clientes", href: "#clientes" },
    { label: "Nosotros", href: "#nosotros" },
    { label: "Contacto", href: "#contacto" },
  ],
  about: {
    title: "Textiles Becka",
    // Propuesta editable. No incluye antigüedad, ubicación, capacidad ni certificaciones.
    paragraphs: [
      "Textiles Becka es un negocio de uniformes y productos textiles. Aquí reunimos lo que ofrecemos para que puedas conocerlo y consultarnos.",
      "Para pedidos y catálogo, escríbenos por WhatsApp o síguenos en redes sociales.",
    ],
  },
  contact: {
    description: "Escríbenos por WhatsApp o encuéntranos en redes sociales.",
  },
  social: {
    instagram: { label: "Instagram", handle: "@beckauniformes", href: "https://www.instagram.com/beckauniformes/" },
    tiktok: { label: "TikTok", handle: "@rebecaat0", href: "https://www.tiktok.com/@rebecaat0" },
    // Número confirmado por el equipo: +52 55 2079 8115.
    whatsapp: {
      label: "WhatsApp",
      href: `https://wa.me/525520798115?text=${encodeURIComponent("Hola, quiero información sobre pedidos y catálogo de Textiles Becka.")}`,
    },
  },
} as const;
