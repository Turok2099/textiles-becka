import Script from "next/script";
import { seo } from "@/lib/seo";

// Solo se carga en producción y con NEXT_PUBLIC_GA_ID válido.
export function Analytics() {
  if (process.env.NODE_ENV !== "production" || !seo.gaId) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${seo.gaId}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${seo.gaId}');`}
      </Script>
    </>
  );
}
