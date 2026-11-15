import { useTranslation } from 'react-i18next';
type TaxiStopsEmptyStateProps = {
  taxiStops: Array<unknown>;
};

export default function TaxiStopsEmptyState({ taxiStops }: TaxiStopsEmptyStateProps) {
  const { t } = useTranslation();
  if (taxiStops.length > 0) {
    return null;
  }

  return (
    <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-600">
      {t('taxiStops.empty')}
    </div>
  );
}
