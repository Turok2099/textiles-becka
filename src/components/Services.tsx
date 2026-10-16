import { LuLayers, LuPalette, LuPenTool, LuShirt, LuSpline } from "react-icons/lu";
import { services } from "@/lib/services";

const icons: Record<string, React.ReactNode> = {
  sublimacion: <LuPalette />,
  bordado: <LuSpline />,
  grabado: <LuPenTool />,
  "dtf-uv": <LuLayers />,
  "dtf-textil": <LuShirt />,
};

export function Services() {
  return (
    <section id="servicios" className="section wrap" aria-labelledby="servicios-titulo">
      <h2 id="servicios-titulo">Servicios de personalización</h2>
      <ul className="grid product-grid">
        {services.map((s) => (
          <li key={s.id} className="card product-card">
            <div className="product-head">
              <span className="product-icon" aria-hidden="true">{icons[s.id]}</span>
              <h3>{s.name}</h3>
            </div>
            <p>{s.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
