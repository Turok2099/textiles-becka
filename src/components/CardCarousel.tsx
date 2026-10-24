"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

type Photo = { src: string; width: number; height: number; alt: string; srcSet?: string };

// Las fotos subidas desde /admin traen srcSet de Cloudinary y se sirven directo (Cloudinary ya optimiza); las locales usan next/image.
function PhotoImage({ p, sizes, className, eager }: { p: Photo; sizes: string; className: string; eager: boolean }) {
  const style = { aspectRatio: `${p.width} / ${p.height}` };
  if (!p.srcSet) return <Image className={className} style={style} src={p.src} alt={p.alt} width={p.width} height={p.height} sizes={sizes} priority={eager} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- Cloudinary ya optimiza y redimensiona la imagen
    <img className={className} style={style} src={p.src} srcSet={p.srcSet} sizes={sizes} alt={p.alt} width={p.width} height={p.height} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : undefined} decoding="async" />
  );
}

// Carrusel con desplazamiento táctil (scroll-snap), flechas, puntos y contador "2 / 5".
// Con una sola foto se muestra una imagen simple, sin controles.
// `eager` carga ya la primera foto (para carruseles visibles al abrir la página).
export function CardCarousel({ photos, name, sizes, eager = false }: { photos: Photo[]; name: string; sizes: string; eager?: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  if (photos.length === 1) {
    const p = photos[0];
    return <PhotoImage p={p} sizes={sizes} className="product-media" eager={eager} />;
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
      <div ref={track} className="carousel-track" onScroll={onScroll} tabIndex={0} role="group" aria-label={`Fotos de ${name}, desliza para ver más`}>
        {photos.map((p, i) => (
          <div key={p.src} className="carousel-slide" role="group" aria-roledescription="diapositiva" aria-label={`${i + 1} de ${photos.length}`}>
            <PhotoImage p={p} sizes={sizes} className="carousel-img" eager={eager && i === 0} />
          </div>
        ))}
      </div>
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
