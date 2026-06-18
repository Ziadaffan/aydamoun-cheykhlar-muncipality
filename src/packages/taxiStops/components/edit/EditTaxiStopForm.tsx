'use client';

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

export default function EditTaxiStopForm() {
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
          setMessage({ type: 'success', text: 'تم تحديث موقف التاكسي بنجاح' });
          setTimeout(() => {
            router.push('/taxi-stops');
          }, 1000);
        },
        onError: () => {
          setMessage({ type: 'error', text: 'فشل في تحديث موقف التاكسي' });
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
        <EditTaxiStopButton isSubmitting={isPending} />
      </div>
    </form>
  );
}
