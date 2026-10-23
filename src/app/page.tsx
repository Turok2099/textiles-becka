import { HomePage } from "@/components/HomePage";
import { JsonLd } from "@/components/JsonLd";
import { webSiteData } from "@/lib/structured-data";

export default function Home() {
  return (
    <>
      <HomePage />
      <JsonLd data={webSiteData()} />
    </>
  );
}
