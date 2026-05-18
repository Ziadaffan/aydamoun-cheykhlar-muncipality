'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ControlledInputText from '@/packages/common/components/form/ControlledInputText';
import ControlledTextArea from '@/packages/common/components/form/ControlledTextArea';
import ControlledFileInput from '@/packages/common/components/form/ControlledFileInput';
import FormMessage from '@/packages/common/components/form/InfoMessage';
import { createAssociationSchema, CreateAssociationFormData } from '@/packages/associations/validation/associations.validation';
import { useCreateAssociation } from '@/packages/associations/hooks/useCreateAssociation';
import CreateAssociationButton from './CreateAssociationButton';

export default function CreateAssociationForm() {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAssociationFormData>({
    defaultValues: {
      name: '',
      description: '',
      image: undefined,
    },
    resolver: yupResolver(createAssociationSchema),
  });

  const { mutate: createAssociation } = useCreateAssociation();

  const onSubmit = (data: CreateAssociationFormData) => {
    setIsPending(true);
    setMessage(null);

    createAssociation(data, {
      onSuccess: () => {
        setMessage({ type: 'success', text: 'تم إنشاء المؤسسة بنجاح' });
        setTimeout(() => {
          router.push('/associations');
        }, 1000);
      },
      onError: () => {
        setMessage({ type: 'error', text: 'فشل في إنشاء المؤسسة' });
      },
      onSettled: () => {
        setIsPending(false);
      },
    });
  };

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
          label="صورة المؤسسة"
          control={control}
          name="image"
          error={errors.image}
          accept="image/jpeg,image/png,image/gif,image/webp"
          required
        />
      </div>

      <div className="mt-8">
        <CreateAssociationButton isSubmitting={isPending} />
      </div>
    </form>
  );
}
