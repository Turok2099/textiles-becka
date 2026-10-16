// Servicios de personalización proporcionados por la clienta.

export type Service = { id: string; name: string; description: string };

export const services: Service[] = [
  { id: "sublimacion", name: "Sublimación", description: "Impresión de diseños a color para productos compatibles con esta técnica." },
  { id: "bordado", name: "Bordado", description: "Personalización con hilo para logotipos, nombres y diseños." },
  { id: "grabado", name: "Grabado", description: "Personalización de artículos mediante grabado, según su material." },
  { id: "dtf-uv", name: "DTF UV", description: "Aplicación de diseños sobre artículos y superficies compatibles." },
  { id: "dtf-textil", name: "DTF textil", description: "Personalización de prendas con acabado normal o efecto bordado." },
];
