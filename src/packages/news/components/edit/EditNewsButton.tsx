'use client';

import Button from '@/packages/common/components/Button';
import { useTranslation } from 'react-i18next';

interface EditNewsButtonProps {
  isSubmitting: boolean;
}

export default function EditNewsButton({ isSubmitting }: EditNewsButtonProps) {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center">
      <Button type="submit" variant="primary" size="lg" loading={isSubmitting} disabled={isSubmitting} className="min-w-[200px]">
        {isSubmitting ? t('news.form.updating') : t('news.page.updateNews')}
      </Button>
    </div>
  );
}
