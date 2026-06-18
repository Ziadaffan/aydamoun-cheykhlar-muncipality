import { useTranslation } from 'react-i18next';
import Button from '@/packages/common/components/Button';

interface CreateJobButtonProps {
  isSubmitting: boolean;
}

export default function CreateJobButton({ isSubmitting }: CreateJobButtonProps) {
  const { t } = useTranslation();

  return (
    <Button type="submit" variant="primary" size="lg" loading={isSubmitting} disabled={isSubmitting} className="w-full">
      {isSubmitting ? 'جاري الإنشاء...' : 'إنشاء وظيفة'}
    </Button>
  );
}

