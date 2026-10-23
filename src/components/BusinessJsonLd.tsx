import { JsonLd } from "@/components/JsonLd";
import { organizationData } from "@/lib/structured-data";

// Organization en todas las páginas. Sin dirección ni horarios publicados (se trabaja desde casa), por eso no es LocalBusiness.
export function BusinessJsonLd() {
  return <JsonLd data={organizationData()} />;
}
