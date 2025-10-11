import React from 'react';
import Button from '@/packages/common/components/Button';
import { useTranslation } from 'react-i18next';

interface CreateDocumentButtonProps {
  isSubmitting: boolean;
}

export default function CreateDocumentButton({ isSubmitting }: CreateDocumentButtonProps) {
  const { t } = useTranslation();
  const isDisabled = isSubmitting;

  return (
    <Button type="submit" variant="primary" size="lg" loading={isSubmitting} disabled={isDisabled} className="w-full">
      {isSubmitting ? t('documents.form.uploading') : t('documents.form.upload')}
    </Button>
  );
}
