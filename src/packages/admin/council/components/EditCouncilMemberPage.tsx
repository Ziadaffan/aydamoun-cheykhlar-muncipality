'use client';

import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import AdminPage from '../../common/AdminPage';
import { councilResource } from '../councilResource';
import CouncilMemberForm from './CouncilMemberForm';

export default function EditCouncilMemberPage() {
  const { t } = useTranslation();
  const id = useParams()?.id as string;
  const { data, isLoading, error } = councilResource.useOne(id);

  return (
    <AdminPage title={t('admin.council.editTitle')} showBack width="narrow" isLoading={isLoading} error={error}>
      {data && <CouncilMemberForm member={data} />}
    </AdminPage>
  );
}
