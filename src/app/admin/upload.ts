// Subida de una foto directo a Cloudinary con progreso real (fetch no informa del avance de subida, XHR sí).

export class UploadError extends Error {
  constructor(message: string, readonly network = false) {
    super(message);
  }
}

export function uploadFile(url: string, fields: Record<string, string | number>, file: File, onProgress: (percent: number) => void): Promise<{ public_id: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.timeout = 180_000;
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      try {
        const body = JSON.parse(xhr.responseText) as { public_id?: string };
        if (xhr.status >= 200 && xhr.status < 300 && body.public_id) return resolve({ public_id: body.public_id });
      } catch {
        // cae al error genérico
      }
      reject(new UploadError("No se pudo subir esta foto. Revisa que la imagen no esté dañada e inténtalo de nuevo."));
    };
    xhr.onerror = () => reject(new UploadError("Sin conexión. Revisa tu internet y toca Reintentar.", true));
    xhr.ontimeout = () => reject(new UploadError("La subida tardó demasiado. Revisa tu internet y toca Reintentar.", true));

    const body = new FormData();
    for (const [k, v] of Object.entries(fields)) body.append(k, String(v));
    body.append("file", file);
    xhr.send(body);
  });
}
