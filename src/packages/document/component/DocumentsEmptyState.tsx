import { TFunction } from 'i18next';
import { FileText } from 'lucide-react';
import EmptyState from '@/packages/common/components/EmptyState';

type DocumentsEmptyStateProps = {
  t: TFunction;
};

export default function DocumentsEmptyState({ t }: DocumentsEmptyStateProps) {
  return <EmptyState icon={FileText} title={t('documents.noDocuments')} description={t('documents.noDocumentsDescription')} />;
}
