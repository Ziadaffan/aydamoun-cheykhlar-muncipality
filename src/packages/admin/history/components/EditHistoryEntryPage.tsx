'use client';

import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import AdminPage from '../../common/AdminPage';
import { historyResource } from '../historyResource';
import HistoryEntryForm from './HistoryEntryForm';

export default function EditHistoryEntryPage() {
  const { t } = useTranslation();
  const id = useParams()?.id as string;
  const { data, isLoading, error } = historyResource.useOne(id);

  return (
    <AdminPage title={t('admin.history.editTitle')} showBack width="narrow" isLoading={isLoading} error={error}>
      {data && <HistoryEntryForm entry={data} />}
    </AdminPage>
  );
}
