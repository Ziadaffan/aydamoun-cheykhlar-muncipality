/* eslint-disable @next/next/no-img-element */
import { CldImage } from 'next-cloudinary';

type StoredImageProps = {
  /** A Cloudinary public id (how admin uploads are stored), an https URL or a data: URI. */
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
};

/** Fills its (relatively positioned) parent; renders nothing without a `src`, so the parent's background shows. */
export default function StoredImage({ src, alt, className = 'object-cover', sizes = '(max-width: 768px) 100vw, 50vw' }: StoredImageProps) {
  if (!src) return null;
  // Other hosts and inline images aren't Cloudinary assets: shown as they are.
  if ((/^https?:\/\//i.test(src) && !/^https:\/\/res\.cloudinary\.com\//i.test(src)) || src.startsWith('data:')) {
    return <img src={src} alt={alt} className={`absolute inset-0 h-full w-full ${className}`} />;
  }
  return <CldImage src={src} alt={alt} fill sizes={sizes} className={className} />;
}
