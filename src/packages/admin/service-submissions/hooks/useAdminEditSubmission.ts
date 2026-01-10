import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { Service, ServiceStatus, ServiceSubmission } from '@prisma/client';
import { createServiceSubmissionSchema } from '@/packages/services/validation/services.validation';
import { mapServiceTypeToCategory } from '@/packages/services/utils/category.utils';
import { useAdminServiceSubmission } from './useAdminSubmission';
import { useAdminUpdateServiceSubmission } from './useAdminUpdateServiceSubmission';

type FormData = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  serviceType: string;
  description: string;
  additionalInfo: Record<string, any>;
  status?: ServiceStatus | undefined;
};

export function useAdminEditSubmission(submissionId: string) {
  const { t } = useTranslation();
  const router = useRouter();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [mappedCategory, setMappedCategory] = useState<string>('');
  const [mappedServiceId, setMappedServiceId] = useState<string>('');

  const { data: submissionData, isLoading: isLoadingSubmission, error: errorSubmission } = useAdminServiceSubmission(submissionId);
  const { mutate: updateServiceSubmission, isPending: isLoadingUpdate } = useAdminUpdateServiceSubmission();

  const form = useForm<FormData>({
    resolver: yupResolver(createServiceSubmissionSchema(mappedCategory, mappedServiceId)) as any,
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      address: '',
      serviceType: '',
      description: '',
      additionalInfo: {},
      status: undefined,
    },
  });

  useEffect(() => {
    if (submissionData) {
      const category = mapServiceTypeToCategory(submissionData.service?.type || '');
      const serviceId = submissionData.serviceId;

      setMappedCategory(category);
      setMappedServiceId(serviceId);

      form.reset({
        fullName: submissionData.fullName || '',
        phone: submissionData.phone || '',
        email: submissionData.email || '',
        address: submissionData.address || '',
        serviceType: submissionData.serviceId || '',
        description: submissionData.description || '',
        additionalInfo: (submissionData.additionalInfo as any) || {},
        status: submissionData.status || undefined,
      });
    }
  }, [submissionData, form]);

  const onSubmit = (data: FormData) => {
    setMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    updateServiceSubmission(
      {
        submissionId,
        data,
      },
      {
        onSuccess: () => {
          setMessage({ type: 'success', text: t('profile.editSubmission.messages.updateSuccess') });
        },
        onError: () => {
          setMessage({ type: 'error', text: t('profile.editSubmission.messages.updateError') });
        },
        onSettled: () => {
          setTimeout(() => {
            router.push('/admin/service-submissions');
          }, 800);
        },
      }
    );
  };

  const closeMessage = () => setMessage(null);

  return {
    form,
    submission: (submissionData as ServiceSubmission & { service: Service }) || null,
    errorSubmission,
    isLoading: isLoadingSubmission,
    isSubmitting: isLoadingUpdate,
    message,
    onSubmit,
    closeMessage,
    mappedCategory,
    mappedServiceId,
  };
}
