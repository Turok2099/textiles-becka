// Datos comerciales de BKTX. Editar aquí; los componentes solo leen este archivo.
// Lo confirmado viene de las redes de la clienta (nombre "Becka uniformes", "Pedidos y catálogo",
// enlace de WhatsApp en la bio de Instagram). Todo lo demás es propuesta editable.

export const site = {
  name: "BKTX",
  description:
    "Uniformes escolares, deportivos y empresariales, playeras y sudaderas personalizadas con bordado, sublimación o DTF. Pedidos y catálogo por WhatsApp.",
  hero: {
    eyebrow: "Uniformes y textiles",
    title:
      "Uniformes y productos textiles personalizados, tu idea en cada detalle",
    image: {
      src: "/productos/hero.webp",
      width: 928,
      height: 1152,
      alt: "Collage de uniformes personalizados: camisas de trabajo, chamarra softshell, sudadera con capucha roja y gorras negras, todas con logotipos bordados",
    },
    description:
      "Conoce lo que ofrecemos y escríbenos para pedidos y catálogo.",
    cta: { label: "Explorar productos", href: "#productos" },
  },
  nav: [
    { label: "Productos", href: "/#productos" },
    { label: "Clientes", href: "/#clientes" },
    { label: "Promocionales", href: "/#promocionales" },
    { label: "Servicios", href: "/#servicios" },
    { label: "Nosotros", href: "/nosotros" },
    { label: "Contacto", href: "/#contacto" },
  ],
  // Resumen de "Nosotros" en la portada. Texto proporcionado por la clienta; no añadir cifras, certificaciones ni promesas.
  about: {
    eyebrow: "Sobre BKTX",
    title: "Tus ideas, la identidad de tu marca.",
    paragraphs: [
      "En BKTX transformamos ideas en prendas y productos personalizados que representan la identidad de cada marca.",
      "Fabricamos y personalizamos uniformes y prendas textiles, y ofrecemos productos promocionales para empresas, negocios e instituciones. Te acompañamos desde la selección de materiales y diseños hasta la confección y personalización de cada proyecto.",
    ],
    link: { label: "Conoce más sobre BKTX", href: "/nosotros" },
    image: {
      src: "/nosotros/04-resumen-portada.png",
      width: 1122,
      height: 1402,
      alt: "Manos sosteniendo una chaqueta morada con el nombre BKTX bordado en el bolsillo, junto a una máquina de coser",
    },
  },
  contact: {
    description: "Escríbenos por WhatsApp o llámanos para pedidos y catálogo.",
    // Teléfono proporcionado por la clienta: +52 55 4568 3821.
    phone: { label: "+52 55 4568 3821", href: "tel:+525545683821" },
  },
  social: {
    instagram: {
      label: "Instagram",
      handle: "@beckauniformes",
      href: "https://www.instagram.com/bktxsolucionestextiles/",
    },
    tiktok: {
      label: "TikTok",
      handle: "@rebecaat0",
      href: "https://www.tiktok.com/@rebecaat0",
    },
    // Número confirmado por el equipo: +52 55 2079 8115.
    whatsapp: {
      label: "WhatsApp",
      number: "525520798115",
      href: `https://wa.me/525520798115?text=${encodeURIComponent("Hola, quiero información sobre pedidos y catálogo de BKTX.")}`,
    },
  },
} as const;
