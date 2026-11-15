'use client';

import { useTranslation } from 'react-i18next';
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
import { EnglishInput, EnglishSection } from '@/packages/admin/common/EnglishFields';

export default function CreateAssociationForm() {
  const { t } = useTranslation();
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
      nameEn: '',
      descriptionEn: '',
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
        setMessage({ type: 'success', text: t('associations.form.messages.createSuccess') });
        setTimeout(() => {
          router.push('/associations');
        }, 1000);
      },
      onError: () => {
        setMessage({ type: 'error', text: t('associations.form.messages.createError') });
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
          label={t('associations.form.name')}
          type="text"
          control={control}
          name="name"
          error={errors.name}
          placeholder={t('associations.form.namePlaceholder')}
          required
        />

        <ControlledTextArea
          id="description"
          label={t('associations.form.description')}
          control={control}
          name="description"
          error={errors.description}
          placeholder={t('associations.form.descriptionPlaceholder')}
          rows={6}
          required
        />

        <ControlledFileInput
          id="image"
          label={t('associations.form.image')}
          control={control}
          name="image"
          error={errors.image}
          accept="image/jpeg,image/png,image/gif,image/webp"
          required
        />
      </div>

      <div className="mt-6">
        <EnglishSection>
          <EnglishInput id="nameEn" name="nameEn" control={control} label={t('associations.form.name')} error={errors.nameEn} />
          <EnglishInput id="descriptionEn" name="descriptionEn" control={control} label={t('associations.form.description')} error={errors.descriptionEn} rows={6} />
        </EnglishSection>
      </div>

      <div className="mt-8">
        <CreateAssociationButton isSubmitting={isPending} />
      </div>
    </form>
  );
}
