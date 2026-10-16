import { site } from "@/lib/site";

export function WhatsAppButton() {
  const { whatsapp } = site.social;
  return (
    <a className="wa-float" href={whatsapp.href} target="_blank" rel="noopener noreferrer" aria-label="Escríbenos por WhatsApp">
      <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" focusable="false">
        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" d="M16 3.5a12.5 12.5 0 0 0-10.7 19L3.5 28.5l6.2-1.7A12.5 12.5 0 1 0 16 3.5z" />
        <path fill="currentColor" transform="translate(8.2 8.2) scale(0.64)" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
      </svg>
      <span className="sr-only"> (se abre en otra pestaña)</span>
    </a>
  );
}
