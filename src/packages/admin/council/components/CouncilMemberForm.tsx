'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import type { Position } from '@prisma/client';
import ControlledInputText from '@/packages/common/components/form/ControlledInputText';
import ControlledSelect from '@/packages/common/components/form/ControlledSelect';
import InfoMessage from '@/packages/common/components/form/InfoMessage';
import Button from '@/packages/common/components/Button';
import { validationMessages } from '@/packages/common/validation/common.validation';
import { isValidPhone, normalizePhone } from '@/packages/common/utils/phone.utils';
import AdminImageField from '../../common/AdminImageField';
import { EnglishInput, EnglishSection } from '../../common/EnglishFields';
import { imageFormBody } from '../../common/adminApi';
import { adminErrorKey, optionalImageSchema } from '../../common/imageValidation';
import { councilResource, CouncilMemberDto } from '../councilResource';

const POSITIONS: Position[] = ['PRESIDENT', 'VICE_PRESIDENT', 'COUNCIL_MEMBER'];

const schema = yup.object({
  name: yup.string().trim().max(150, validationMessages.maxLength('الاسم', 150)).required(validationMessages.required('الاسم')),
  position: yup.mixed<Position>().oneOf(POSITIONS).required(validationMessages.required('المنصب')),
  role: yup.string().trim().max(200, validationMessages.maxLength('المهمة', 200)).default(''),
  major: yup.string().trim().max(200, validationMessages.maxLength('الاختصاص', 200)).default(''),
  nameEn: yup.string().trim().max(150, validationMessages.maxLength('الاسم بالإنجليزية', 150)).default(''),
  roleEn: yup.string().trim().max(200, validationMessages.maxLength('المهمة بالإنجليزية', 200)).default(''),
  majorEn: yup.string().trim().max(200, validationMessages.maxLength('الاختصاص بالإنجليزية', 200)).default(''),
  phone: yup
    .string()
    .trim()
    .default('')
    .test('phone', validationMessages.invalidPhone, value => !value || isValidPhone(normalizePhone(value))),
  email: yup.string().trim().email(validationMessages.email).default(''),
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

export default function CouncilMemberForm({ member }: { member?: CouncilMemberDto }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const create = councilResource.useCreate();
  const update = councilResource.useUpdate(member?.id ?? '');
  const mutation = member ? update : create;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      name: member?.name ?? '',
      position: member?.position ?? 'COUNCIL_MEMBER',
      role: member?.role ?? '',
      major: member?.major ?? '',
      nameEn: member?.nameEn ?? '',
      roleEn: member?.roleEn ?? '',
      majorEn: member?.majorEn ?? '',
      phone: member?.phone ?? '',
      email: member?.email ?? '',
      order: member?.order ?? 0,
      image: null,
      removeImage: false,
    },
  });

  const onSubmit = (values: FormValues) => {
    setMessage(null);
    const init = imageFormBody(
      member ? 'PUT' : 'POST',
      {
        name: values.name,
        position: values.position,
        role: values.role,
        major: values.major,
        nameEn: values.nameEn,
        roleEn: values.roleEn,
        majorEn: values.majorEn,
        phone: values.phone,
        email: values.email,
        order: values.order,
      },
      values.image,
      values.removeImage
    );
    mutation.mutate(init, {
      onSuccess: () => {
        setMessage({ type: 'success', text: t('admin.common.messages.saved') });
        setTimeout(() => router.push('/admin/council'), 800);
      },
      onError: error =>
        setMessage({
          type: 'error',
          text: t(adminErrorKey(error, { INVALID_PHONE: 'auth.signup.messages.invalidPhone' })),
        }),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl bg-white p-6 shadow-xl md:p-8" noValidate>
      <InfoMessage message={message} onClose={() => setMessage(null)} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ControlledInputText id="name" name="name" control={control} label={t('admin.council.fields.name')} error={errors.name} required />
        <ControlledSelect
          id="position"
          name="position"
          control={control}
          label={t('admin.council.fields.position')}
          options={POSITIONS.map(position => ({ value: position, label: t(`aboutUs.positions.${position}`) }))}
          error={errors.position}
          required
        />
        <ControlledInputText
          id="role"
          name="role"
          control={control}
          label={t('admin.council.fields.role')}
          placeholder={t('admin.council.fields.rolePlaceholder')}
          error={errors.role}
        />
        <ControlledInputText
          id="major"
          name="major"
          control={control}
          label={t('admin.council.fields.major')}
          placeholder={t('admin.council.fields.majorPlaceholder')}
          error={errors.major}
        />
        <ControlledInputText id="phone" name="phone" type="tel" control={control} label={t('admin.council.fields.phone')} error={errors.phone} />
        <ControlledInputText id="email" name="email" type="email" control={control} label={t('admin.council.fields.email')} error={errors.email} />
        <ControlledInputText id="order" name="order" type="number" control={control} label={t('admin.common.order')} error={errors.order} />
      </div>
      <p className="-mt-3 mb-5 text-sm text-gray-500">{t('admin.council.fields.orderHint')}</p>

      <EnglishSection>
        <EnglishInput id="nameEn" name="nameEn" control={control} label={t('admin.council.fields.name')} error={errors.nameEn} />
        <EnglishInput id="roleEn" name="roleEn" control={control} label={t('admin.council.fields.role')} error={errors.roleEn} />
        <EnglishInput id="majorEn" name="majorEn" control={control} label={t('admin.council.fields.major')} error={errors.majorEn} />
      </EnglishSection>

      <AdminImageField control={control} label={t('admin.council.fields.image')} currentImage={member?.image} error={errors.image as any} />

      <Button type="submit" variant="primary" size="lg" loading={mutation.isPending} className="w-full sm:w-auto">
        {member ? t('admin.common.save') : t('admin.council.create')}
      </Button>
    </form>
  );
}
