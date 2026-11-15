'use client';

import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ControlledInputText from '@/packages/common/components/form/ControlledInputText';
import FormMessage from '@/packages/common/components/form/InfoMessage';
import { createTaxiStopSchema, CreateTaxiStopFormData } from '@/packages/taxiStops/validation/taxiStops.validation';
import { useCreateTaxiStop } from '@/packages/taxiStops/hooks/useCreateTaxiStop';
import CreateTaxiStopButton from './CreateTaxiStopButton';
import { EnglishInput, EnglishSection } from '@/packages/admin/common/EnglishFields';

export default function CreateTaxiStopForm() {
  const { t } = useTranslation();
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTaxiStopFormData>({
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
    resolver: yupResolver(createTaxiStopSchema),
  });

  const { mutate: createTaxiStop } = useCreateTaxiStop();

  const onSubmit = (data: CreateTaxiStopFormData) => {
    setIsPending(true);
    setMessage(null);

    createTaxiStop(data, {
      onSuccess: () => {
        setMessage({ type: 'success', text: t('taxiStops.form.messages.createSuccess') });
        setTimeout(() => {
          router.push('/taxi-stops');
        }, 1000);
      },
      onError: () => {
        setMessage({ type: 'error', text: t('taxiStops.form.messages.createError') });
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
        <CreateTaxiStopButton isSubmitting={isPending} />
      </div>
    </form>
  );
}
