import { useTranslation } from 'react-i18next';
import Button from '@/packages/common/components/Button';

type EditTaxiStopButtonProps = {
  isSubmitting: boolean;
};

export default function EditTaxiStopButton({ isSubmitting }: EditTaxiStopButtonProps) {
  const { t } = useTranslation();
  return (
    <Button type="submit" variant="warning" size="lg" loading={isSubmitting} className="w-full sm:w-auto">
      {t('taxiStops.form.save')}
    </Button>
  );
}
