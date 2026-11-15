'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import ControlledInputText from '@/packages/common/components/form/ControlledInputText';
import ControlledTextArea from '@/packages/common/components/form/ControlledTextArea';
import InfoMessage from '@/packages/common/components/form/InfoMessage';
import Button from '@/packages/common/components/Button';
import { validationMessages } from '@/packages/common/validation/common.validation';
import type { HistoryEntryDto } from '@/packages/history/types';
import AdminImageField from '../../common/AdminImageField';
import { EnglishInput, EnglishSection } from '../../common/EnglishFields';
import { imageFormBody } from '../../common/adminApi';
import { adminErrorKey, optionalImageSchema } from '../../common/imageValidation';
import { historyResource } from '../historyResource';

const schema = yup.object({
  period: yup.string().trim().max(100, validationMessages.maxLength('الفترة', 100)).required(validationMessages.required('الفترة')),
  title: yup.string().trim().max(200, validationMessages.maxLength('العنوان', 200)).required(validationMessages.required('العنوان')),
  description: yup.string().trim().max(10000, validationMessages.maxLength('الوصف', 10000)).required(validationMessages.required('الوصف')),
  periodEn: yup.string().trim().max(100, validationMessages.maxLength('الفترة بالإنجليزية', 100)).default(''),
  titleEn: yup.string().trim().max(200, validationMessages.maxLength('العنوان بالإنجليزية', 200)).default(''),
  descriptionEn: yup.string().trim().max(10000, validationMessages.maxLength('الوصف بالإنجليزية', 10000)).default(''),
  order: yup
    .number()
    .transform((value: unknown, original: unknown) => (original === '' ? 0 : value))
    .typeError(validationMessages.orderNumber)
    .integer(validationMessages.orderInteger)
    .default(0),
  image: optionalImageSchema(),
  removeImage: yup.boolean().default(false),
});

type FormValues = yup.InferType<typeof schema>;

export default function HistoryEntryForm({ entry, nextOrder = 0 }: { entry?: HistoryEntryDto; nextOrder?: number }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const create = historyResource.useCreate();
  const update = historyResource.useUpdate(entry?.id ?? '');
  const mutation = entry ? update : create;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      period: entry?.period ?? '',
      title: entry?.title ?? '',
      description: entry?.description ?? '',
      periodEn: entry?.periodEn ?? '',
      titleEn: entry?.titleEn ?? '',
      descriptionEn: entry?.descriptionEn ?? '',
      order: entry?.order ?? nextOrder,
      image: null,
      removeImage: false,
    },
  });

  const onSubmit = (values: FormValues) => {
    setMessage(null);
    const init = imageFormBody(
      entry ? 'PUT' : 'POST',
      {
        period: values.period,
        title: values.title,
        description: values.description,
        periodEn: values.periodEn,
        titleEn: values.titleEn,
        descriptionEn: values.descriptionEn,
        order: values.order,
      },
      values.image,
      values.removeImage
    );
    mutation.mutate(init, {
      onSuccess: () => {
        setMessage({ type: 'success', text: t('admin.common.messages.saved') });
        setTimeout(() => router.push('/admin/history'), 800);
      },
      onError: error => setMessage({ type: 'error', text: t(adminErrorKey(error)) }),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl bg-white p-6 shadow-xl md:p-8" noValidate>
      <InfoMessage message={message} onClose={() => setMessage(null)} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ControlledInputText
          id="period"
          name="period"
          control={control}
          label={t('admin.history.fields.period')}
          placeholder={t('admin.history.fields.periodPlaceholder')}
          error={errors.period}
          required
        />
        <ControlledInputText id="order" name="order" type="number" control={control} label={t('admin.common.order')} error={errors.order} />
      </div>
      <p className="-mt-3 mb-5 text-sm text-gray-500">{t('admin.history.fields.orderHint')}</p>

      <ControlledInputText id="title" name="title" control={control} label={t('admin.history.fields.title')} error={errors.title} required />
      <ControlledTextArea
        id="description"
        name="description"
        control={control}
        label={t('admin.history.fields.description')}
        error={errors.description}
        rows={8}
        required
      />

      <EnglishSection>
        <EnglishInput id="periodEn" name="periodEn" control={control} label={t('admin.history.fields.period')} error={errors.periodEn} />
        <EnglishInput id="titleEn" name="titleEn" control={control} label={t('admin.history.fields.title')} error={errors.titleEn} />
        <EnglishInput
          id="descriptionEn"
          name="descriptionEn"
          control={control}
          label={t('admin.history.fields.description')}
          error={errors.descriptionEn}
          rows={8}
        />
      </EnglishSection>

      <AdminImageField control={control} label={t('admin.history.fields.image')} currentImage={entry?.imageUrl} error={errors.image as any} />

      <Button type="submit" variant="primary" size="lg" loading={mutation.isPending} className="w-full sm:w-auto">
        {entry ? t('admin.common.save') : t('admin.history.create')}
      </Button>
    </form>
  );
}
