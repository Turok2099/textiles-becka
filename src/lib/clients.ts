// Clientes autorizados por la clienta para mostrarse en el sitio.
// Mientras un cliente no tenga `logo`, se muestra un logotipo genérico.
// Para poner el logo real: guardar el archivo en /public/clientes y completar `logo`.

export type Client = {
  id: string;
  name: string;
  logo?: { src: string; width: number; height: number };
};

export const clients: Client[] = [
  { id: "teads", name: "Teads" },
  { id: "usg", name: "USG" },
  { id: "pinterest", name: "Pinterest" },
  { id: "corpogas", name: "Corpogas (PEMEX)" },
  { id: "inmobiliaria-chedraui", name: "Inmobiliaria Chedraui" },
  { id: "grupo-imagen", name: "Grupo Imagen" },
  { id: "datavision", name: "Datavision" },
];
