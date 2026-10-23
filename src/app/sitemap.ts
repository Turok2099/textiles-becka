import type { MetadataRoute } from "next";
import { isIndexable, siteUrl } from "@/lib/seo";
import { topics } from "@/lib/topics";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexable || !siteUrl) return [];
  return [{ url: `${siteUrl}/` }, { url: `${siteUrl}/nosotros` }, ...topics.map((t) => ({ url: `${siteUrl}/${t.slug}` }))];
}
