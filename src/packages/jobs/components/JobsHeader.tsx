import { useTranslation } from 'react-i18next';
import PageHeader from '@/packages/common/components/PageHeader';

export default function JobsHeader() {
  const { t } = useTranslation();

  return (
    <PageHeader title={t('jobs.title')} subtitle={t('jobs.subtitle')}>
      <p className="mx-auto mt-2 max-w-3xl text-sm text-gray-500 md:text-base">{t('jobs.addJobMessage')}</p>
    </PageHeader>
  );
}
