import type { MetadataRoute } from "next";
import { isIndexable, siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexable || !siteUrl) return [];
  return [{ url: `${siteUrl}/` }, { url: `${siteUrl}/nosotros` }];
}
