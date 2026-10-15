// News.imageUrl holds Cloudinary URLs, or raw base64 (no data: prefix) on rows saved
// before images moved to Cloudinary. Pure helpers, safe on both server and client.

import type { ImageLoader } from 'next/image';

const NEWS_IMAGE_FALLBACK = '/assets/images/bg-2.jpg';

// First characters of the base64 encoding of each format's magic bytes.
const BASE64_IMAGE_SIGNATURES: ReadonlyArray<readonly [prefix: string, mime: string]> = [
  ['/9j/', 'image/jpeg'],
  ['iVBOR', 'image/png'],
  ['R0lGOD', 'image/gif'],
  ['UklGR', 'image/webp'],
];

const isRemoteImageUrl = (value: string): boolean => /^https?:\/\//i.test(value);

/** True for image bytes stored inline (legacy raw base64 or a data: URI), false for URLs. */
export const isInlineImage = (value: string): boolean => !!value && !isRemoteImageUrl(value);

/** MIME type of a raw base64 image; JPEG when unknown, as the old upload code assumed. */
function base64ImageMime(value: string): string {
  return BASE64_IMAGE_SIGNATURES.find(([prefix]) => value.startsWith(prefix))?.[1] ?? 'image/jpeg';
}

/** `src` for a stored news image: URLs as they are, legacy base64 as a data: URI. */
export function newsImageSrc(value: string | null | undefined): string {
  if (!value) return NEWS_IMAGE_FALLBACK;
  if (isRemoteImageUrl(value) || value.startsWith('data:')) return value;
  return `data:${base64ImageMime(value)};base64,${value}`;
}

const CLOUDINARY_UPLOAD_URL = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/i;

/** Resizes and re-encodes through Cloudinary itself, so these images don't use Vercel's image optimization quota. */
const cloudinaryImageLoader: ImageLoader = ({ src, width, quality }) => {
  const match = src.match(CLOUDINARY_UPLOAD_URL);
  if (!match) return src;
  return `${match[1]}f_auto,q_${quality ?? 'auto'},c_limit,w_${width}/${match[2]}`;
};

/**
 * `loader` for next/image: Cloudinary's own resizing for Cloudinary URLs; undefined
 * (the default loader) otherwise. data: URIs are never optimized by next/image.
 */
export function newsImageLoader(src: string): ImageLoader | undefined {
  return CLOUDINARY_UPLOAD_URL.test(src) ? cloudinaryImageLoader : undefined;
}

/**
 * Public id of an image in our Cloudinary account, e.g.
 * https://res.cloudinary.com/<cloud>/image/upload/v1712345678/news/abc.jpg → news/abc.
 * Null for anything else (base64, other hosts, other accounts) so callers never
 * delete an asset they don't own.
 */
export function cloudinaryPublicId(url: string, cloudName: string | undefined): string | null {
  if (!cloudName) return null;
  const match = url.match(/^https:\/\/res\.cloudinary\.com\/([^/]+)\/image\/upload\/(?:v\d+\/)?([^?#]+?)(?:\.[a-z0-9]+)?(?:[?#].*)?$/i);
  return match && match[1] === cloudName ? match[2] : null;
}
