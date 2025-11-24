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
      description: '',
      provider: '',
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
        setMessage({ type: 'success', text: 'تم إنشاء الوظيفة بنجاح' });
        setTimeout(() => {
          router.push('/jobs');
        }, 1000);
      },
      onError: () => {
        setMessage({ type: 'error', text: 'فشل في إنشاء الوظيفة' });
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
        <h3 className="mb-6 border-b pb-2 text-xl font-bold text-gray-800">إنشاء وظيفة جديدة</h3>
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

        <ControlledInputText
          id="deadline"
          label="آخر موعد للتقديم"
          type="datetime-local"
          control={control}
          name="deadline"
          error={errors.deadline}
        />

        <ControlledCheckbox id="active" label="نشط" control={control} name="active" error={errors.active} />
      </div>

      <div className="mt-8">
        <CreateJobButton isSubmitting={isPending} />
      </div>
    </form>
  );
}

