import { TFunction } from 'i18next';
import PageHeader from '@/packages/common/components/PageHeader';
import CreateDocumentAdminButton from './CreateDocumentAdminButton';

type DocumentsHeaderProps = {
  t: TFunction;
  role?: string;
};

export default function DocumentsHeader({ t, role }: DocumentsHeaderProps) {
  return (
    <PageHeader title={t('documents.title')} subtitle={t('documents.description')}>
      {role === 'ADMIN' && <CreateDocumentAdminButton t={t} />}
    </PageHeader>
  );
}
