'use client';

import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { RotateCcw, X } from 'lucide-react';
import { newsImageLoader, newsImageSrc } from '@/packages/news/utils/newsImage.utils';

type CurrentNewsImagesProps = {
  /** The article's stored images. */
  images: string[];
  /** Indexes of the ones to keep. */
  kept: number[];
  onChange: (kept: number[]) => void;
};

/** The stored images on the edit page: each can be removed (and brought back before saving). */
export default function CurrentNewsImages({ images, kept, onChange }: CurrentNewsImagesProps) {
  const { t } = useTranslation();

  const toggle = (index: number) => onChange(kept.includes(index) ? kept.filter(i => i !== index) : [...kept, index].sort((a, b) => a - b));

  return (
    <div className="mb-5">
      <span className="mb-1 block text-start text-sm font-medium text-gray-700 md:text-base">{t('news.form.currentImages')}</span>
      <div className="flex flex-wrap gap-3">
        {images.map((image, index) => {
          const src = newsImageSrc(image);
          const isKept = kept.includes(index);
          return (
            <div key={index} className="relative h-24 w-24 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
              <Image
                src={src}
                loader={newsImageLoader(src)}
                alt=""
                fill
                sizes="96px"
                className={`object-cover transition-opacity ${isKept ? '' : 'opacity-30 grayscale'}`}
              />
              <button
                type="button"
                onClick={() => toggle(index)}
                title={isKept ? t('news.form.removeImage') : t('news.form.restoreImage')}
                aria-label={isKept ? t('news.form.removeImage') : t('news.form.restoreImage')}
                className={`absolute end-1 top-1 cursor-pointer rounded-full p-1 text-white shadow transition ${
                  isKept ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isKept ? <X className="h-4 w-4" aria-hidden /> : <RotateCcw className="h-4 w-4" aria-hidden />}
              </button>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-sm text-gray-500">{t('news.form.imagesHint')}</p>
    </div>
  );
}
