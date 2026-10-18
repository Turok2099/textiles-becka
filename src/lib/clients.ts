// Clientes autorizados por la clienta para mostrarse en el sitio.
// Mientras un cliente no tenga `logo`, se muestra un logotipo genérico.
// Para poner el logo real: guardar el archivo en /public/logos_clientes y completar `logo`.

export type Client = {
  id: string;
  name: string;
  logo?: { src: string; width: number; height: number };
};

export const clients: Client[] = [
  { id: "teads", name: "Teads", logo: { src: "/logos_clientes/teads.webp", width: 480, height: 240 } },
  { id: "usg", name: "USG", logo: { src: "/logos_clientes/usg.webp", width: 480, height: 240 } },
  { id: "pinterest", name: "Pinterest", logo: { src: "/logos_clientes/pinterest.webp", width: 480, height: 240 } },
  { id: "corpogas", name: "Corpogas (PEMEX)", logo: { src: "/logos_clientes/corpogas.webp", width: 480, height: 240 } },
  { id: "inmobiliaria-chedraui", name: "Inmobiliaria Chedraui", logo: { src: "/logos_clientes/inmobiliaria-chedraui.webp", width: 480, height: 240 } },
  { id: "grupo-imagen", name: "Grupo Imagen", logo: { src: "/logos_clientes/grupo-imagen.webp", width: 480, height: 240 } },
  { id: "datavision", name: "Datavision" },
];
