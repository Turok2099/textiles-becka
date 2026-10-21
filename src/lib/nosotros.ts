// Contenido de la página /nosotros. Los textos son los aprobados por la clienta: no resumir, reescribir ni añadir
// promesas, cifras, años de experiencia, certificaciones ni testimonios.
//
// Las tres imágenes (public/nosotros) las entregó la clienta. Son horizontales 3:2 (1536 x 1024) y se muestran
// completas, sin recortes. Las demás secciones se resuelven solo con tipografía y fondos.

type Photo = { src: string; width: number; height: number; alt: string };

export const nosotros = {
  hero: {
    eyebrow: "Sobre BKTX",
    title: "¿Quiénes somos?",
    intro: "En BKTX transformamos ideas en prendas y productos personalizados que representan la identidad de cada marca.",
    // Párrafo adicional confirmado por el usuario (aparece en la referencia de diseño).
    extra: "Creemos en el poder de las ideas bien trabajadas, en los detalles que hacen la diferencia y en los productos que conectan personas con marcas.",
    image: {
      src: "/nosotros/01-quienes-somos.png",
      width: 1536,
      height: 1024,
      alt: "Manos guiando una tela clara bajo la aguja de una máquina de coser industrial, con tela morada doblada en primer plano",
    } satisfies Photo,
  },
  what: {
    title: "Lo que hacemos",
    text: "Somos un negocio dedicado a la fabricación y personalización de uniformes y prendas textiles, así como a la comercialización de productos promocionales para empresas, negocios e instituciones. Nuestro propósito es ofrecer soluciones adaptadas a las necesidades de cada cliente, cuidando los detalles que hacen única a su marca.",
    // Párrafo adicional confirmado por el usuario (aparece en la referencia de diseño).
    extra: "Acompañamos a cada cliente en el desarrollo de soluciones a la medida, combinando calidad, funcionalidad y diseño para fortalecer la identidad de su marca en el día a día. Nuestro trabajo integra experiencia, atención cercana y un compromiso constante con la excelencia en cada proyecto.",
  },
  idea: {
    title: "De la idea al producto",
    text: "Creemos que cada proyecto comienza con una idea. Por eso, te acompañamos desde la selección de telas, colores, materiales y diseños hasta la confección y personalización de las prendas, buscando que cada producto refleje la imagen, los objetivos y las necesidades de tu empresa.",
    // Párrafo adicional confirmado por el usuario (aparece en la referencia de diseño).
    extra: "Te asesoramos en la elección de las mejores opciones según tus necesidades, garantizando resultados que combinan estilo, durabilidad y funcionalidad.",
    image: {
      src: "/nosotros/02-idea-al-producto.png",
      width: 1536,
      height: 1024,
      alt: "Muestras de tela en beige, lila, gris y morado sobre patrones de confección, con tijeras, hilo, cinta y lápiz",
    } satisfies Photo,
  },
  beyond: {
    title: "Más allá de la ropa",
    text: "Nuestra oferta también va más allá de la ropa. A través de nuestra línea de productos promocionales, ponemos a tu alcance artículos como: gorras, termos, vasos, llaveros, libretas y diversos accesorios que puedes personalizar con la identidad de tu negocio. De esta manera, te ayudamos a integrar en un solo lugar soluciones para vestir a tu equipo, fortalecer tu imagen corporativa y promover tu marca.",
    image: {
      src: "/nosotros/03-productos-promocionales.png",
      width: 1536,
      height: 1024,
      alt: "Productos promocionales personalizados: gorra, termo, libreta, taza, llavero y pluma en tonos morado y marfil",
    } satisfies Photo,
  },
  project: {
    title: "Cada proyecto es diferente",
    text: "En BKTX entendemos que cada empresa tiene necesidades diferentes. Por eso, trabajamos sobre proyectos personalizados, brindándote atención cercana y alternativas que se ajusten a las características de cada pedido.",
    statement: "Más que ofrecer productos, buscamos construir relaciones comerciales de confianza y convertirnos en un aliado para el crecimiento de tu marca.",
  },
  close: {
    text: "En BKTX, tus ideas son el punto de partida para crear soluciones que comuniquen quién eres y lo que tu empresa representa.",
    cta: "Cuéntanos tu idea",
  },
};
