'use client';

import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import AdminPage from '../../common/AdminPage';
import { servicesResource } from '../servicesResource';
import ServiceAdminForm from './ServiceAdminForm';

export default function EditServicePage() {
  const { t } = useTranslation();
  const id = useParams()?.id as string;
  const { data, isLoading, error } = servicesResource.useOne(id);

  return (
    <AdminPage title={t('admin.services.editTitle')} showBack width="narrow" isLoading={isLoading} error={error}>
      {data && <ServiceAdminForm service={data} />}
    </AdminPage>
  );
}
