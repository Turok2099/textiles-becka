"use client";

import { useEffect, useId, useRef } from "react";
import { LuX } from "react-icons/lu";

// Diálogo nativo (<dialog>): atrapa el foco, se cierra con Esc y devuelve el foco al botón que lo abrió.
// El contenido solo se monta mientras está abierto, así cada apertura empieza con su estado limpio.
export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="amodal"
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose(); // clic en el fondo
      }}
    >
      {open && (
        <div className="amodal-body">
          <div className="amodal-head">
            <h2 id={titleId}>{title}</h2>
            <button type="button" className="abtn icon" onClick={onClose} aria-label="Cerrar">
              <LuX aria-hidden="true" />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
