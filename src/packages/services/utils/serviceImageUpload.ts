// Browser side of 'image' fields: shrink the photo, then send it to POST /api/service-images,
// which answers with the Cloudinary public id the request stores. The mobile app does the same.

/** The endpoint's limit (Vercel caps request bodies at 4.5 MB). */
export const MAX_SERVICE_IMAGE_BYTES = 4 * 1024 * 1024;
const MAX_SIDE = 2000;
const JPEG_QUALITY = 0.85;

export type ServiceImageUploadError = 'tooBig' | 'invalid' | 'network' | 'failed';

export class ServiceImageUploadFailure extends Error {
  constructor(public reason: ServiceImageUploadError) {
    super(reason);
  }
}

/**
 * A JPEG of at most 2000px on its long side. Photos the browser can't decode (HEIC
 * outside Safari) and small ones that already fit are sent as they are.
 */
export async function downscaleServiceImage(file: File): Promise<File> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }
  try {
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size <= MAX_SERVICE_IMAGE_BYTES && file.type === 'image/jpeg') return file;

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const context = canvas.getContext('2d');
    if (!context) return file;
    // White under transparent PNGs, which JPEG can't keep.
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY));
    if (!blob) return file;
    const name = file.name.replace(/\.[^.]*$/, '') || 'photo';
    return new File([blob], `${name}.jpg`, { type: 'image/jpeg' });
  } finally {
    bitmap.close();
  }
}

/**
 * Uploads one photo and resolves with its public id. XMLHttpRequest rather than fetch
 * for the progress (0–1). Rejects with a ServiceImageUploadFailure.
 */
export function uploadServiceImage(file: File, onProgress?: (progress: number) => void): Promise<string> {
  if (file.size > MAX_SERVICE_IMAGE_BYTES) return Promise.reject(new ServiceImageUploadFailure('tooBig'));

  return new Promise((resolve, reject) => {
    const body = new FormData();
    body.append('image', file);

    const request = new XMLHttpRequest();
    request.open('POST', '/api/service-images');
    request.responseType = 'json';
    request.upload.onprogress = event => {
      if (event.lengthComputable) onProgress?.(event.loaded / event.total);
    };
    request.onerror = () => reject(new ServiceImageUploadFailure('network'));
    request.onload = () => {
      const response = request.response as { image?: unknown; code?: string; error?: string } | null;
      if (request.status === 201 && typeof response?.image === 'string') {
        resolve(response.image);
      } else if (request.status === 413 || (response?.code === 'INVALID_IMAGE' && response.error === 'Image is too large')) {
        reject(new ServiceImageUploadFailure('tooBig'));
      } else if (response?.code === 'INVALID_IMAGE') {
        reject(new ServiceImageUploadFailure('invalid'));
      } else {
        reject(new ServiceImageUploadFailure('failed'));
      }
    };
    request.send(body);
  });
}
