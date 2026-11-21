import { CarTaxiFront } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import EmptyState from '@/packages/common/components/EmptyState';

type TaxiStopsEmptyStateProps = {
  taxiStops: Array<unknown>;
};

export default function TaxiStopsEmptyState({ taxiStops }: TaxiStopsEmptyStateProps) {
  const { t } = useTranslation();
  if (taxiStops.length > 0) return null;
  return <EmptyState icon={CarTaxiFront} title={t('taxiStops.empty')} description={t('taxiStops.emptyDescription')} />;
}
