'use client';

import { useTranslation } from 'react-i18next';
import { Control, FieldError, FieldErrors } from 'react-hook-form';
import ControlledTextArea from '@/packages/common/components/form/ControlledTextArea';

type RequestDetailsSectionProps = {
  control: Control<any>;
  errors: FieldErrors<any> & {
    description?: FieldError;
  };
};

export default function RequestDetailsSection({ control, errors }: RequestDetailsSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <h3 className="mb-6 border-b pb-2 text-xl font-bold text-gray-800">{t('services.form.requestDetails')}</h3>

      <ControlledTextArea
        id="description"
        name="description"
        control={control}
        label={t('services.form.fields.description')}
        placeholder={t('services.form.fields.descriptionPlaceholder')}
        required
        error={errors.description}
        rows={4}
      />
    </div>
  );
}
