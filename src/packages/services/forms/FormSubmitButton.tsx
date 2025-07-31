'use client';

import { useTranslation } from 'react-i18next';
import Button from '@/packages/common/components/Button';

type FormSubmitButtonProps = {
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
};

export default function FormSubmitButton({ isSubmitting, isDirty, isValid }: FormSubmitButtonProps) {
  const { t } = useTranslation();

  return (
    <div className="flex justify-end">
      <Button type="submit" variant="primary" size="lg" loading={isSubmitting} disabled={isSubmitting || !isDirty || !isValid} className="w-full">
        {t('services.form.buttons.submit')}
      </Button>
    </div>
  );
}
