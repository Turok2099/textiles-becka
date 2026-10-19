import { LuBadge, LuCoffee, LuCupSoda, LuGlassWater, LuNotebookPen } from "react-icons/lu";
import Image from "next/image";
import { promoCategories, promoCover } from "@/lib/promo";

const icons: Record<string, React.ReactNode> = {
  termos: <LuGlassWater />,
  tazas: <LuCoffee />,
  vasos: <LuCupSoda />,
  papeleria: <LuNotebookPen />,
  accesorios: <LuBadge />,
};

export function Promo() {
  return (
    <section id="promocionales" className="section tint" aria-labelledby="promo-titulo">
      <div className="wrap">
        <div className="products-banner">
          <Image className="products-cover" src={promoCover.src} alt={promoCover.alt} width={promoCover.width} height={promoCover.height} sizes="(min-width: 76rem) 70rem, 100vw" />
          <div className="products-intro">
            <p className="eyebrow">Con tu marca</p>
            <h2 id="promo-titulo">Artículos promocionales</h2>
            <p className="lead">Termos, tazas, libretas, plumas y más para regalar y dar a conocer tu marca.</p>
            <a className="button" href="#contacto">Cotiza tus promocionales</a>
          </div>
        </div>
        <ul className="grid product-grid">
          {promoCategories.map((c) => (
            <li key={c.id} className="card product-card">
              <div className="product-head">
                <span className="product-icon" aria-hidden="true">{icons[c.id]}</span>
                <h3>{c.name}</h3>
              </div>
              <ul className="tags">
                {c.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
