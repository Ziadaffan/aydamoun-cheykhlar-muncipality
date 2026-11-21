'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '@/packages/common/components/Modal';
import StoredImage from '@/packages/common/components/StoredImage';

type ServiceImageThumbnailProps = {
  /** The photo's Cloudinary public id (an 'image' field's value). */
  src: string;
  /** The field's label: the photo's alt text and the dialog's title. */
  label: string;
  className?: string;
};

/** A request's photo as a thumbnail; a click shows it whole in a dialog. */
export default function ServiceImageThumbnail({ src, label, className = 'h-40 w-full' }: ServiceImageThumbnailProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t('services.form.photo.view')}
        className={`relative block cursor-zoom-in overflow-hidden rounded-lg border border-gray-200 bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${className}`}
      >
        <StoredImage src={src} alt={label} sizes="(max-width: 768px) 100vw, 400px" />
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title={label} size="lg">
        <div className="relative h-[70dvh] w-full">
          <StoredImage src={src} alt={label} className="object-contain" sizes="100vw" />
        </div>
      </Modal>
    </>
  );
}
