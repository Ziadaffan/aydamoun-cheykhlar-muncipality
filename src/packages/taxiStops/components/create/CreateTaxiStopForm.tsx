'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ControlledInputText from '@/packages/common/components/form/ControlledInputText';
import FormMessage from '@/packages/common/components/form/InfoMessage';
import { createTaxiStopSchema, CreateTaxiStopFormData } from '@/packages/taxiStops/validation/taxiStops.validation';
import { useCreateTaxiStop } from '@/packages/taxiStops/hooks/useCreateTaxiStop';
import CreateTaxiStopButton from './CreateTaxiStopButton';

export default function CreateTaxiStopForm() {
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
        setMessage({ type: 'success', text: 'تم إنشاء موقف التاكسي بنجاح' });
        setTimeout(() => {
          router.push('/taxi-stops');
        }, 1000);
      },
      onError: () => {
        setMessage({ type: 'error', text: 'فشل في إنشاء موقف التاكسي' });
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
          label="الاسم"
          type="text"
          control={control}
          name="name"
          error={errors.name}
          placeholder="أدخل اسم موقف التاكسي"
          required
        />

        <ControlledInputText
          id="fromLocation"
          label="من"
          type="text"
          control={control}
          name="fromLocation"
          error={errors.fromLocation}
          placeholder="نقطة الانطلاق"
          required
        />

        <ControlledInputText
          id="toLocation"
          label="إلى"
          type="text"
          control={control}
          name="toLocation"
          error={errors.toLocation}
          placeholder="الوجهة"
          required
        />

        <ControlledInputText
          id="hour"
          label="الساعة"
          type="text"
          control={control}
          name="hour"
          error={errors.hour}
          placeholder="مثال: 08:30 صباحا"
          required
        />

        <ControlledInputText
          id="phone"
          label="رقم الهاتف"
          type="tel"
          control={control}
          name="phone"
          error={errors.phone}
          placeholder="أدخل رقم الهاتف"
          required
        />
      </div>

      <div className="mt-8">
        <CreateTaxiStopButton isSubmitting={isPending} />
      </div>
    </form>
  );
}
