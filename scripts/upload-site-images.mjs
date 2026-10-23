// Sube a Cloudinary las imágenes pesadas del sitio (las optimiza Cloudinary al entregarlas, ver src/components/CloudImage.tsx).
// Uso: node --env-file=.env.local scripts/upload-site-images.mjs
// El public_id sale de la ruta local: public/nosotros/01-x.png -> bktx-sitio/nosotros/01-x. Se puede repetir (sobrescribe).
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const cloud = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const key = process.env.CLOUDINARY_API_KEY?.trim();
const secret = process.env.CLOUDINARY_API_SECRET?.trim();
if (!cloud || !key || !secret) throw new Error("Faltan las variables CLOUDINARY_* (usa --env-file=.env.local)");

const files = [
  "public/logo/bktx-logo.png",
  "public/nosotros/01-quienes-somos.png",
  "public/nosotros/02-idea-al-producto.png",
  "public/nosotros/03-productos-promocionales.png",
  "public/nosotros/04-resumen-portada.png",
  "originales/opengraph-image.png",
];

for (const file of files) {
  const publicId = file === "originales/opengraph-image.png" ? "bktx-sitio/social/opengraph" : `bktx-sitio/${file.replace(/^public\//, "").replace(/\.\w+$/, "")}`;
  const params = { overwrite: "true", public_id: publicId, timestamp: String(Math.floor(Date.now() / 1000)) };
  const toSign = Object.keys(params).sort().map((k) => `${k}=${params[k]}`).join("&");
  const body = new FormData();
  for (const [k, v] of Object.entries(params)) body.set(k, v);
  body.set("api_key", key);
  body.set("signature", createHash("sha1").update(toSign + secret).digest("hex"));
  body.set("file", new Blob([await readFile(file)]), file.split("/").pop());
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: "POST", body });
  const json = await res.json();
  console.log(res.ok ? "OK " : "ERR", publicId, res.ok ? `${json.width}x${json.height} ${json.bytes}B` : json.error?.message);
}
