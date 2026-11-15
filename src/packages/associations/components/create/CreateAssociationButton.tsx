import { useTranslation } from 'react-i18next';
import Button from '@/packages/common/components/Button';

type CreateAssociationButtonProps = {
  isSubmitting: boolean;
};

export default function CreateAssociationButton({ isSubmitting }: CreateAssociationButtonProps) {
  const { t } = useTranslation();
  return (
    <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full sm:w-auto">
      {t('associations.form.create')}
    </Button>
  );
}
