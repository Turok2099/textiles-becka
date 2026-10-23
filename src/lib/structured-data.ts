// Datos estructurados (schema.org). Solo datos confirmados y presentes en el sitio: nombre, zona de atención, teléfonos
// y WhatsApp de site.ts, y los perfiles oficiales de Instagram y TikTok. Sin dirección, horarios, precios, reseñas ni valoraciones.
// Todo requiere el dominio (NEXT_PUBLIC_SITE_URL): sin él, las funciones devuelven undefined y no se emite nada.

import { cloudPublicId, cloudUrl } from "@/lib/cloud-site";
import { siteUrl } from "@/lib/seo";
import { site } from "@/lib/site";
import type { Topic } from "@/lib/topics";

const context = "https://schema.org";
const orgId = `${siteUrl}/#organization`;
const areaServed = { "@type": "AdministrativeArea", name: site.serviceArea };

export function organizationData() {
  if (!siteUrl) return undefined;
  const logoId = cloudPublicId("/logo/bktx-logo.png");
  const { phone } = site.contact;
  const { whatsapp, instagram, tiktok } = site.social;
  return {
    "@context": context,
    "@type": "Organization",
    "@id": orgId,
    name: site.name,
    alternateName: site.shortName,
    url: siteUrl,
    logo: logoId ? cloudUrl(logoId, "c_limit,w_600,f_png") : `${siteUrl}/logo/bktx-logo.png`,
    description: site.description,
    areaServed,
    telephone: phone.e164,
    contactPoint: [
      { "@type": "ContactPoint", name: "Teléfono", contactType: "customer service", telephone: phone.e164, availableLanguage: "es" },
      { "@type": "ContactPoint", name: "WhatsApp", contactType: "customer service", telephone: `+${whatsapp.number}`, url: whatsapp.href, availableLanguage: "es" },
    ],
    sameAs: [instagram.href, tiktok.href],
  };
}

export function webSiteData() {
  if (!siteUrl) return undefined;
  return {
    "@context": context,
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: site.name,
    alternateName: site.shortName,
    inLanguage: "es-MX",
    publisher: { "@id": orgId },
  };
}

// Migas de pan (las mismas que se ven en la página) y, en las técnicas, el servicio. Sin precios.
export function topicData(topic: Topic) {
  if (!siteUrl) return undefined;
  const url = `${siteUrl}/${topic.slug}`;
  const graph: object[] = [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: `${siteUrl}/` },
        { "@type": "ListItem", position: 2, name: topic.name, item: url },
      ],
    },
  ];
  if (topic.group === "tecnica") {
    graph.push({
      "@type": "Service",
      "@id": `${url}#servicio`,
      name: topic.name,
      serviceType: topic.name,
      description: topic.metaDescription,
      url,
      provider: { "@id": orgId },
      areaServed,
    });
  }
  return { "@context": context, "@graph": graph };
}
