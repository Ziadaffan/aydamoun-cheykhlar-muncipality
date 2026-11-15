'use client';

import { Control, FieldError } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ControlledFileInput from '@/packages/common/components/form/ControlledFileInput';
import ControlledCheckbox from '@/packages/common/components/form/ControlledCheckbox';
import StoredImage from '@/packages/common/components/StoredImage';

type AdminImageFieldProps = {
  control: Control<any>;
  label: string;
  /** The image saved now (edit pages). */
  currentImage?: string | null;
  error?: FieldError;
  /** Form field names. */
  name?: string;
  removeName?: string;
};

/** Optional image: preview of the saved one, a file input to replace it and a "remove" checkbox. */
export default function AdminImageField({ control, label, currentImage, error, name = 'image', removeName = 'removeImage' }: AdminImageFieldProps) {
  const { t } = useTranslation();

  return (
    <div>
      {currentImage && (
        <div className="mb-3 flex items-center gap-4">
          <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
            <StoredImage src={currentImage} alt={label} sizes="96px" />
          </div>
          <ControlledCheckbox id={removeName} name={removeName} control={control} label={t('admin.common.removeImage')} />
        </div>
      )}
      <ControlledFileInput id={name} name={name} control={control} label={label} accept="image/jpeg,image/png,image/gif,image/webp" error={error} />
    </div>
  );
}
