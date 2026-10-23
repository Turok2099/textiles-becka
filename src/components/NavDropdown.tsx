"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { LuChevronDown } from "react-icons/lu";

type Props = { label: string; href: string; allLabel: string; items: { href: string; label: string }[] };

// Menú desplegable de la barra principal (patrón "disclosure"): el botón abre la lista de páginas y la primera opción
// lleva a la sección completa de la portada. Se cierra con Escape, al hacer clic fuera, al elegir una opción o al salir con el teclado.
export function NavDropdown({ label, href, allLabel, items }: Readonly<Props>) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLLIElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <li
      ref={root}
      className="nav-dd"
      onBlur={(e) => {
        if (!root.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button ref={button} type="button" className="nav-dd-button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((o) => !o)}>
        {label} <LuChevronDown aria-hidden="true" />
      </button>
      {open && (
        <ul id={panelId} className="nav-panel">
          <li><Link href={href} onClick={() => setOpen(false)}>{allLabel}</Link></li>
          {items.map((i) => (
            <li key={i.href}><Link href={i.href} onClick={() => setOpen(false)}>{i.label}</Link></li>
          ))}
        </ul>
      )}
    </li>
  );
}
