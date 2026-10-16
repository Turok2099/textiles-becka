import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";

export const metadata: Metadata = { title: "Opción azul", robots: { index: false, follow: false } };

export default function Page() {
  return <HomePage theme="azul" />;
}
