'use client';

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ControlledInputText from '@/packages/common/components/form/ControlledInputText';
import FormMessage from '@/packages/common/components/form/InfoMessage';
import Spinner from '@/packages/common/components/Spinner';
import ErrorMessage from '@/packages/common/components/ErrorMessage';
import { updateTaxiStopSchema, UpdateTaxiStopFormData } from '@/packages/taxiStops/validation/taxiStops.validation';
import useGetTaxiStopById from '@/packages/taxiStops/hooks/useGetTaxiStopById';
import { useUpdateTaxiStop } from '@/packages/taxiStops/hooks/useUpdateTaxiStop';
import EditTaxiStopButton from './EditTaxiStopButton';
import { EnglishInput, EnglishSection } from '@/packages/admin/common/EnglishFields';

export default function EditTaxiStopForm() {
  const { t } = useTranslation();
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();
  const params = useParams();
  const taxiStopId = params?.id as string;

  const { data, isLoading, error } = useGetTaxiStopById(taxiStopId);
  const { mutate: updateTaxiStop } = useUpdateTaxiStop();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateTaxiStopFormData>({
    defaultValues: {
      name: '',
      nameEn: '',
      fromLocationEn: '',
      toLocationEn: '',
      fromLocation: '',
      toLocation: '',
      hour: '',
      phone: '',
    },
    resolver: yupResolver(updateTaxiStopSchema),
  });

  useEffect(() => {
    if (data) {
      reset({
        name: data.name || '',
        nameEn: data.nameEn ?? '',
        fromLocationEn: data.fromLocationEn ?? '',
        toLocationEn: data.toLocationEn ?? '',
        fromLocation: data.fromLocation || '',
        toLocation: data.toLocation || '',
        hour: data.hour || '',
        phone: data.phone || '',
      });
    }
  }, [data, reset]);

  const onSubmit = (formData: UpdateTaxiStopFormData) => {
    setIsPending(true);
    setMessage(null);

    updateTaxiStop(
      {
        id: taxiStopId,
        ...formData,
      },
      {
        onSuccess: () => {
          setMessage({ type: 'success', text: t('taxiStops.form.messages.updateSuccess') });
          setTimeout(() => {
            router.push('/taxi-stops');
          }, 1000);
        },
        onError: () => {
          setMessage({ type: 'error', text: t('taxiStops.form.messages.updateError') });
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
          label={t('taxiStops.form.name')}
          type="text"
          control={control}
          name="name"
          error={errors.name}
          placeholder={t('taxiStops.form.namePlaceholder')}
          required
        />

        <ControlledInputText
          id="fromLocation"
          label={t('taxiStops.form.fromLocation')}
          type="text"
          control={control}
          name="fromLocation"
          error={errors.fromLocation}
          placeholder={t('taxiStops.form.fromLocationPlaceholder')}
          required
        />

        <ControlledInputText
          id="toLocation"
          label={t('taxiStops.form.toLocation')}
          type="text"
          control={control}
          name="toLocation"
          error={errors.toLocation}
          placeholder={t('taxiStops.form.toLocationPlaceholder')}
          required
        />

        <ControlledInputText
          id="hour"
          label={t('taxiStops.form.hour')}
          type="text"
          control={control}
          name="hour"
          error={errors.hour}
          placeholder={t('taxiStops.form.hourPlaceholder')}
          required
        />

        <ControlledInputText
          id="phone"
          label={t('taxiStops.form.phone')}
          type="tel"
          control={control}
          name="phone"
          error={errors.phone}
          placeholder={t('taxiStops.form.phonePlaceholder')}
          required
        />
      </div>

      <div className="mt-6">
        <EnglishSection>
          <EnglishInput id="nameEn" name="nameEn" control={control} label={t('taxiStops.form.name')} error={errors.nameEn} />
          <EnglishInput id="fromLocationEn" name="fromLocationEn" control={control} label={t('taxiStops.form.fromLocation')} error={errors.fromLocationEn} />
          <EnglishInput id="toLocationEn" name="toLocationEn" control={control} label={t('taxiStops.form.toLocation')} error={errors.toLocationEn} />
        </EnglishSection>
      </div>

      <div className="mt-8">
        <EditTaxiStopButton isSubmitting={isPending} />
      </div>
    </form>
  );
}
