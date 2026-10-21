"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { UploadedImage } from "@/lib/image-slots";

type Focus = { fx: number; fy: number };

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

// Ajuste de encuadre: se ve la foto completa con un marco de la proporción del sitio y se elige qué parte queda dentro.
// Se mueve arrastrando la foto o con el control deslizante (teclado). Solo hay una dirección posible de movimiento:
// una foto más ancha que el marco se mueve de izquierda a derecha; una más alta, de arriba abajo.
export function FramingEditor({
  photo,
  ratio,
  ratioLabel,
  onSave,
  onReset,
  onCancel,
}: {
  photo: UploadedImage;
  ratio: { width: number; height: number };
  ratioLabel: string;
  onSave: (focus: Focus) => void;
  onReset: () => void;
  onCancel: () => void;
}) {
  const imgRatio = photo.origWidth / photo.origHeight;
  const target = ratio.width / ratio.height;
  const horizontal = imgRatio > target;
  const exact = Math.abs(imgRatio - target) < 0.01;
  // Fracción de la foto que ocupa el marco a lo largo del eje de movimiento.
  const frame = exact ? 1 : horizontal ? target / imgRatio : imgRatio / target;
  const free = 1 - frame;

  const saved = horizontal ? photo.fx : photo.fy;
  const [offset, setOffset] = useState(() => (saved === undefined || free <= 0 ? free / 2 : clamp(saved / 100 - frame / 2, 0, free)));
  const [moved, setMoved] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  function move(next: number) {
    setOffset(clamp(next, 0, free));
    setMoved(true);
  }

  function onPointer(e: React.PointerEvent<HTMLDivElement>) {
    if (free <= 0 || (e.type === "pointermove" && e.buttons === 0)) return;
    const r = box.current!.getBoundingClientRect();
    const center = horizontal ? (e.clientX - r.left) / r.width : (e.clientY - r.top) / r.height;
    move(center - frame / 2);
  }

  const center = (offset + frame / 2) * 100;
  const focus: Focus = horizontal ? { fx: center, fy: 50 } : { fx: 50, fy: center };
  const frameStyle = horizontal
    ? { left: `${offset * 100}%`, top: 0, width: `${frame * 100}%`, height: "100%" }
    : { left: 0, top: `${offset * 100}%`, width: "100%", height: `${frame * 100}%` };
  const dir = horizontal ? ["izquierda", "derecha"] : ["arriba", "abajo"];

  return (
    <div className="framing">
      {exact ? (
        <p className="aintro">Esta foto ya tiene el formato exacto ({ratioLabel}); no necesita ajuste.</p>
      ) : (
        <p className="aintro">
          Mueve el marco para elegir qué parte de la foto se muestra en el sitio ({ratioLabel}). Lo oscuro queda fuera.
        </p>
      )}
      <div
        ref={box}
        className="framing-box"
        style={{ aspectRatio: `${photo.origWidth} / ${photo.origHeight}`, width: `min(100%, ${50 * imgRatio}vh)`, touchAction: free > 0 ? (horizontal ? "pan-y" : "pan-x") : "auto" }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          onPointer(e);
        }}
        onPointerMove={onPointer}
      >
        <Image src={photo.full} alt="" fill sizes="(min-width: 40rem) 36rem, 100vw" unoptimized draggable={false} />
        <div className="framing-frame" style={frameStyle} aria-hidden="true" />
      </div>
      {free > 0.001 && (
        <label className="framing-slider">
          <span>
            Mover el marco hacia {dir[0]} o {dir[1]}
          </span>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={Math.round((offset / free) * 100)}
            onChange={(e) => move((Number(e.target.value) / 100) * free)}
          />
        </label>
      )}
      <div className="amodal-actions">
        <button type="button" className="abtn primary" onClick={() => onSave(focus)} disabled={exact || !moved}>
          Guardar encuadre
        </button>
        {photo.fx !== undefined && (
          <button type="button" className="abtn" onClick={onReset}>
            Volver a automático
          </button>
        )}
        <button type="button" className="abtn" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
