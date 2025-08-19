'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { useCreateServiceSubmission } from '@/packages/services/hooks/useCreateServiceSubmission';
import { createServiceSubmissionSchema } from '@/packages/services/validation/services.validation';

type FormData = {
  // Informations personnelles
  fullName: string;
  phone: string;
  email: string;
  address: string;

  // Informations du service
  serviceType: string;
  description: string;

  // Informations supplémentaires selon la catégorie
  additionalInfo: Record<string, any>;

  // Documents
  // documents: File[];
};

type UseServiceFormProps = {
  category: string;
  serviceId: string;
};

export function useServiceForm({ category, serviceId }: UseServiceFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { mutate: createServiceSubmission } = useCreateServiceSubmission(serviceId);

  const form = useForm<FormData>({
    resolver: yupResolver(createServiceSubmissionSchema(category, serviceId)),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      address: '',
      serviceType: serviceId ? serviceId.toString() : '',
      description: '',
      additionalInfo: {},
      // documents: [],
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setMessage(null);

    window.scrollTo({ top: 0, behavior: 'smooth' });

    createServiceSubmission(data, {
      onSuccess: () => {
        setMessage({ type: 'success', text: t('services.form.messages.submitSuccess') });
        setTimeout(() => router.push('/services'), 1000);
      },
      onError: () => {
        setMessage({ type: 'error', text: t('services.form.messages.submitError') });
      },
      onSettled: () => {
        setIsSubmitting(false);
      },
    });
  };

  const closeMessage = () => {
    setMessage(null);
  };

  return {
    form,
    isSubmitting,
    message,
    onSubmit,
    closeMessage,
  };
}
