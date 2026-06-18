'use client';

import { useTranslation } from 'react-i18next';
import { Control, FieldErrors } from 'react-hook-form';
import ControlledInputText from '@/packages/common/components/form/ControlledInputText';

type PersonalInfoSectionProps = {
  control: Control<any>;
  errors: FieldErrors<any>;
};

export default function PersonalInfoSection({ control, errors }: PersonalInfoSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <h3 className="mb-6 border-b pb-2 text-xl font-bold text-gray-800">{t('services.form.personalInfo')}</h3>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ControlledInputText
          id="fullName"
          label={t('services.form.fields.fullName')}
          type="text"
          control={control}
          name="fullName"
          error={errors.fullName}
          required
        />

        <ControlledInputText
          id="phone"
          label={t('services.form.fields.phone')}
          type="tel"
          control={control}
          name="phone"
          error={errors.phone}
          required
        />

        <ControlledInputText
          id="email"
          label={t('services.form.fields.email')}
          type="email"
          control={control}
          name="email"
          error={errors.email}
          required
        />

        <ControlledInputText
          id="address"
          label={t('services.form.fields.address')}
          type="text"
          control={control}
          name="address"
          error={errors.address}
          required
        />
      </div>
    </div>
  );
}
