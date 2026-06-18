import { useTranslation } from 'react-i18next';
import Button from '@/packages/common/components/Button';

interface CreateNewsButtonProps {
  isSubmitting: boolean;
}

export default function CreateNewsButton({ isSubmitting }: CreateNewsButtonProps) {
  const { t } = useTranslation();

  return (
    <Button type="submit" variant="primary" size="lg" loading={isSubmitting} disabled={isSubmitting} className="w-full">
      {isSubmitting ? t('news.form.creating') : t('news.form.createNews')}
    </Button>
  );
}
