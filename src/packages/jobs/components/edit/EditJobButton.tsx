import { useTranslation } from 'react-i18next';
import Button from '@/packages/common/components/Button';

interface EditJobButtonProps {
  isSubmitting: boolean;
}

export default function EditJobButton({ isSubmitting }: EditJobButtonProps) {
  const { t } = useTranslation();

  return (
    <Button type="submit" variant="primary" size="lg" loading={isSubmitting} disabled={isSubmitting} className="w-full">
      {isSubmitting ? 'جاري التحديث...' : 'تحديث الوظيفة'}
    </Button>
  );
}

