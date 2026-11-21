'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Banner from '@/packages/common/components/Banner';
import { DeleteButton } from '@/packages/common/components/DeleteButton';
import { jsonBody } from '../../common/adminApi';
import AdminPage from '../../common/AdminPage';
import { servicesResource, ServiceDto } from '../servicesResource';
import { serviceTypeKey } from '../serviceTypes';
import EmptyState from '@/packages/common/components/EmptyState';
import { Inbox } from 'lucide-react';

export default function AdminServicesPage() {
  const { t } = useTranslation();
  const { data: services, isLoading, error } = servicesResource.useList();
  const { mutate: deleteService, isPending: isDeleting, variables: deletingId } = servicesResource.useDelete();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const onDelete = (service: ServiceDto) => {
    if (!confirm(t('admin.common.deleteConfirmation'))) return;
    deleteService(service.id, {
      onSuccess: () => setMessage({ type: 'success', text: t('admin.common.messages.deleted') }),
      onError: err =>
        setMessage({
          type: 'error',
          text: t(
            (err as { code?: string }).code === 'SERVICE_HAS_SUBMISSIONS'
              ? 'admin.services.messages.hasSubmissions'
              : 'admin.common.messages.deleteError'
          ),
        }),
    });
  };

  return (
    <AdminPage
      title={t('admin.services.title')}
      description={t('admin.services.description')}
      action={{ label: t('admin.services.create'), href: '/admin/services/create' }}
      isLoading={isLoading}
      error={error}
    >
      {message && <Banner type={message.type} message={message.text} onClose={() => setMessage(null)} />}

      {services?.length === 0 ? (
        <EmptyState icon={Inbox} title={t('admin.services.empty')} />
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200 text-start">
            <thead className="bg-gray-50 text-sm font-semibold text-gray-600">
              <tr>
                <th className="px-4 py-3">{t('admin.services.fields.name')}</th>
                <th className="px-4 py-3">{t('admin.services.fields.type')}</th>
                <th className="px-4 py-3">{t('admin.services.fields.formFields')}</th>
                <th className="px-4 py-3">{t('admin.common.order')}</th>
                <th className="px-4 py-3">{t('admin.services.fields.active')}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {services?.map(service => (
                <ServiceRow
                  key={service.id}
                  service={service}
                  onDelete={() => onDelete(service)}
                  isDeleting={isDeleting && deletingId === service.id}
                  onMessage={setMessage}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminPage>
  );
}

type ServiceRowProps = {
  service: ServiceDto;
  onDelete: () => void;
  isDeleting: boolean;
  onMessage: (message: { type: 'success' | 'error'; text: string }) => void;
};

function ServiceRow({ service, onDelete, isDeleting, onMessage }: ServiceRowProps) {
  const { t } = useTranslation();
  const { mutate: update, isPending } = servicesResource.useUpdate(service.id);

  const toggleActive = () =>
    update(jsonBody('PUT', { active: !service.active }), {
      onError: () => onMessage({ type: 'error', text: t('admin.common.messages.saveError') }),
    });

  return (
    <tr className={service.active ? '' : 'bg-gray-50 text-gray-500'}>
      <td className="px-4 py-3 font-semibold text-gray-900">{service.name}</td>
      <td className="px-4 py-3">{t(serviceTypeKey(service.type))}</td>
      <td className="px-4 py-3">
        {service.fields.length}
        {!service.hasCustomFields && <span className="ms-1 text-xs text-gray-500">({t('admin.services.defaultsShort')})</span>}
      </td>
      <td className="px-4 py-3">{service.order}</td>
      <td className="px-4 py-3">
        <button
          type="button"
          onClick={toggleActive}
          disabled={isPending}
          className={`cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition disabled:opacity-50 ${
            service.active ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {service.active ? t('admin.services.active') : t('admin.services.inactive')}
        </button>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/services/${service.id}/edit`}
            className="rounded-md bg-blue-100 px-3 py-1.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-200"
          >
            {t('admin.common.edit')}
          </Link>
          <DeleteButton onClick={onDelete} isDeleting={isDeleting} />
        </div>
      </td>
    </tr>
  );
}
