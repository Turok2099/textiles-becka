import { About } from "@/components/About";
import { Clients } from "@/components/Clients";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Products } from "@/components/Products";
import { Promo } from "@/components/Promo";
import { Services } from "@/components/Services";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export function HomePage() {
  return (
    <div>
      <a className="skip-link" href="#contenido">Ir al contenido</a>
      <SiteHeader />
      <main id="contenido">
        <Hero />
        <Products />
        <Clients />
        <Promo />
        <Services />
        <About />
        <Contact />
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </div>
  );
}
