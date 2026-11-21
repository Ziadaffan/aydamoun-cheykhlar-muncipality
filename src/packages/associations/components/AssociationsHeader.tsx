import { useTranslation } from 'react-i18next';
import PageHeader from '@/packages/common/components/PageHeader';

export default function AssociationsHeader() {
  const { t } = useTranslation();
  return <PageHeader title={t('associations.title')} subtitle={t('associations.subtitle')} />;
}
