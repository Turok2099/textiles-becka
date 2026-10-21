"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

type Photo = { src: string; width: number; height: number; alt: string };

// Carrusel con desplazamiento táctil (scroll-snap), flechas, puntos y contador "2 / 5".
// Con una sola foto se muestra una imagen simple, sin controles.
export function ProductCarousel({ photos, name, sizes }: { photos: Photo[]; name: string; sizes: string }) {
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);

  if (photos.length === 1) {
    const p = photos[0];
    return <Image className="product-media" src={p.src} alt={p.alt} width={p.width} height={p.height} sizes={sizes} />;
  }

  function go(to: number) {
    const el = track.current;
    if (!el) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: to * el.clientWidth, behavior: smooth ? "smooth" : "auto" });
  }

  function onScroll() {
    const el = track.current;
    if (el) setIndex(Math.round(el.scrollLeft / el.clientWidth));
  }

  return (
    <div className="carousel" role="group" aria-roledescription="carrusel" aria-label={`Fotos de ${name}`}>
      <ul ref={track} className="carousel-track" onScroll={onScroll} tabIndex={0} aria-label={`Fotos de ${name}, desliza para ver más`}>
        {photos.map((p, i) => (
          <li key={p.src} className="carousel-slide" role="group" aria-roledescription="diapositiva" aria-label={`${i + 1} de ${photos.length}`}>
            <Image className="carousel-img" src={p.src} alt={p.alt} width={p.width} height={p.height} sizes={sizes} />
          </li>
        ))}
      </ul>
      <button type="button" className="carousel-btn prev" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Foto anterior">
        <LuChevronLeft aria-hidden="true" />
      </button>
      <button type="button" className="carousel-btn next" onClick={() => go(index + 1)} disabled={index === photos.length - 1} aria-label="Foto siguiente">
        <LuChevronRight aria-hidden="true" />
      </button>
      <p className="carousel-count" aria-live="polite">{index + 1} / {photos.length}</p>
      <div className="carousel-dots" aria-hidden="true">
        {photos.map((p, i) => <span key={p.src} className={i === index ? "on" : undefined} />)}
      </div>
    </div>
  );
}
