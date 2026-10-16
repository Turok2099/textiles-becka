// Logotipo genérico provisional: icono de playera. Reemplazar por el logo oficial cuando exista.
export function Logo({ size = 28 }: Readonly<{ size?: number }>) {
  return (
    <svg className="logo-mark" viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <path d="M8 3 3 6.5l2.2 4L8 9v11a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9l2.8 1.5 2.2-4L16 3c0 1.7-1.8 3-4 3S8 4.7 8 3z" fill="currentColor" />
    </svg>
  );
}
