// Páginas por línea de producto y técnica (una URL por tema, enlazadas desde la portada).
// Los textos son explicaciones generales redactadas a partir de lo que ya está en products.ts, promo.ts, services.ts y nosotros.ts.
// No añadir ciudad, precios, materiales, tiempos de entrega, mínimos, certificaciones ni promesas sin confirmación del propietario.

import type { Metadata } from "next";
import { slotId } from "@/lib/image-slots";
import { pageMetadata } from "@/lib/seo";

export type Topic = {
  slug: string;
  group: "producto" | "tecnica" | "promocional";
  name: string; // nombre corto para enlaces y migas de pan
  blurb: string; // frase corta para las tarjetas de "También te puede interesar"
  metaTitle: string; // la plantilla del layout añade " | BKTX"
  metaDescription: string;
  eyebrow: string;
  h1: string;
  lead: string;
  whatsappText: string;
  // Ranuras de imagen (image-slots.ts) de las que salen las fotos y, en productos, la lista de artículos.
  slots: string[];
  itemsTitle: string;
  itemsIntro: string;
  items?: string[]; // si falta, se toman de products.ts
  cover?: "promo"; // imagen de portada cuando no hay fotos subidas
  sections: { title: string; paragraphs: string[] }[];
  checklistTitle: string;
  checklist: string[];
  related: string[];
};

export const topics: Topic[] = [
  {
    slug: "uniformes-escolares",
    group: "producto",
    name: "Uniformes escolares",
    blurb: "Jumper, pants, polo, chamarra y sudadera generacional con el escudo de tu escuela.",
    metaTitle: "Uniformes escolares en CDMX",
    metaDescription:
      "Uniformes escolares con escudo o logotipo en Ciudad de México: jumper, falda, pants, polo, chamarra y sudadera generacional. Cotiza por WhatsApp.",
    eyebrow: "Uniformes escolares",
    h1: "Uniformes escolares para tu escuela o generación",
    lead: "Fabricamos y personalizamos uniformes escolares con el escudo, el nombre o el logotipo de tu institución. Atendemos escuelas de la Ciudad de México: cuéntanos qué piezas necesitas y te ayudamos a armar el conjunto.",
    whatsappText: "Hola, quiero cotizar uniformes escolares con BKTX.",
    slots: [slotId("productos", "escolares")],
    itemsTitle: "Piezas de uniforme escolar que puedes pedir",
    itemsIntro:
      "Trabajamos las piezas del uniforme de diario, la ropa para el frío y la de educación física. Si tu escuela usa una pieza que no aparece aquí, escríbenos y lo revisamos.",
    sections: [
      {
        title: "Un uniforme completo, no solo una prenda",
        paragraphs: [
          "Un uniforme escolar suele combinar varias piezas: las de diario (jumper, falda, pantalón de vestir, camisa o blusa y polo), las de temporada (suéter y chamarra invernal) y las de educación física (playera deportiva, short, bermuda, pants y conjunto deportivo escolar).",
          "Si organizas el uniforme de una escuela, un grupo o una generación, conviene definir desde el inicio qué piezas lleva cada nivel. Así el conjunto se ve coherente y es más fácil cotizarlo.",
        ],
      },
      {
        title: "Escudo, nombre o logotipo de la escuela",
        paragraphs: [
          "Lo que hace reconocible un uniforme es su identidad: el escudo, el logotipo o el nombre de la institución. Puede bordarse con hilo o aplicarse con otras técnicas de personalización, según la prenda.",
          "En una sudadera generacional se pueden incluir además nombres o el diseño propio del grupo. Cuéntanos tu idea y te orientamos sobre la técnica más adecuada.",
        ],
      },
      {
        title: "Proyectos a la medida de cada institución",
        paragraphs: [
          "Cada escuela tiene sus propios colores y criterios, por eso trabajamos sobre proyectos personalizados: te acompañamos desde la selección de telas, colores y diseños hasta la confección y la personalización de las prendas.",
        ],
      },
    ],
    checklistTitle: "Para cotizar uniformes escolares, ten a la mano",
    checklist: [
      "Las piezas que necesita cada nivel o grupo (diario, deportivo, invierno).",
      "El escudo o logotipo de la escuela, en el mejor archivo que tengas.",
      "Los colores del uniforme actual o una foto como referencia.",
      "La cantidad aproximada de piezas y las tallas que necesitas.",
    ],
    related: ["uniformes-deportivos", "bordado", "dtf"],
  },
  {
    slug: "uniformes-deportivos",
    group: "producto",
    name: "Uniformes deportivos",
    blurb: "Jerseys, shorts, pants y conjuntos de entrenamiento para equipos, ligas y escuelas.",
    metaTitle: "Uniformes deportivos personalizados",
    metaDescription:
      "Uniformes deportivos para equipos, ligas y escuelas de Ciudad de México: jerseys, shorts, pants y conjuntos de entrenamiento. Cotiza por WhatsApp.",
    eyebrow: "Ropa y uniformes deportivos",
    h1: "Uniformes deportivos personalizados para tu equipo",
    lead: "Uniformes de competencia y ropa de entrenamiento con el nombre, los colores y el escudo de tu equipo, liga o escuela de la Ciudad de México. Escríbenos y cotizamos juntos tu conjunto.",
    whatsappText: "Hola, quiero cotizar uniformes deportivos con BKTX.",
    slots: [slotId("productos", "deportivos")],
    itemsTitle: "Ropa deportiva que puedes pedir",
    itemsIntro: "Desde el uniforme de juego hasta la ropa para entrenar, en versiones para adulto e infantil.",
    sections: [
      {
        title: "Uniformes de juego por disciplina",
        paragraphs: [
          "Manejamos uniformes de fútbol y voleibol, de básquetbol y de béisbol, además de traje de baño y leotardo de gimnasia, jerseys, shorts y faldas deportivas.",
          "Si tu disciplina no aparece en la lista, cuéntanos qué necesita tu equipo y revisamos la mejor opción.",
        ],
      },
      {
        title: "Entrenamiento y ropa del día a día",
        paragraphs: [
          "Para entrenar o para el uso diario del club hay pants, conjuntos de entrenamiento, chamarras deportivas, leggings, tops y playeras deportivas. También hay pants, shorts y playeras deportivas infantiles para equipos de menor edad.",
        ],
      },
      {
        title: "Nombre, número y escudo del equipo",
        paragraphs: [
          "Un uniforme de equipo normalmente lleva el escudo, el nombre del equipo y números o nombres de jugadores. Se pueden resolver con sublimación (diseños a color en productos compatibles), con DTF textil o con bordado, según la prenda y el diseño.",
          "Cuéntanos cómo imaginas el uniforme y te orientamos sobre la técnica que mejor encaja.",
        ],
      },
    ],
    checklistTitle: "Para cotizar uniformes deportivos, ten a la mano",
    checklist: [
      "La disciplina y las piezas que lleva cada jugador (jersey, short, pants, chamarra).",
      "Si llevarán nombres o números, y en qué lugar de la prenda.",
      "El escudo, logotipo o patrocinadores, en el mejor archivo que tengas.",
      "Los colores del equipo y la cantidad aproximada de piezas, separando adultos e infantiles.",
    ],
    related: ["sublimacion", "dtf", "uniformes-escolares"],
  },
  {
    slug: "uniformes-empresariales",
    group: "producto",
    name: "Uniformes empresariales",
    blurb: "Uniformes de trabajo y de salud con el logotipo de tu empresa.",
    metaTitle: "Uniformes empresariales en CDMX",
    metaDescription:
      "Uniformes empresariales, de trabajo y de salud con tu logotipo en Ciudad de México: camisas, overoles, batas, filipinas y más. Cotiza por WhatsApp.",
    eyebrow: "Uniformes de trabajo y salud",
    h1: "Uniformes empresariales, de trabajo y de salud",
    lead: "Prendas de trabajo con el logotipo de tu empresa, negocio o institución de la Ciudad de México. Te acompañamos desde la elección de telas y colores hasta la confección y la personalización.",
    whatsappText: "Hola, quiero cotizar uniformes de trabajo para mi empresa con BKTX.",
    slots: [slotId("productos", "trabajo-salud")],
    itemsTitle: "Uniformes de trabajo y salud que puedes pedir",
    itemsIntro: "Prendas para oficina y servicios, laboratorio y consulta, limpieza y cocina.",
    sections: [
      {
        title: "Uniformes según el tipo de trabajo",
        paragraphs: [
          "Para áreas de servicio y operación: overol, camisa de trabajo, mandil y uniforme de limpieza. Para salud y laboratorio: bata de laboratorio, bata de consulta, filipinas, pantalón clínico y conjunto quirúrgico. Para cocina: filipina de chef, pantalón de cocina y mandil.",
          "Si tu equipo combina varias áreas, se puede armar un uniforme distinto para cada una con una misma identidad visual.",
        ],
      },
      {
        title: "El logotipo de tu empresa en cada prenda",
        paragraphs: [
          "Un uniforme es también parte de la imagen de tu marca. Personalizamos las prendas con el logotipo o el nombre de la empresa, normalmente bordados, y definimos contigo el lugar donde se coloca: pecho, espalda o manga.",
        ],
      },
      {
        title: "Viste a todo tu equipo en un solo lugar",
        paragraphs: [
          "Además de los uniformes de trabajo puedes sumar playeras, polos, sudaderas y chamarras para el resto del equipo, y artículos promocionales con tu marca para clientes y colaboradores. Así concentras todo el proyecto en un mismo proveedor.",
        ],
      },
    ],
    checklistTitle: "Para cotizar uniformes de trabajo, ten a la mano",
    checklist: [
      "Los puestos o áreas que necesitan uniforme y la prenda de cada uno.",
      "El logotipo de la empresa, en el mejor archivo que tengas.",
      "Los colores corporativos o una foto del uniforme actual como referencia.",
      "La cantidad aproximada de piezas por prenda y las tallas.",
    ],
    related: ["bordado", "playeras-personalizadas", "articulos-promocionales"],
  },
  {
    slug: "playeras-personalizadas",
    group: "producto",
    name: "Playeras, polos y sudaderas",
    blurb: "Playeras, polos, sudaderas y hoodies con tu logotipo o diseño.",
    metaTitle: "Playeras personalizadas en CDMX",
    metaDescription:
      "Playeras, polos, sudaderas y hoodies personalizados en CDMX con tu logotipo o diseño, con bordado, DTF textil o sublimación. Cotiza por WhatsApp.",
    eyebrow: "Casual y básicos",
    h1: "Playeras, polos y sudaderas personalizadas",
    lead: "Prendas básicas con tu logotipo, tu diseño o el de tu grupo. Desde una playera sencilla hasta un hoodie con capucha: dinos qué necesitas y lo cotizamos.",
    whatsappText: "Hola, quiero cotizar playeras o sudaderas personalizadas con BKTX.",
    slots: [slotId("productos", "casual")],
    itemsTitle: "Prendas casuales que puedes personalizar",
    itemsIntro: "Playeras de distintos cortes, polos, sudaderas y conjuntos casuales.",
    sections: [
      {
        title: "Prendas básicas para equipos, eventos y marcas",
        paragraphs: [
          "Las playeras, polos y sudaderas personalizadas sirven para vestir a un equipo de trabajo, identificar a un grupo en un evento o crear la ropa de una marca. Hay playera básica, de manga larga, sin mangas y oversize; polos; sudaderas premium, con cierre y hoodies con capucha.",
        ],
      },
      {
        title: "Cómo se personalizan",
        paragraphs: [
          "El bordado funciona bien para logotipos, nombres y diseños con acabado en hilo. El DTF textil permite personalizar prendas con acabado normal o con efecto bordado. La sublimación se usa en productos compatibles con esta técnica.",
          "La elección depende de la prenda y del diseño. Cuéntanos qué quieres y te orientamos.",
        ],
      },
    ],
    checklistTitle: "Para cotizar tus prendas, ten a la mano",
    checklist: [
      "El tipo de prenda (playera, polo, sudadera, hoodie) y el corte que buscas.",
      "El logotipo o diseño, en el mejor archivo que tengas, y en qué lugar va.",
      "Los colores de la prenda y del diseño.",
      "La cantidad aproximada y las tallas.",
    ],
    related: ["dtf", "bordado", "chamarras-personalizadas", "uniformes-empresariales"],
  },
  {
    slug: "chamarras-personalizadas",
    group: "producto",
    name: "Chamarras y chalecos",
    blurb: "Chamarras, bomber, rompevientos y chalecos con logotipo o diseño propio.",
    metaTitle: "Chamarras y chalecos personalizados",
    metaDescription:
      "Chamarras y chalecos personalizados: neopreno, bomber, rompevientos, impermeable, varsity, mezclilla y fleece con tu logotipo. Cotiza por WhatsApp.",
    eyebrow: "Chamarras y chalecos",
    h1: "Chamarras y chalecos personalizados",
    lead: "Chamarras y chalecos con el logotipo, el nombre o el diseño de tu equipo, escuela o empresa. Escríbenos y te ayudamos a elegir el estilo.",
    whatsappText: "Hola, quiero cotizar chamarras personalizadas con BKTX.",
    slots: [slotId("productos", "chamarras")],
    itemsTitle: "Chamarras y chalecos que puedes pedir",
    itemsIntro: "Estilos para equipos, grupos generacionales, empresas y marcas.",
    sections: [
      {
        title: "Estilos de chamarra y chaleco",
        paragraphs: [
          "Entre las opciones hay chamarra de neopreno, bomber jacket, rompevientos, chamarra impermeable, chamarra tipo varsity y chamarra de mezclilla; y, en chalecos, el acolchado y el de fleece.",
          "Si ya tienes un modelo en mente, comparte una foto de referencia y vemos cómo llevarlo a tu proyecto.",
        ],
      },
      {
        title: "Para equipos, escuelas y empresas",
        paragraphs: [
          "Una chamarra personalizada es una buena prenda para identificar a un equipo deportivo, a una generación escolar o al personal de una empresa. El logotipo, el nombre o las letras pueden ir en el pecho, la espalda o las mangas.",
          "Puedes combinarlas con los uniformes de tu proyecto para que todo el equipo luzca coordinado.",
        ],
      },
    ],
    checklistTitle: "Para cotizar chamarras, ten a la mano",
    checklist: [
      "El estilo de chamarra o chaleco que buscas, o una foto de referencia.",
      "El logotipo, nombre o diseño, y en qué lugar de la prenda va.",
      "Los colores de la chamarra y de los detalles.",
      "La cantidad aproximada y las tallas.",
    ],
    related: ["bordado", "uniformes-deportivos", "playeras-personalizadas"],
  },
  {
    slug: "articulos-promocionales",
    group: "promocional",
    name: "Artículos promocionales",
    blurb: "Termos, tazas, vasos, libretas, plumas y pines con tu logotipo.",
    metaTitle: "Artículos promocionales",
    metaDescription:
      "Artículos promocionales con tu logotipo en Ciudad de México: termos, tazas, vasos, libretas, plumas y pines para promover tu marca. Cotiza por WhatsApp.",
    eyebrow: "Con tu marca",
    h1: "Artículos promocionales personalizados",
    lead: "Termos, tazas, vasos, libretas, plumas y más con tu logotipo, para regalar y dar a conocer tu marca. Cuéntanos qué buscas y lo cotizamos.",
    whatsappText: "Hola, quiero cotizar artículos promocionales con BKTX.",
    slots: [
      slotId("promocionales", "termos"),
      slotId("promocionales", "tazas"),
      slotId("promocionales", "vasos"),
      slotId("promocionales", "papeleria"),
      slotId("promocionales", "accesorios"),
      slotId("servicios", "grabado"),
    ],
    itemsTitle: "Qué artículos promocionales puedes pedir",
    itemsIntro: "Artículos agrupados por tipo. Todos pueden llevar el logotipo o el diseño de tu negocio.",
    cover: "promo",
    sections: [
      {
        title: "Regalos y papelería con tu identidad",
        paragraphs: [
          "Un artículo promocional lleva tu marca a las manos de clientes, colaboradores o invitados. Un termo, una taza o una libreta se usan a diario y mantienen presente tu logotipo mucho después de la entrega.",
          "También ofrecemos gorras, mochilas, bolsas y otros accesorios textiles personalizados; los encuentras junto a nuestras prendas.",
        ],
      },
      {
        title: "Cómo se personalizan",
        paragraphs: [
          "Según el artículo se puede usar sublimación (diseños a color en productos compatibles, como las tazas con foto o logotipo), grabado (personalización de artículos según su material) o DTF UV (diseños sobre artículos y superficies compatibles).",
          "No todas las técnicas sirven para todos los productos. Dinos qué artículo te interesa y te orientamos sobre la opción adecuada.",
        ],
      },
    ],
    checklistTitle: "Para cotizar artículos promocionales, ten a la mano",
    checklist: [
      "Los artículos que te interesan y para qué ocasión (evento, clientes, equipo).",
      "El logotipo o diseño, en el mejor archivo que tengas.",
      "Los colores de tu marca.",
      "La cantidad aproximada que necesitas.",
    ],
    related: ["sublimacion", "dtf", "uniformes-empresariales"],
  },
  {
    slug: "bordado",
    group: "tecnica",
    name: "Bordado",
    blurb: "Logotipos, nombres y diseños en hilo para uniformes, polos, chamarras y gorras.",
    metaTitle: "Bordado personalizado en CDMX",
    metaDescription:
      "Bordado de logotipos, nombres y diseños en uniformes, polos, camisas, chamarras y gorras en Ciudad de México. Pide tu cotización por WhatsApp.",
    eyebrow: "Personalización",
    h1: "Bordado personalizado para uniformes y prendas",
    lead: "Personalizamos con hilo logotipos, nombres y diseños. Es una de las formas más habituales de dar identidad a un uniforme.",
    whatsappText: "Hola, quiero cotizar un trabajo de bordado con BKTX.",
    slots: [slotId("servicios", "bordado")],
    itemsTitle: "Qué puedes bordar",
    itemsIntro: "El bordado se adapta a logotipos y textos sencillos y a diseños más trabajados.",
    items: ["Logotipos de empresa o institución", "Nombres y apellidos", "Escudos y diseños", "Uniformes de trabajo y escolares", "Polos y camisas", "Chamarras y sudaderas", "Gorras"],
    sections: [
      {
        title: "Qué es el bordado",
        paragraphs: [
          "En el bordado, el diseño se forma con hilo cosido directamente sobre la prenda. A diferencia de una impresión, el resultado tiene textura y relieve propios, y por eso se usa mucho en uniformes, camisas, polos, chamarras y gorras.",
        ],
      },
      {
        title: "Bordado o DTF con efecto bordado",
        paragraphs: [
          "Cuando buscas un aspecto parecido al del hilo pero el diseño tiene muchos detalles o colores, el DTF textil ofrece un acabado con efecto bordado. Si dudas entre una opción y otra, cuéntanos tu diseño y las prendas, y te orientamos.",
        ],
      },
      {
        title: "Un diseño listo para bordar",
        paragraphs: [
          "Para trabajar un bordado conviene partir del logotipo en el mejor archivo disponible. A partir de ahí revisamos contigo el tamaño y el lugar de la prenda donde se coloca: pecho, espalda, manga o frente de la gorra.",
        ],
      },
    ],
    checklistTitle: "Para cotizar un bordado, ten a la mano",
    checklist: [
      "El logotipo o diseño, en el mejor archivo que tengas.",
      "Las prendas que quieres bordar y cuántas son.",
      "El lugar de la prenda donde va el bordado.",
      "Los nombres, si cada prenda lleva uno distinto.",
    ],
    related: ["dtf", "uniformes-empresariales", "uniformes-escolares"],
  },
  {
    slug: "sublimacion",
    group: "tecnica",
    name: "Sublimación",
    blurb: "Diseños a color en productos compatibles: ropa deportiva, tazas y más.",
    metaTitle: "Sublimación personalizada a color",
    metaDescription:
      "Sublimación: impresión de diseños a color para productos compatibles, como tazas, artículos promocionales y ropa deportiva. Cotiza por WhatsApp.",
    eyebrow: "Personalización",
    h1: "Sublimación: diseños a color en productos compatibles",
    lead: "La sublimación imprime diseños a color en productos compatibles con esta técnica. Dinos qué quieres personalizar y confirmamos si es la opción adecuada.",
    whatsappText: "Hola, quiero cotizar un trabajo de sublimación con BKTX.",
    slots: [slotId("servicios", "sublimacion")],
    itemsTitle: "Qué se puede personalizar con sublimación",
    itemsIntro: "La técnica depende del material del producto; estos son los casos más comunes.",
    items: ["Tazas con foto o logotipo", "Diseños a color en artículos promocionales compatibles", "Ropa deportiva y uniformes de equipo, si el material es compatible"],
    sections: [
      {
        title: "Qué es la sublimación",
        paragraphs: [
          "La sublimación es una técnica de impresión en la que la tinta se transfiere al producto mediante calor. Permite reproducir diseños a color, como fotografías, ilustraciones o patrones completos.",
        ],
      },
      {
        title: "Productos compatibles",
        paragraphs: [
          "No todos los materiales admiten sublimación: el resultado depende del producto. Por eso, antes de producir conviene que nos cuentes qué artículo o prenda quieres personalizar; te orientamos sobre si es compatible o si otra técnica, como el DTF o el bordado, es mejor opción.",
        ],
      },
      {
        title: "Ideas para usarla",
        paragraphs: [
          "Es una opción para diseños con muchos colores: tazas con foto o logotipo, artículos promocionales con la identidad de tu marca o los uniformes de un equipo deportivo, siempre que el material lo permita.",
        ],
      },
    ],
    checklistTitle: "Para cotizar una sublimación, ten a la mano",
    checklist: [
      "El producto o prenda que quieres personalizar.",
      "El diseño o la foto, en la mayor calidad posible.",
      "La cantidad aproximada de piezas.",
      "La fecha en que lo necesitas, si es para un evento o una campaña.",
    ],
    related: ["articulos-promocionales", "uniformes-deportivos", "dtf"],
  },
  {
    slug: "dtf",
    group: "tecnica",
    name: "DTF textil y DTF UV",
    blurb: "Personalización de prendas y de artículos con diseños a color.",
    metaTitle: "DTF textil y DTF UV personalizado",
    metaDescription:
      "DTF textil para prendas, con acabado normal o efecto bordado, y DTF UV para artículos y superficies compatibles. Cotiza por WhatsApp.",
    eyebrow: "Personalización",
    h1: "DTF textil y DTF UV para prendas y artículos",
    lead: "Dos formas de aplicar tu diseño: DTF textil para prendas y DTF UV para artículos y superficies compatibles. Te ayudamos a elegir según tu proyecto.",
    whatsappText: "Hola, quiero cotizar un trabajo de DTF con BKTX.",
    slots: [slotId("servicios", "dtf-textil"), slotId("servicios", "dtf-uv")],
    itemsTitle: "Qué puedes personalizar con DTF",
    itemsIntro: "Según el producto, se usa la variante textil o la UV.",
    items: ["Playeras, polos y sudaderas (DTF textil)", "Uniformes y prendas de equipo (DTF textil)", "Acabado normal o efecto bordado (DTF textil)", "Artículos y superficies compatibles (DTF UV)"],
    sections: [
      {
        title: "DTF textil: para prendas",
        paragraphs: [
          "El DTF textil personaliza prendas con diseños a color. Se puede elegir un acabado normal o uno con efecto bordado, útil cuando quieres una apariencia cercana al hilo en un diseño con más detalle.",
        ],
      },
      {
        title: "DTF UV: para artículos y superficies",
        paragraphs: [
          "El DTF UV aplica diseños sobre artículos y superficies compatibles. Es la variante pensada para productos que no son ropa, como algunos artículos promocionales.",
        ],
      },
      {
        title: "Cómo elegir la técnica",
        paragraphs: [
          "Cada producto admite técnicas distintas. Si tienes dudas entre DTF, bordado o sublimación, comparte tu diseño y el producto, y te orientamos sobre la opción que mejor se ajusta.",
        ],
      },
    ],
    checklistTitle: "Para cotizar un trabajo de DTF, ten a la mano",
    checklist: [
      "El producto o prenda que quieres personalizar.",
      "El diseño en el mejor archivo que tengas.",
      "Si buscas acabado normal o efecto bordado, en el caso de prendas.",
      "La cantidad aproximada de piezas.",
    ],
    related: ["bordado", "sublimacion", "playeras-personalizadas"],
  },
];

export function getTopic(slug: string): Topic {
  const topic = topics.find((t) => t.slug === slug);
  if (!topic) throw new Error(`Tema desconocido: ${slug}`);
  return topic;
}

export function topicMetadata(slug: string): Metadata {
  const t = getTopic(slug);
  return pageMetadata({ title: t.metaTitle, description: t.metaDescription, path: `/${t.slug}` });
}

// Página a la que enlaza cada card de la portada (clave = id de la ranura de imagen). Sin página, la card no enlaza.
export function topicForSlot(id: string): Topic | undefined {
  return topics.find((t) => t.slots.includes(id));
}
