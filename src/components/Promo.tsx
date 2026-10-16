import { LuBadge, LuCoffee, LuCupSoda, LuGlassWater, LuNotebookPen } from "react-icons/lu";
import { promoCategories } from "@/lib/promo";

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
        <h2 id="promo-titulo">Artículos promocionales</h2>
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
