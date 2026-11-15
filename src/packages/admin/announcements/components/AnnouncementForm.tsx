'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import ControlledInputText from '@/packages/common/components/form/ControlledInputText';
import ControlledTextArea from '@/packages/common/components/form/ControlledTextArea';
import ControlledSelect from '@/packages/common/components/form/ControlledSelect';
import ControlledCheckbox from '@/packages/common/components/form/ControlledCheckbox';
import InfoMessage from '@/packages/common/components/form/InfoMessage';
import Button from '@/packages/common/components/Button';
import { validationMessages } from '@/packages/common/validation/common.validation';
import type { AnnouncementDto } from '@/packages/announcements/types';
import AdminImageField from '../../common/AdminImageField';
import { EnglishInput, EnglishSection } from '../../common/EnglishFields';
import { imageFormBody } from '../../common/adminApi';
import { fromDateTimeLocal, toDateTimeLocal } from '../../common/dates';
import { adminErrorKey, optionalImageSchema } from '../../common/imageValidation';
import { announcementsResource } from '../announcementsResource';

const schema = yup.object({
  title: yup.string().trim().max(200, validationMessages.maxLength('العنوان', 200)).required(validationMessages.required('العنوان')),
  body: yup.string().trim().max(10000, validationMessages.maxLength('النص', 10000)).required(validationMessages.required('النص')),
  titleEn: yup.string().trim().max(200, validationMessages.maxLength('العنوان بالإنجليزية', 200)).default(''),
  bodyEn: yup.string().trim().max(10000, validationMessages.maxLength('النص بالإنجليزية', 10000)).default(''),
  priority: yup.mixed<'NORMAL' | 'IMPORTANT' | 'URGENT'>().oneOf(['NORMAL', 'IMPORTANT', 'URGENT']).required(),
  pinned: yup.boolean().default(false),
  expiresAt: yup.string().default(''),
  image: optionalImageSchema(),
  removeImage: yup.boolean().default(false),
});

type FormValues = yup.InferType<typeof schema>;

type AnnouncementFormProps = {
  /** Edit mode when given. */
  announcement?: AnnouncementDto;
};

export default function AnnouncementForm({ announcement }: AnnouncementFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const create = announcementsResource.useCreate();
  const update = announcementsResource.useUpdate(announcement?.id ?? '');
  const mutation = announcement ? update : create;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      title: announcement?.title ?? '',
      body: announcement?.body ?? '',
      titleEn: announcement?.titleEn ?? '',
      bodyEn: announcement?.bodyEn ?? '',
      priority: announcement?.priority ?? 'NORMAL',
      pinned: announcement?.pinned ?? false,
      expiresAt: toDateTimeLocal(announcement?.expiresAt),
      image: null,
      removeImage: false,
    },
  });

  const onSubmit = (values: FormValues) => {
    setMessage(null);
    const init = imageFormBody(
      announcement ? 'PUT' : 'POST',
      {
        title: values.title,
        body: values.body,
        titleEn: values.titleEn,
        bodyEn: values.bodyEn,
        priority: values.priority,
        pinned: values.pinned,
        expiresAt: fromDateTimeLocal(values.expiresAt),
      },
      values.image,
      values.removeImage
    );
    mutation.mutate(init, {
      onSuccess: () => {
        setMessage({ type: 'success', text: t('admin.common.messages.saved') });
        setTimeout(() => router.push('/admin/announcements'), 800);
      },
      onError: error => setMessage({ type: 'error', text: t(adminErrorKey(error)) }),
    });
  };

  const priorityOptions = (['NORMAL', 'IMPORTANT', 'URGENT'] as const).map(value => ({
    value,
    label: t(`admin.announcements.priority.${value}`),
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl bg-white p-6 shadow-xl md:p-8" noValidate>
      <InfoMessage message={message} onClose={() => setMessage(null)} />

      <ControlledInputText id="title" name="title" control={control} label={t('admin.announcements.fields.title')} error={errors.title} required />
      <ControlledTextArea
        id="body"
        name="body"
        control={control}
        label={t('admin.announcements.fields.body')}
        error={errors.body}
        rows={8}
        required
      />

      <EnglishSection>
        <EnglishInput id="titleEn" name="titleEn" control={control} label={t('admin.announcements.fields.title')} error={errors.titleEn} />
        <EnglishInput id="bodyEn" name="bodyEn" control={control} label={t('admin.announcements.fields.body')} error={errors.bodyEn} rows={8} />
      </EnglishSection>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ControlledSelect
          id="priority"
          name="priority"
          control={control}
          label={t('admin.announcements.fields.priority')}
          options={priorityOptions}
          error={errors.priority}
        />
        <ControlledInputText
          id="expiresAt"
          name="expiresAt"
          type="datetime-local"
          control={control}
          label={t('admin.announcements.fields.expiresAt')}
          error={errors.expiresAt}
        />
      </div>
      <p className="-mt-3 mb-5 text-sm text-gray-500">{t('admin.announcements.fields.expiresAtHint')}</p>

      <ControlledCheckbox id="pinned" name="pinned" control={control} label={t('admin.announcements.fields.pinned')} />

      <AdminImageField
        control={control}
        label={t('admin.announcements.fields.image')}
        currentImage={announcement?.imageUrl}
        error={errors.image as any}
      />

      {!announcement && <p className="mb-5 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">{t('admin.announcements.pushHint')}</p>}

      <Button type="submit" variant="primary" size="lg" loading={mutation.isPending} className="w-full sm:w-auto">
        {announcement ? t('admin.common.save') : t('admin.announcements.create')}
      </Button>
    </form>
  );
}
