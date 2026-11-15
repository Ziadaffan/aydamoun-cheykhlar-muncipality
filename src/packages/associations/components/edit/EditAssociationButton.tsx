import { useTranslation } from 'react-i18next';
import Button from '@/packages/common/components/Button';

type EditAssociationButtonProps = {
  isSubmitting: boolean;
};

export default function EditAssociationButton({ isSubmitting }: EditAssociationButtonProps) {
  const { t } = useTranslation();
  return (
    <Button type="submit" variant="warning" size="lg" loading={isSubmitting} className="w-full sm:w-auto">
      {t('associations.form.save')}
    </Button>
  );
}
