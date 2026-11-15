'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import type { ServiceType } from '@prisma/client';
import ControlledInputText from '@/packages/common/components/form/ControlledInputText';
import ControlledTextArea from '@/packages/common/components/form/ControlledTextArea';
import ControlledSelect from '@/packages/common/components/form/ControlledSelect';
import ControlledCheckbox from '@/packages/common/components/form/ControlledCheckbox';
import InfoMessage from '@/packages/common/components/form/InfoMessage';
import Button from '@/packages/common/components/Button';
import { localizedMessage, validationMessages } from '@/packages/common/validation/common.validation';
import {
  getDefaultServiceFields,
  SERVICE_FIELD_KEY_PATTERN,
  SERVICE_FIELD_KINDS,
  ServiceField,
  ServiceFieldKind,
} from '@/packages/services/utils/serviceFields';
import { jsonBody } from '../../common/adminApi';
import { EnglishInput, EnglishSection } from '../../common/EnglishFields';
import { adminErrorKey } from '../../common/imageValidation';
import { servicesResource, ServiceDto } from '../servicesResource';
import { SERVICE_TYPES, serviceTypeKey } from '../serviceTypes';

// One row of the field builder; select options are edited one per line.
type FieldRow = {
  key: string;
  label: string;
  labelEn: string;
  kind: ServiceFieldKind;
  required: boolean;
  optionsText: string;
  /** English labels of the options, one per line in the same order (optional). */
  optionsEnText: string;
};

const fieldRowSchema = yup.object({
  key: yup
    .string()
    .trim()
    .required(validationMessages.required('المفتاح'))
    .max(64, validationMessages.maxLength('المفتاح', 64))
    .matches(SERVICE_FIELD_KEY_PATTERN, localizedMessage('المفتاح: أحرف إنجليزية وأرقام و _ فقط، ويبدأ بحرف', 'Key: English letters, digits and _ only, starting with a letter')),
  label: yup.string().trim().required(validationMessages.required('التسمية')).max(200, validationMessages.maxLength('التسمية', 200)),
  labelEn: yup.string().trim().max(200, validationMessages.maxLength('التسمية بالإنجليزية', 200)).default(''),
  kind: yup
    .mixed<ServiceFieldKind>()
    .oneOf([...SERVICE_FIELD_KINDS])
    .required(),
  required: yup.boolean().default(false),
  optionsText: yup
    .string()
    .default('')
    .test('options', localizedMessage('أضف خياراً واحداً على الأقل (كل خيار في سطر)', 'Add at least one option (one per line)'), function (value) {
      return this.parent.kind !== 'select' || splitOptions(value).length > 0;
    }),
  optionsEnText: yup
    .string()
    .default('')
    .test('options-en', localizedMessage('أدخل ترجمة واحدة لكل خيار وبالترتيب نفسه، أو اترك الحقل فارغاً', 'Enter one translation per option, in the same order, or leave this empty'), function (value) {
      if (this.parent.kind !== 'select') return true;
      const english = lines(value);
      return english.length === 0 || english.length === lines(this.parent.optionsText).length;
    })
    .test('options-en-length', validationMessages.maxLength('الخيار بالإنجليزية', 200), value => lines(value).every(line => line.length <= 200)),
});

const schema = yup.object({
  name: yup.string().trim().max(200, validationMessages.maxLength('اسم الخدمة', 200)).required(validationMessages.required('اسم الخدمة')),
  description: yup.string().trim().max(2000, validationMessages.maxLength('الوصف', 2000)).required(validationMessages.required('الوصف')),
  nameEn: yup.string().trim().max(200, validationMessages.maxLength('اسم الخدمة بالإنجليزية', 200)).default(''),
  descriptionEn: yup.string().trim().max(2000, validationMessages.maxLength('الوصف بالإنجليزية', 2000)).default(''),
  type: yup.mixed<ServiceType>().oneOf(SERVICE_TYPES).required(validationMessages.required('الفئة')),
  active: yup.boolean().default(true),
  order: yup
    .number()
    .transform((value: unknown, original: unknown) => (original === '' ? 0 : value))
    .typeError(validationMessages.orderNumber)
    .integer(validationMessages.orderInteger)
    .default(0),
  useDefaults: yup.boolean().default(true),
  fields: yup
    .array()
    .of(fieldRowSchema)
    .max(30, localizedMessage('الحد الأقصى 30 حقلاً', 'At most 30 fields'))
    .default([])
    .test('unique-keys', localizedMessage('لكل حقل مفتاح مختلف', 'Each field needs a different key'), fields => {
      const keys = (fields ?? []).map(field => field?.key?.trim());
      return new Set(keys).size === keys.length;
    }),
});

type FormValues = yup.InferType<typeof schema>;

/** The non-empty lines of a textarea, trimmed. */
function lines(text: string | undefined): string[] {
  return (text ?? '')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);
}

function splitOptions(text: string | undefined): string[] {
  return Array.from(new Set(lines(text)));
}

/**
 * A select's options and their English labels, paired line by line; repeated options
 * are dropped with their label. English labels are left out when none was given.
 */
function pairOptions(optionsText: string, optionsEnText: string): Pick<ServiceField, 'options' | 'optionsEn'> {
  const arabic = lines(optionsText);
  const english = lines(optionsEnText);
  const options: string[] = [];
  const optionsEn: string[] = [];
  arabic.forEach((option, index) => {
    if (options.includes(option)) return;
    options.push(option);
    optionsEn.push(english[index] ?? '');
  });
  return { options, optionsEn: optionsEn.some(Boolean) ? optionsEn : null };
}

const toRow = (field: ServiceField): FieldRow => ({
  key: field.key,
  label: field.label,
  labelEn: field.labelEn ?? '',
  kind: field.kind,
  required: field.required,
  optionsText: (field.options ?? []).join('\n'),
  optionsEnText: field.optionsEn?.some(Boolean) ? field.optionsEn.join('\n') : '',
});

const toField = (row: FieldRow): ServiceField => ({
  key: row.key.trim(),
  label: row.label.trim(),
  labelEn: row.labelEn.trim() || null,
  kind: row.kind,
  required: row.required,
  ...(row.kind === 'select' && pairOptions(row.optionsText, row.optionsEnText)),
});

const EMPTY_ROW: FieldRow = { key: '', label: '', labelEn: '', kind: 'text', required: false, optionsText: '', optionsEnText: '' };

export default function ServiceAdminForm({ service }: { service?: ServiceDto }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const create = servicesResource.useCreate();
  const update = servicesResource.useUpdate(service?.id ?? '');
  const mutation = service ? update : create;

  const {
    control,
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      name: service?.name ?? '',
      description: service?.description ?? '',
      nameEn: service?.nameEn ?? '',
      descriptionEn: service?.descriptionEn ?? '',
      type: service?.type ?? 'OTHER',
      active: service?.active ?? true,
      order: service?.order ?? 0,
      useDefaults: service ? service.hasCustomFields === false : true,
      fields: (service?.fields ?? []).map(toRow),
    },
  });

  const { fields: rows, append, remove, move, replace } = useFieldArray({ control, name: 'fields' });
  const useDefaults = watch('useDefaults');
  const type = watch('type');

  // Switching to a custom form starts from what the service shows today (its category's fields).
  const startCustomForm = () => {
    replace(getDefaultServiceFields(getValues('type'), service?.id).map(toRow));
    setValue('useDefaults', false);
  };

  const onSubmit = (values: FormValues) => {
    setMessage(null);
    const body = {
      name: values.name,
      description: values.description,
      nameEn: values.nameEn,
      descriptionEn: values.descriptionEn,
      type: values.type,
      active: values.active,
      order: values.order,
      fields: values.useDefaults ? null : (values.fields as FieldRow[]).map(toField),
    };
    mutation.mutate(jsonBody(service ? 'PUT' : 'POST', body), {
      onSuccess: () => {
        setMessage({ type: 'success', text: t('admin.common.messages.saved') });
        setTimeout(() => router.push('/admin/services'), 800);
      },
      onError: error => setMessage({ type: 'error', text: t(adminErrorKey(error)) }),
    });
  };

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-start text-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200';
  const ltrInputClass = inputClass.replace('text-start', 'text-left');
  const rowErrors = errors.fields as any;
  const defaultsPreview = getDefaultServiceFields(type, service?.id);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl bg-white p-6 shadow-xl md:p-8" noValidate>
      <InfoMessage message={message} onClose={() => setMessage(null)} />

      <ControlledInputText id="name" name="name" control={control} label={t('admin.services.fields.name')} error={errors.name} required />
      <ControlledTextArea
        id="description"
        name="description"
        control={control}
        label={t('admin.services.fields.description')}
        error={errors.description}
        rows={3}
        required
      />

      <EnglishSection>
        <EnglishInput id="nameEn" name="nameEn" control={control} label={t('admin.services.fields.name')} error={errors.nameEn} />
        <EnglishInput
          id="descriptionEn"
          name="descriptionEn"
          control={control}
          label={t('admin.services.fields.description')}
          error={errors.descriptionEn}
          rows={3}
        />
      </EnglishSection>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ControlledSelect
          id="type"
          name="type"
          control={control}
          label={t('admin.services.fields.type')}
          options={SERVICE_TYPES.map(value => ({ value, label: t(serviceTypeKey(value)) }))}
          error={errors.type}
          required
        />
        <ControlledInputText id="order" name="order" type="number" control={control} label={t('admin.common.order')} error={errors.order} />
      </div>

      <ControlledCheckbox id="active" name="active" control={control} label={t('admin.services.fields.activeHint')} />

      <div className="mt-6 border-t pt-6">
        <h3 className="mb-2 text-xl font-bold text-gray-800">{t('admin.services.formTitle')}</h3>

        {useDefaults ? (
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="mb-3 text-sm text-gray-700">{t('admin.services.usingDefaults')}</p>
            {defaultsPreview.length > 0 ? (
              <ul className="mb-4 list-inside list-disc text-sm text-gray-600">
                {defaultsPreview.map(field => (
                  <li key={field.key}>
                    {field.label} ({t(`admin.services.kinds.${field.kind}`)}
                    {field.required ? ` · ${t('admin.services.fields.required')}` : ''})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mb-4 text-sm text-gray-500">{t('admin.services.noExtraFields')}</p>
            )}
            <Button variant="secondary" size="sm" onClick={startCustomForm}>
              {t('admin.services.customize')}
            </Button>
          </div>
        ) : (
          <div>
            <p className="mb-4 text-sm text-gray-600">{t('admin.services.customHint')}</p>
            {typeof rowErrors?.message === 'string' && <p className="mb-3 text-sm text-red-500">{rowErrors.message}</p>}

            <div className="space-y-4">
              {rows.map((row, index) => {
                const kind = watch(`fields.${index}.kind`);
                const rowError = rowErrors?.[index];
                return (
                  <div key={row.id} className="rounded-xl border border-gray-200 p-4">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-gray-700">{t('admin.services.fieldNumber', { number: index + 1 })}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => move(index, index - 1)}
                          disabled={index === 0}
                          aria-label={t('admin.services.moveUp')}
                          className="cursor-pointer rounded-md bg-gray-100 px-2 py-1 text-sm hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => move(index, index + 1)}
                          disabled={index === rows.length - 1}
                          aria-label={t('admin.services.moveDown')}
                          className="cursor-pointer rounded-md bg-gray-100 px-2 py-1 text-sm hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          ▼
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="cursor-pointer rounded-md bg-red-100 px-2 py-1 text-sm font-semibold text-red-700 hover:bg-red-200"
                        >
                          {t('admin.services.removeField')}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <label className="block text-sm text-gray-700">
                        {t('admin.services.fields.label')} *
                        <input className={inputClass} {...register(`fields.${index}.label`)} />
                        {rowError?.label && <span className="mt-1 block text-xs text-red-500">{rowError.label.message}</span>}
                      </label>
                      <label className="block text-sm text-gray-700">
                        {t('admin.services.fields.labelEn')}
                        <input className={ltrInputClass} dir="ltr" {...register(`fields.${index}.labelEn`)} />
                        {rowError?.labelEn && <span className="mt-1 block text-xs text-red-500">{rowError.labelEn.message}</span>}
                      </label>
                      <label className="block text-sm text-gray-700">
                        {t('admin.services.fields.key')} *
                        <input className={inputClass} dir="ltr" placeholder="propertyNumber" {...register(`fields.${index}.key`)} />
                        {rowError?.key && <span className="mt-1 block text-xs text-red-500">{rowError.key.message}</span>}
                      </label>
                      <label className="block text-sm text-gray-700">
                        {t('admin.services.fields.kind')}
                        <select className={inputClass} {...register(`fields.${index}.kind`)}>
                          {SERVICE_FIELD_KINDS.map(value => (
                            <option key={value} value={value}>
                              {t(`admin.services.kinds.${value}`)}
                            </option>
                          ))}
                        </select>
                      </label>
                      {kind === 'select' && (
                        <>
                          <label className="block text-sm text-gray-700">
                            {t('admin.services.fields.options')} *
                            <textarea className={inputClass} rows={3} {...register(`fields.${index}.optionsText`)} />
                            {rowError?.optionsText && <span className="mt-1 block text-xs text-red-500">{rowError.optionsText.message}</span>}
                          </label>
                          <label className="block text-sm text-gray-700">
                            {t('admin.services.fields.optionsEn')}
                            <textarea
                              className={ltrInputClass}
                              dir="ltr"
                              rows={3}
                              {...register(`fields.${index}.optionsEnText`)}
                            />
                            {rowError?.optionsEnText && (
                              <span className="mt-1 block text-xs text-red-500">{rowError.optionsEnText.message}</span>
                            )}
                          </label>
                          <p className="-mt-1 text-xs text-gray-500 md:col-span-2">{t('admin.services.fields.optionsEnHint')}</p>
                        </>
                      )}
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="h-4 w-4" {...register(`fields.${index}.required`)} />
                        {t('admin.services.fields.required')}
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={() => append({ ...EMPTY_ROW })}>
                {t('admin.services.addField')}
              </Button>
              <Button
                variant="warning"
                size="sm"
                onClick={() => {
                  replace([]);
                  setValue('useDefaults', true);
                }}
              >
                {t('admin.services.backToDefaults')}
              </Button>
            </div>
            <p className="mt-3 text-xs text-gray-500">{t('admin.services.keyHint')}</p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <Button type="submit" variant="primary" size="lg" loading={mutation.isPending} className="w-full sm:w-auto">
          {service ? t('admin.common.save') : t('admin.services.create')}
        </Button>
      </div>
    </form>
  );
}
