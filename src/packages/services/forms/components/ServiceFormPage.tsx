import { BackButton } from '@/packages/common/components/BackBotton';
import ServiceForm from './ServiceForm';
import { useTranslation } from 'react-i18next';
import { getServiceCategoryMeta } from '@/packages/services/utils/service.utils';
import Spinner from '@/packages/common/components/Spinner';
import ServiceNotFound from '@/packages/common/components/ServiceNotFound';
import { useGetService } from '../../hooks/useGetService';
import { useParams } from 'next/navigation';

export default function ServiceFormPage() {
  const { t } = useTranslation();
  const params = useParams();
  const serviceId = params?.serviceId as string;

  const { data: service, isLoading, error } = useGetService(serviceId);

  if (isLoading) return <Spinner />;

  if (error || !service) return <ServiceNotFound />;

  const meta = getServiceCategoryMeta(service.type);
  const foundCategory = meta.categoryKey;
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-green-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <BackButton />
          </div>

          <div className="mb-8 text-center">
            <h1 className="mb-4 text-3xl font-bold text-gray-800">{service.name}</h1>
            <p className="mb-4 text-lg text-gray-600">{service.description}</p>
            <p className="text-md text-gray-500">{t('services.formInstructions')}</p>
          </div>

          <ServiceForm category={foundCategory} serviceId={service.id} />
        </div>
      </div>
    </div>
  );
}
