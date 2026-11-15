'use client';

import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import AdminPage from '../../common/AdminPage';
import { announcementsResource } from '../announcementsResource';
import AnnouncementForm from './AnnouncementForm';

export default function EditAnnouncementPage() {
  const { t } = useTranslation();
  const id = useParams()?.id as string;
  const { data, isLoading, error } = announcementsResource.useOne(id);

  return (
    <AdminPage title={t('admin.announcements.editTitle')} showBack width="narrow" isLoading={isLoading} error={error}>
      {data && <AnnouncementForm announcement={data} />}
    </AdminPage>
  );
}
