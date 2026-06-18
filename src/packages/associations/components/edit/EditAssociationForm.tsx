'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ControlledInputText from '@/packages/common/components/form/ControlledInputText';
import ControlledTextArea from '@/packages/common/components/form/ControlledTextArea';
import ControlledFileInput from '@/packages/common/components/form/ControlledFileInput';
import FormMessage from '@/packages/common/components/form/InfoMessage';
import Spinner from '@/packages/common/components/Spinner';
import ErrorMessage from '@/packages/common/components/ErrorMessage';
import { updateAssociationSchema, UpdateAssociationFormData } from '@/packages/associations/validation/associations.validation';
import useGetAssociationById from '@/packages/associations/hooks/useGetAssociationById';
import { useUpdateAssociation } from '@/packages/associations/hooks/useUpdateAssociation';
import EditAssociationButton from './EditAssociationButton';

export default function EditAssociationForm() {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();
  const params = useParams();
  const associationId = params?.id as string;

  const { data, isLoading, error } = useGetAssociationById(associationId);
  const { mutate: updateAssociation } = useUpdateAssociation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateAssociationFormData>({
    defaultValues: {
      name: '',
      description: '',
      image: null,
    },
    resolver: yupResolver(updateAssociationSchema),
  });

  useEffect(() => {
    if (data) {
      reset({
        name: data.name || '',
        description: data.description || '',
        image: null,
      });
    }
  }, [data, reset]);

  const onSubmit = (formData: UpdateAssociationFormData) => {
    setIsPending(true);
    setMessage(null);

    updateAssociation(
      {
        id: associationId,
        ...formData,
      },
      {
        onSuccess: () => {
          setMessage({ type: 'success', text: 'تم تحديث المؤسسة بنجاح' });
          setTimeout(() => {
            router.push('/associations');
          }, 1000);
        },
        onError: () => {
          setMessage({ type: 'error', text: 'فشل في تحديث المؤسسة' });
        },
        onSettled: () => {
          setIsPending(false);
        },
      }
    );
  };

  if (isLoading) {
    return <Spinner className="min-h-screen" />;
  }

  if (error) {
    return <ErrorMessage />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl bg-white p-6 shadow-xl md:p-8" noValidate>
      <FormMessage message={message} onClose={() => setMessage(null)} />

      <div className="space-y-6">
        <ControlledInputText
          id="name"
          label="اسم المؤسسة"
          type="text"
          control={control}
          name="name"
          error={errors.name}
          placeholder="أدخل اسم المؤسسة"
          required
        />

        <ControlledTextArea
          id="description"
          label="الوصف"
          control={control}
          name="description"
          error={errors.description}
          placeholder="أدخل وصف المؤسسة"
          rows={6}
          required
        />

        <ControlledFileInput
          id="image"
          label="صورة جديدة (اختياري)"
          control={control}
          name="image"
          error={errors.image}
          accept="image/jpeg,image/png,image/gif,image/webp"
        />
      </div>

      <div className="mt-8">
        <EditAssociationButton isSubmitting={isPending} />
      </div>
    </form>
  );
}
