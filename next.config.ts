import type { NextConfig } from "next";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // 75 (por defecto) y 90 (logotipo, para conservar bordes nítidos). Next 16 solo sirve las calidades listadas aquí.
    qualities: [75, 90],
    // Solo se permiten imágenes de la cuenta de Cloudinary propia.
    ...(cloudName && { remotePatterns: [new URL(`https://res.cloudinary.com/${cloudName}/image/upload/**`)] }),
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
