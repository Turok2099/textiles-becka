import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";

export const metadata: Metadata = { title: "Opción violeta", robots: { index: false, follow: false } };

export default function Page() {
  return <HomePage theme="violeta" />;
}
