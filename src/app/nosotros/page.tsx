import type { Metadata } from "next";
import { AboutPage } from "@/components/AboutPage";
import { nosotros } from "@/lib/nosotros";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({ title: "Nosotros", description: nosotros.hero.intro, path: "/nosotros" });

export default function NosotrosPage() {
  return <AboutPage />;
}
