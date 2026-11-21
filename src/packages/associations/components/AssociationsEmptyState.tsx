import { Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import EmptyState from '@/packages/common/components/EmptyState';

type AssociationsEmptyStateProps = {
  associations: Array<unknown>;
};

export default function AssociationsEmptyState({ associations }: AssociationsEmptyStateProps) {
  const { t } = useTranslation();
  if (associations.length > 0) return null;
  return <EmptyState icon={Users} title={t('associations.empty')} description={t('associations.emptyDescription')} />;
}
