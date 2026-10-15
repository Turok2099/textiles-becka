import { site } from "@/lib/site";

export function WhatsAppButton() {
  const { whatsapp } = site.social;
  return (
    <a className="wa-float" href={whatsapp.href} target="_blank" rel="noopener noreferrer">
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M4 3h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      </svg>
      <span>WhatsApp</span>
      <span className="sr-only"> (se abre en otra pestaña)</span>
    </a>
  );
}
