import { useTranslation } from 'react-i18next';
import Button from '@/packages/common/components/Button';

type CreateTaxiStopButtonProps = {
  isSubmitting: boolean;
};

export default function CreateTaxiStopButton({ isSubmitting }: CreateTaxiStopButtonProps) {
  const { t } = useTranslation();
  return (
    <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full sm:w-auto">
      {t('taxiStops.form.create')}
    </Button>
  );
}
