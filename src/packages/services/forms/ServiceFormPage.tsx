import { BackButton } from '@/packages/common/components/BackButton';
import ServiceForm from '@/packages/services/forms/ServiceForm';
import { useTranslation } from 'react-i18next';
import Spinner from '@/packages/common/components/Spinner';
import ServiceNotFound from '@/packages/common/components/ServiceNotFound';
import { useGetService } from '@/packages/services/hooks/useGetService';
import { useParams } from 'next/navigation';
import { resolveServiceFields } from '@/packages/services/utils/serviceFields';
import { useLocalized } from '@/lib/localized';

export default function ServiceFormPage() {
  const { t } = useTranslation();
  const params = useParams();
  const serviceId = params?.serviceId as string;

  const { data: service, isLoading, error } = useGetService(serviceId);
  const loc = useLocalized();

  if (isLoading) return <Spinner className="min-h-screen" />;

  // A service the municipality has stopped (inactive) no longer takes requests.
  if (error || !service || service.active === false) return <ServiceNotFound />;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-green-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <BackButton />
          </div>

          <div className="mb-8 text-center">
            <h1 className="mb-4 text-3xl font-bold text-gray-800">{loc(service.name, service.nameEn)}</h1>
            <p className="mb-4 text-lg text-gray-600">{loc(service.description, service.descriptionEn)}</p>
            <p className="text-md text-gray-500">{t('services.formInstructions')}</p>
          </div>

          <ServiceForm serviceId={service.id} fields={resolveServiceFields(service)} />
        </div>
      </div>
    </div>
  );
}
