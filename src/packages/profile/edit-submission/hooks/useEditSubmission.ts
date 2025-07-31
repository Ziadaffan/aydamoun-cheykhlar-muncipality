'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { Service, ServiceSubmission } from '@prisma/client';
import { createServiceSubmissionSchema } from '@/packages/services/validation/services.validation';
import { mapServiceTypeToCategory } from '@/packages/services/utils/category.utils';
import { useGetServiceSubmission } from './useGetServiceSubmission';
import { useUpdateServiceSubmission } from './useUpdateServiceSubmission';

type FormData = {
  fullName: string;
  phone: string;
  email: string;
  address: string;

  serviceType: string;
  description: string;

  additionalInfo: Record<string, any>;
};

type UseEditSubmissionProps = {
  submissionId: string;
  serviceId: string;
  category: string;
};

export function useEditSubmission({ submissionId, serviceId, category }: UseEditSubmissionProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [submission, setSubmission] = useState<(ServiceSubmission & { service: Service }) | null>(null);
  const { data: submissionData, isLoading: isLoadingSubmission, error: errorSubmission } = useGetServiceSubmission(submissionId);
  const { mutate: updateServiceSubmission, isPending: isLoadingUpdate, error: errorUpdate } = useUpdateServiceSubmission(submissionId);

  const [mappedCategory, setMappedCategory] = useState<string>('');
  const [mappedServiceId, setMappedServiceId] = useState<string>('');

  const form = useForm<FormData>({
    resolver: yupResolver(createServiceSubmissionSchema(mappedCategory, mappedServiceId)),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      address: '',
      serviceType: '',
      description: '',
      additionalInfo: {},
    },
  });

  useEffect(() => {
    if (submissionData) {
      setSubmission(submissionData);

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
        additionalInfo: submissionData.additionalInfo || {},
      });
    }
  }, [submissionData, form]);

  const onSubmit = async (data: FormData) => {
    setMessage(null);

    window.scrollTo({ top: 0, behavior: 'smooth' });

    updateServiceSubmission(data, {
      onSuccess: () => {
        setMessage({ type: 'success', text: t('profile.editSubmission.messages.updateSuccess') });
      },
      onError: () => {
        setMessage({ type: 'error', text: t('profile.editSubmission.messages.updateError') });
      },
      onSettled: () => {
        setTimeout(() => {
          router.push('/profile');
        }, 1000);
      },
    });
  };

  const closeMessage = () => {
    setMessage(null);
  };

  return {
    form,
    submission,
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
