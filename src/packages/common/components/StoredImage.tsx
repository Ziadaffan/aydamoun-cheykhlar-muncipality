/* eslint-disable @next/next/no-img-element */
import { CldImage } from 'next-cloudinary';

type StoredImageProps = {
  /** A Cloudinary public id (how admin uploads are stored) or an https URL. */
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
};

/** Fills its (relatively positioned) parent. */
export default function StoredImage({ src, alt, className = 'object-cover', sizes = '(max-width: 768px) 100vw, 50vw' }: StoredImageProps) {
  if (/^https?:\/\//i.test(src) && !/^https:\/\/res\.cloudinary\.com\//i.test(src)) {
    return <img src={src} alt={alt} className={`absolute inset-0 h-full w-full ${className}`} />;
  }
  return <CldImage src={src} alt={alt} fill sizes={sizes} className={className} />;
}
