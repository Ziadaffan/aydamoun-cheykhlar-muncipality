'use client';

import ControlledInputText from '@/packages/common/components/form/ControlledInputText';
import ControlledTextArea from '@/packages/common/components/form/ControlledTextArea';
import ControlledCheckbox from '@/packages/common/components/form/ControlledCheckbox';
import CreateJobButton from './CreateJobButton';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { createJobSchema, CreateJobFormData } from '@/packages/jobs/validation/jobs.validation';
import FormMessage from '@/packages/common/components/form/InfoMessage';
import { useState } from 'react';
import { useCreateJob } from '@/packages/jobs/hooks/useCreateJob';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { EnglishInput, EnglishSection } from '@/packages/admin/common/EnglishFields';

export default function CreateJobForm() {
  const { t } = useTranslation();
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateJobFormData>({
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
    resolver: yupResolver(createJobSchema),
  });

  const { mutate: createJob, error } = useCreateJob();

  const onSubmit = (data: CreateJobFormData) => {
    setIsPending(true);
    setMessage(null);

    const jobData = {
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

    createJob(jobData, {
      onSuccess: () => {
        setMessage({ type: 'success', text: t('jobs.form.messages.createSuccess') });
        setTimeout(() => {
          router.push('/jobs');
        }, 1000);
      },
      onError: () => {
        setMessage({ type: 'error', text: t('jobs.form.messages.createError') });
      },
      onSettled: () => {
        setIsPending(false);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl bg-white p-8 shadow-xl" noValidate>
      <FormMessage message={message} onClose={() => setMessage(null)} />

      <div className="mb-8">
        <h3 className="mb-6 border-b pb-2 text-xl font-bold text-gray-800">{t('jobs.form.createTitle')}</h3>
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

        <ControlledInputText
          id="deadline"
          label={t('jobs.form.deadline')}
          type="datetime-local"
          control={control}
          name="deadline"
          error={errors.deadline}
        />

        <ControlledCheckbox id="active" label={t('jobs.form.active')} control={control} name="active" error={errors.active} />
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
        <CreateJobButton isSubmitting={isPending} />
      </div>
    </form>
  );
}

