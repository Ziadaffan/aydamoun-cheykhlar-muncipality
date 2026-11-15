'use client';

import { useTranslation } from 'react-i18next';
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
import { EnglishInput, EnglishSection } from '@/packages/admin/common/EnglishFields';

export default function EditAssociationForm() {
  const { t } = useTranslation();
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
      nameEn: '',
      descriptionEn: '',
      description: '',
      image: null,
    },
    resolver: yupResolver(updateAssociationSchema),
  });

  useEffect(() => {
    if (data) {
      reset({
        name: data.name || '',
        nameEn: data.nameEn ?? '',
        descriptionEn: data.descriptionEn ?? '',
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
          setMessage({ type: 'success', text: t('associations.form.messages.updateSuccess') });
          setTimeout(() => {
            router.push('/associations');
          }, 1000);
        },
        onError: () => {
          setMessage({ type: 'error', text: t('associations.form.messages.updateError') });
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
          label={t('associations.form.newImage')}
          control={control}
          name="image"
          error={errors.image}
          accept="image/jpeg,image/png,image/gif,image/webp"
        />
      </div>

      <div className="mt-6">
        <EnglishSection>
          <EnglishInput id="nameEn" name="nameEn" control={control} label={t('associations.form.name')} error={errors.nameEn} />
          <EnglishInput id="descriptionEn" name="descriptionEn" control={control} label={t('associations.form.description')} error={errors.descriptionEn} rows={6} />
        </EnglishSection>
      </div>

      <div className="mt-8">
        <EditAssociationButton isSubmitting={isPending} />
      </div>
    </form>
  );
}
