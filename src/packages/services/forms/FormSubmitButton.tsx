'use client';

import { useTranslation } from 'react-i18next';
import Button from '@/packages/common/components/Button';

type FormSubmitButtonProps = {
  isSubmitting: boolean;
  isDirty: boolean;
  /** A photo is still uploading. */
  isUploading?: boolean;
};

export default function FormSubmitButton({ isSubmitting, isDirty, isUploading = false }: FormSubmitButtonProps) {
  const { t } = useTranslation();

  return (
    <div className="flex justify-end">
      <Button type="submit" variant="primary" size="lg" loading={isSubmitting} disabled={isSubmitting || !isDirty || isUploading} className="w-full">
        {isUploading ? t('services.form.photo.waitForUpload') : t('services.form.buttons.submit')}
      </Button>
    </div>
  );
}
