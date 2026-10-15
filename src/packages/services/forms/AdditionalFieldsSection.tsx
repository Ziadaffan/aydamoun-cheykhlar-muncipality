'use client';

import { useTranslation } from 'react-i18next';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import ControlledSelect from '@/packages/common/components/form/ControlledSelect';
import ControlledRadio from '@/packages/common/components/form/ControlledRadio';
import ControlledInputText from '@/packages/common/components/form/ControlledInputText';
import { toDateOnly } from '@/packages/services/utils/form.utils';

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

  if (field.type === 'date') {
    const error = errors.additionalInfo?.[field.name] as { message?: string } | undefined;
    return (
      <div className="mb-5">
        <label className="mb-1 block text-right text-sm font-medium text-gray-700 md:text-base" htmlFor={field.name}>
          {field.label}
          {field.required && <span className="me-1 text-red-500">*</span>}
        </label>
        <Controller
          name={`additionalInfo.${field.name}`}
          control={control}
          render={({ field: input }) => (
            <input
              id={field.name}
              type="date"
              name={input.name}
              ref={input.ref}
              onBlur={input.onBlur}
              onChange={input.onChange}
              // Older requests hold a full timestamp, which a date input can't show.
              value={typeof input.value === 'string' ? toDateOnly(input.value) : ''}
              className={`w-full rounded-lg border px-3 py-2 text-right text-sm transition focus:ring-2 focus:ring-blue-200 md:text-base ${
                error ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
            />
          )}
        />
        {error?.message && <span className="mt-1 block text-sm text-red-500">{error.message}</span>}
      </div>
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
