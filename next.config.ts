import type { NextConfig } from "next";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();

const nextConfig: NextConfig = {
  /* config options here */
  // Solo se permiten imágenes de la cuenta de Cloudinary propia.
  ...(cloudName && { images: { remotePatterns: [new URL(`https://res.cloudinary.com/${cloudName}/image/upload/**`)] } }),
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
