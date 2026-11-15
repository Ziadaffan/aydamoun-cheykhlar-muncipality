'use client';

import { useTranslation } from 'react-i18next';
import AdminPage from '../../common/AdminPage';
import { historyResource } from '../historyResource';
import HistoryEntryForm from './HistoryEntryForm';

export default function CreateHistoryEntryPage() {
  const { t } = useTranslation();
  // A new entry goes to the end of the timeline unless the admin changes its order.
  const { data: entries, isLoading } = historyResource.useList();
  const nextOrder = entries?.length ? Math.max(...entries.map(entry => entry.order)) + 1 : 0;

  return (
    <AdminPage title={t('admin.history.createTitle')} showBack width="narrow" isLoading={isLoading}>
      <HistoryEntryForm nextOrder={nextOrder} />
    </AdminPage>
  );
}
