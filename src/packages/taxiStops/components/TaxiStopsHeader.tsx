import { useTranslation } from 'react-i18next';
import PageHeader from '@/packages/common/components/PageHeader';

export default function TaxiStopsHeader() {
  const { t } = useTranslation();
  return <PageHeader title={t('taxiStops.title')} subtitle={t('taxiStops.subtitle')} />;
}
