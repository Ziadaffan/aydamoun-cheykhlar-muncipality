'use client';

import { useTranslation } from 'react-i18next';
import AdminPage from '../../common/AdminPage';
import AnnouncementForm from './AnnouncementForm';

export default function CreateAnnouncementPage() {
  const { t } = useTranslation();
  return (
    <AdminPage title={t('admin.announcements.createTitle')} showBack width="narrow">
      <AnnouncementForm />
    </AdminPage>
  );
}
