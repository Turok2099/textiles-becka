// Configuración SEO. El dominio real no está confirmado: se lee de NEXT_PUBLIC_SITE_URL (ver .env.example).
// Sin dominio, o fuera de producción, el sitio se declara noindex y robots.txt bloquea el rastreo.

const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");

export const siteUrl: string | undefined = raw && /^https?:\/\//.test(raw) ? raw : undefined;

export const isIndexable =
  process.env.NODE_ENV === "production" && Boolean(siteUrl) && process.env.VERCEL_ENV !== "preview";

export const seo = {
  title: "Uniformes y playeras personalizadas",
  description:
    "Uniformes escolares, deportivos y empresariales, playeras y sudaderas personalizadas con bordado, sublimación o DTF. Pedidos y catálogo por WhatsApp.",
  googleVerification: process.env.GOOGLE_SITE_VERIFICATION?.trim() || undefined,
  gaId: /^G-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GA_ID?.trim() ?? "") ? process.env.NEXT_PUBLIC_GA_ID!.trim() : undefined,
};
