import type { Metadata } from "next";
import { socialImage } from "@/lib/cloud-site";
import { site } from "@/lib/site";

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

// Metadatos de una página interna. openGraph y twitter reemplazan por completo a los del layout, por eso se repiten aquí.
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const full = `${title} | ${site.name}`;
  const images = socialImage ? [socialImage] : undefined;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: full, description, url: path, siteName: site.name, locale: "es_MX", type: "website", images },
    twitter: { card: "summary_large_image", title: full, description, images },
  };
}
