import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administrar imágenes",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="admin">{children}</div>;
}
