import { About } from "@/components/About";
import { Clients } from "@/components/Clients";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Products } from "@/components/Products";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#contenido">Ir al contenido</a>
      <SiteHeader />
      <main id="contenido">
        <Hero />
        <Products />
        <Clients />
        <About />
        <Contact />
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  );
}
