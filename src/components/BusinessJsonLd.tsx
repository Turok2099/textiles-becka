import { seo, siteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

// Solo datos confirmados (nombre, teléfono, redes). Sin dirección ni horarios, por eso es Organization y no LocalBusiness.
export function BusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    description: seo.description,
    ...(siteUrl && { url: siteUrl, logo: `${siteUrl}/logo/beckatex-logo.png` }),
    telephone: "+525545683821",
    sameAs: [site.social.instagram.href, site.social.tiktok.href],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }} />;
}
