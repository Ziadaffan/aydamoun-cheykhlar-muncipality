'use client';

import { useTranslation } from 'react-i18next';
import AdminPage from '../../common/AdminPage';
import CouncilMemberForm from './CouncilMemberForm';

export default function CreateCouncilMemberPage() {
  const { t } = useTranslation();
  return (
    <AdminPage title={t('admin.council.createTitle')} showBack width="narrow">
      <CouncilMemberForm />
    </AdminPage>
  );
}
