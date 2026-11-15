'use client';

import { useTranslation } from 'react-i18next';
import AdminPage from '../../common/AdminPage';
import ServiceAdminForm from './ServiceAdminForm';

export default function CreateServicePage() {
  const { t } = useTranslation();
  return (
    <AdminPage title={t('admin.services.createTitle')} showBack width="narrow">
      <ServiceAdminForm />
    </AdminPage>
  );
}
