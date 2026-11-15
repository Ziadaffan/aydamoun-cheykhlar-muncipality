'use client';

import { useTranslation } from 'react-i18next';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import ControlledSelect from '@/packages/common/components/form/ControlledSelect';
import ControlledInputText from '@/packages/common/components/form/ControlledInputText';
import ControlledTextArea from '@/packages/common/components/form/ControlledTextArea';
import { toDateOnly } from '@/packages/services/utils/form.utils';
import { serviceFieldLabel, serviceFieldOptionLabel, type ServiceField } from '@/packages/services/utils/serviceFields';
import { siteLanguage } from '@/lib/localized';

type AdditionalFieldsSectionProps = {
  additionalFields: ServiceField[];
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
          <div key={field.key} className={field.kind === 'textarea' ? 'md:col-span-2' : undefined}>
            <AdditionalFieldRenderer field={field} control={control} errors={errors} />
          </div>
        ))}
      </div>
    </div>
  );
}

type AdditionalFieldRendererProps = {
  field: ServiceField;
  control: Control<any>;
  errors: FieldErrors<any> & {
    additionalInfo?: Record<string, any>;
  };
};

function AdditionalFieldRenderer({ field, control, errors }: AdditionalFieldRendererProps) {
  const { t, i18n } = useTranslation();
  // English labels for English visitors; the value sent is always the Arabic option.
  const english = siteLanguage(i18n.language) === 'en';
  const label = serviceFieldLabel(field, english);
  const id = `additionalInfo-${field.key}`;
  const name = `additionalInfo.${field.key}`;
  const error = errors.additionalInfo?.[field.key] as any;

  switch (field.kind) {
    case 'select':
      return (
        <ControlledSelect
          id={id}
          name={name}
          control={control}
          label={label}
          options={field.options?.map((option, index) => ({ value: option, label: serviceFieldOptionLabel(field, index, english) })) || []}
          placeholder={t('services.form.buttons.choose')}
          required={field.required}
          error={error}
        />
      );

    case 'textarea':
      return <ControlledTextArea id={id} name={name} control={control} label={label} required={field.required} error={error} rows={4} />;

    case 'date':
      return (
        <div className="mb-5">
          <label className="mb-1 block text-start text-sm font-medium text-gray-700 md:text-base" htmlFor={id}>
            {label}
            {field.required && <span className="me-1 text-red-500">*</span>}
          </label>
          <Controller
            name={name}
            control={control}
            render={({ field: input }) => (
              <input
                id={id}
                type="date"
                name={input.name}
                ref={input.ref}
                onBlur={input.onBlur}
                onChange={input.onChange}
                // Older requests hold a full timestamp, which a date input can't show.
                value={typeof input.value === 'string' ? toDateOnly(input.value) : ''}
                className={`w-full rounded-lg border px-3 py-2 text-start text-sm transition focus:ring-2 focus:ring-blue-200 md:text-base ${
                  error ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
              />
            )}
          />
          {error?.message && <span className="mt-1 block text-sm text-red-500">{error.message}</span>}
        </div>
      );

    case 'number':
      return <ControlledInputText id={id} name={name} control={control} label={label} type="number" required={field.required} error={error} />;

    default:
      return <ControlledInputText id={id} name={name} control={control} label={label} type="text" required={field.required} error={error} />;
  }
}
