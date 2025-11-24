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
      description: '',
      provider: '',
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
        description: jobData.description ?? '',
        provider: jobData.provider || '',
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
        setMessage({ type: 'success', text: 'تم تحديث الوظيفة بنجاح' });
        setTimeout(() => {
          router.push('/jobs');
        }, 1000);
      },
      onError: () => {
        setMessage({ type: 'error', text: 'فشل في تحديث الوظيفة' });
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
        <h3 className="mb-6 border-b pb-2 text-xl font-bold text-gray-800">تعديل الوظيفة</h3>
      </div>

      <div className="space-y-6">
        <ControlledInputText
          id="title"
          label="عنوان الوظيفة"
          type="text"
          control={control}
          name="title"
          error={errors.title}
          placeholder="أدخل عنوان الوظيفة"
          required
        />

        <ControlledTextArea
          id="description"
          label="الوصف"
          control={control}
          name="description"
          error={errors.description}
          placeholder="أدخل وصف الوظيفة"
          rows={5}
        />

        <ControlledInputText
          id="provider"
          label="اسم المزود"
          type="text"
          control={control}
          name="provider"
          error={errors.provider}
          placeholder="أدخل اسم المزود"
          required
        />

        <ControlledInputText
          id="location"
          label="الموقع"
          type="text"
          control={control}
          name="location"
          error={errors.location}
          placeholder="أدخل موقع الوظيفة"
          required
        />

        <ControlledInputText
          id="salary"
          label="الراتب"
          type="text"
          control={control}
          name="salary"
          error={errors.salary}
          placeholder="أدخل الراتب (اختياري)"
        />

        <ControlledInputText id="deadline" label="آخر موعد للتقديم" type="datetime-local" control={control} name="deadline" error={errors.deadline} />

      </div>

      <div className="mt-8">
        <EditJobButton isSubmitting={isPending} />
      </div>
    </form>
  );
}
