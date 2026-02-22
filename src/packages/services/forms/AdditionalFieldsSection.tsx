'use client';

import { useTranslation } from 'react-i18next';
import { Control, FieldErrors } from 'react-hook-form';
import ControlledSelect from '@/packages/common/components/form/ControlledSelect';
import ControlledRadio from '@/packages/common/components/form/ControlledRadio';
import ControlledInputText from '@/packages/common/components/form/ControlledInputText';

type AdditionalField = {
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
};

type AdditionalFieldsSectionProps = {
  additionalFields: AdditionalField[];
  control: Control<any>;
  errors: FieldErrors<any> & {
    additionalInfo?: Record<string, any>;
  };
};

export default function AdditionalFieldsSection({ additionalFields, control, errors }: AdditionalFieldsSectionProps) {
  const { t } = useTranslation();

  if (additionalFields.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3 className="mb-6 border-b pb-2 text-xl font-bold text-gray-800">{t('services.form.additionalInfo')}</h3>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {additionalFields.map(field => (
          <AdditionalFieldRenderer key={field.name} field={field} control={control} errors={errors} />
        ))}
      </div>
    </div>
  );
}

type AdditionalFieldRendererProps = {
  field: AdditionalField;
  control: Control<any>;
  errors: FieldErrors<any> & {
    additionalInfo?: Record<string, any>;
  };
};

function AdditionalFieldRenderer({ field, control, errors }: AdditionalFieldRendererProps) {
  const { t } = useTranslation();

  if (field.type === 'select') {
    return (
      <ControlledSelect
        id={field.name}
        name={`additionalInfo.${field.name}`}
        control={control}
        label={field.label}
        options={field.options?.map(option => ({ value: option, label: option })) || []}
        placeholder={t('services.form.buttons.choose')}
        required={field.required}
        error={errors.additionalInfo?.[field.name] as any}
      />
    );
  }

  if (field.type === 'radio') {
    return (
      <ControlledRadio
        name={`additionalInfo.${field.name}`}
        control={control}
        label={field.label}
        options={field.options || []}
        required={field.required}
        error={errors.additionalInfo?.[field.name] as any}
        rules={{ required: field.required ? `${field.label} مطلوب` : false }}
      />
    );
  }

  return (
    <ControlledInputText
      id={field.name}
      name={`additionalInfo.${field.name}`}
      control={control}
      label={field.label}
      type={field.type as any}
      required={field.required}
      error={errors.additionalInfo?.[field.name] as any}
    />
  );
}
