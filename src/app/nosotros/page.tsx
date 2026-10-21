import type { Metadata } from "next";
import { AboutPage } from "@/components/AboutPage";
import { nosotros } from "@/lib/nosotros";

export const metadata: Metadata = {
  title: "Nosotros",
  description: nosotros.hero.intro,
  alternates: { canonical: "/nosotros" },
};

export default function NosotrosPage() {
  return <AboutPage />;
}
