import { v2 as cloudinary } from 'cloudinary';
import { BadRequestError } from '@/packages/common/errors';
import { cloudinaryPublicId } from '@/packages/news/utils/newsImage.utils';

/**
 * Single-image uploads for admin-managed content (announcements, history, council).
 * Stores the Cloudinary public id, the same convention as Association.picaURL and
 * Council.image, so pages render it with <CldImage src={publicId} />.
 */

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

let configured = false;

function ensureCloudinary() {
  if (configured) return;
  if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary environment variables are missing');
  }
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  configured = true;
}

/** Throws 400 INVALID_IMAGE for anything but a JPEG/PNG/GIF/WebP of at most 5 MB. */
export function assertValidImage(file: File) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new BadRequestError('Invalid image file', 'INVALID_IMAGE');
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new BadRequestError('Image is too large', 'INVALID_IMAGE');
  }
}

/** Uploads one image to `folder` and resolves with its Cloudinary public id. */
export async function uploadImage(file: File, folder: string): Promise<string> {
  assertValidImage(file);
  ensureCloudinary();
  const base64 = Buffer.from(await file.arrayBuffer()).toString('base64');
  const result = await cloudinary.uploader.upload(`data:${file.type};base64,${base64}`, {
    folder,
    resource_type: 'image',
  });
  return result.public_id;
}

/**
 * Best-effort removal of an image we uploaded (a public id, or one of our Cloudinary
 * URLs). Other URLs are left alone; failures are logged, never thrown.
 */
export async function destroyImage(value: string | null | undefined): Promise<void> {
  if (!value) return;
  try {
    ensureCloudinary();
    const publicId = /^https?:\/\//i.test(value) ? cloudinaryPublicId(value, cloudinary.config().cloud_name) : value;
    if (publicId) {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    }
  } catch (error) {
    console.error('Failed to delete image', value, error);
  }
}
