'use client';

import ControlledInputText from '@/packages/common/components/form/ControlledInputText';
import ControlledTextArea from '@/packages/common/components/form/ControlledTextArea';
import ControlledCheckbox from '@/packages/common/components/form/ControlledCheckbox';
import EditJobButton from './EditJobButton';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { updateJobSchema, UpdateJobFormData } from '@/packages/jobs/validation/jobs.validation';
import * as yup from 'yup';
import FormMessage from '@/packages/common/components/form/InfoMessage';
import { useState, useEffect } from 'react';
import { useUpdateJob } from '@/packages/jobs/hooks/useUpdateJob';
import useGetJobById from '@/packages/jobs/hooks/useGetJobById';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter, useParams } from 'next/navigation';
import Spinner from '@/packages/common/components/Spinner';
import ErrorMessage from '@/packages/common/components/ErrorMessage';
import { EnglishInput, EnglishSection } from '@/packages/admin/common/EnglishFields';

export default function EditJobForm() {
  const { t } = useTranslation();
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();
  const params = useParams();
  const jobId = params?.id as string;

  const { data: jobData, isLoading, error } = useGetJobById(jobId);
  const { mutate: updateJob } = useUpdateJob();

  const form = useForm({
    defaultValues: {
      title: '',
      titleEn: '',
      descriptionEn: '',
      providerEn: '',
      locationEn: '',
      description: '',
      provider: '',
      phone: '',
      location: '',
      salary: '',
      deadline: '',
      active: true,
    },
    resolver: yupResolver(updateJobSchema),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (jobData) {
      // Format deadline for datetime-local input (YYYY-MM-DDTHH:mm)
      let formattedDeadline: string | null = null;
      if (jobData.deadline) {
        const date = new Date(jobData.deadline);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        formattedDeadline = `${year}-${month}-${day}T${hours}:${minutes}`;
      }

      reset({
        title: jobData.title || '',
        titleEn: jobData.titleEn ?? '',
        descriptionEn: jobData.descriptionEn ?? '',
        providerEn: jobData.providerEn ?? '',
        locationEn: jobData.locationEn ?? '',
        description: jobData.description ?? '',
        provider: jobData.provider || '',
        phone: jobData.phone ?? '',
        location: jobData.location || '',
        salary: jobData.salary ?? '',
        deadline: formattedDeadline || '',
        active: jobData.active ?? true,
      });
    }
  }, [jobData, reset]);

  const onSubmit = (data: yup.InferType<typeof updateJobSchema>) => {
    setIsPending(true);
    setMessage(null);

    // Convert deadline to Date if it's a string from datetime-local input
    // Convert empty strings to null for optional fields
    const jobToUpdate = {
      id: jobId,
      ...data,
      description: data.description && typeof data.description === 'string' && data.description.trim() ? data.description : null,
      phone: data.phone && typeof data.phone === 'string' && data.phone.trim() ? data.phone : null,
      salary: data.salary && typeof data.salary === 'string' && data.salary.trim() ? data.salary : null,
      deadline:
        data.deadline && typeof data.deadline === 'string' && data.deadline.trim()
          ? new Date(data.deadline)
          : data.deadline instanceof Date
            ? data.deadline
            : null,
    };

    updateJob(jobToUpdate, {
      onSuccess: () => {
        setMessage({ type: 'success', text: t('jobs.form.messages.updateSuccess') });
        setTimeout(() => {
          router.push('/jobs');
        }, 1000);
      },
      onError: () => {
        setMessage({ type: 'error', text: t('jobs.form.messages.updateError') });
      },
      onSettled: () => {
        setIsPending(false);
      },
    });
  };

  if (isLoading) {
    return <Spinner className="min-h-screen" />;
  }

  if (error) {
    return <ErrorMessage />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl bg-white p-8 shadow-xl" noValidate>
      <FormMessage message={message} onClose={() => setMessage(null)} />

      <div className="mb-8">
        <h3 className="mb-6 border-b pb-2 text-xl font-bold text-gray-800">{t('jobs.form.editTitle')}</h3>
      </div>

      <div className="space-y-6">
        <ControlledInputText
          id="title"
          label={t('jobs.form.title')}
          type="text"
          control={control}
          name="title"
          error={errors.title}
          placeholder={t('jobs.form.titlePlaceholder')}
          required
        />

        <ControlledTextArea
          id="description"
          label={t('jobs.form.description')}
          control={control}
          name="description"
          error={errors.description}
          placeholder={t('jobs.form.descriptionPlaceholder')}
          rows={5}
        />

        <ControlledInputText
          id="provider"
          label={t('jobs.form.provider')}
          type="text"
          control={control}
          name="provider"
          error={errors.provider}
          placeholder={t('jobs.form.providerPlaceholder')}
          required
        />

        <ControlledInputText
          id="phone"
          label={t('jobs.form.phone')}
          type="tel"
          control={control}
          name="phone"
          error={errors.phone}
          placeholder={t('jobs.form.phonePlaceholder')}
        />

        <ControlledInputText
          id="location"
          label={t('jobs.form.location')}
          type="text"
          control={control}
          name="location"
          error={errors.location}
          placeholder={t('jobs.form.locationPlaceholder')}
          required
        />

        <ControlledInputText
          id="salary"
          label={t('jobs.form.salary')}
          type="text"
          control={control}
          name="salary"
          error={errors.salary}
          placeholder={t('jobs.form.salaryPlaceholder')}
        />

        <ControlledInputText id="deadline" label={t('jobs.form.deadline')} type="datetime-local" control={control} name="deadline" error={errors.deadline} />

      </div>

      <div className="mt-6">
        <EnglishSection>
          <EnglishInput id="titleEn" name="titleEn" control={control} label={t('jobs.form.title')} error={errors.titleEn} />
          <EnglishInput id="descriptionEn" name="descriptionEn" control={control} label={t('jobs.form.description')} error={errors.descriptionEn} rows={5} />
          <EnglishInput id="providerEn" name="providerEn" control={control} label={t('jobs.form.provider')} error={errors.providerEn} />
          <EnglishInput id="locationEn" name="locationEn" control={control} label={t('jobs.form.location')} error={errors.locationEn} />
        </EnglishSection>
      </div>

      <div className="mt-8">
        <EditJobButton isSubmitting={isPending} />
      </div>
    </form>
  );
}
