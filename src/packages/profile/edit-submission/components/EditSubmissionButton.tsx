'use client';

import { useTranslation } from 'react-i18next';
import Button from '@/packages/common/components/Button';

type EditSubmissionButtonProps = {
  isSubmitting: boolean;
  isDirty: boolean;
  /** A photo is still uploading. */
  isUploading?: boolean;
  isValid: boolean;
};

export default function EditSubmissionButton({ isSubmitting, isDirty, isValid, isUploading = false }: EditSubmissionButtonProps) {
  const { t } = useTranslation();

  return (
    <div className="flex justify-end">
      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={isSubmitting}
        disabled={isSubmitting || !isDirty || !isValid || isUploading}
        className="w-full"
      >
        {isUploading ? t('services.form.photo.waitForUpload') : t('services.form.buttons.submit')}
      </Button>
    </div>
  );
}
