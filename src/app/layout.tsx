import type { Metadata } from "next";
import { Analytics } from "@/components/Analytics";
import { BusinessJsonLd } from "@/components/BusinessJsonLd";
import { socialImage } from "@/lib/cloud-site";
import { isIndexable, seo, siteUrl } from "@/lib/seo";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  ...(siteUrl && { metadataBase: new URL(siteUrl) }),
  title: { default: `${seo.title} | ${site.name}`, template: `%s | ${site.name}` },
  description: seo.description,
  alternates: { canonical: "/" },
  robots: isIndexable ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: {
    title: `${seo.title} | ${site.name}`,
    description: seo.description,
    url: "/",
    siteName: site.name,
    locale: "es_MX",
    type: "website",
    ...(socialImage && { images: [socialImage] }),
  },
  twitter: {
    card: "summary_large_image",
    title: `${seo.title} | ${site.name}`,
    description: seo.description,
    ...(socialImage && { images: [socialImage] }),
  },
  ...(seo.googleVerification && { verification: { google: seo.googleVerification } }),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body suppressHydrationWarning>
        {children}
        <BusinessJsonLd />
        <Analytics />
      </body>
    </html>
  );
}
