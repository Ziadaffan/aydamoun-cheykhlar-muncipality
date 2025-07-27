'use client';

import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import ControlledInputText from '@/packages/common/components/ControlledInputText';
import Button from '@/packages/common/components/Button';
import Banner from '@/packages/common/components/Banner';
import { getAdditionalFields } from '../utils/form.utils';

type ServiceFormProps = {
  category: string;
  serviceId?: number;
};

type FormData = {
  // Informations personnelles
  fullName: string;
  phone: string;
  email: string;
  address: string;

  // Informations du service
  serviceType: string;
  description: string;

  // Informations supplémentaires selon la catégorie
  additionalInfo: Record<string, any>;

  // Documents
  documents: File[];
};

export default function ServiceForm({ category, serviceId }: ServiceFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      fullName: 'ziad affan',
      phone: '4185736096',
      email: 'ziad@gmail.com',
      address: '123 Main St, Anytown, USA',
      serviceType: serviceId ? serviceId.toString() : '',
      description: 'I need a building license',
      additionalInfo: {},
      documents: [],
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setValue('documents', files);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setMessage(null);
    try {
      console.log(data);
      // Handle form submission logic here
      setMessage({ type: 'success', text: t('services.form.messages.submitSuccess') });
      setTimeout(() => router.push('/services'), 1500);
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage({ type: 'error', text: t('services.form.messages.submitError') });
    } finally {
      setIsSubmitting(false);
    }
  };

  const additionalFields = getAdditionalFields(category);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl bg-white p-8 shadow-xl">
      {message && <Banner type={message.type} message={message.text} onClose={() => setMessage(null)} />}

      {/* Informations personnelles */}
      <div className="mb-8">
        <h3 className="mb-6 border-b pb-2 text-xl font-bold text-gray-800">{t('services.form.personalInfo')}</h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ControlledInputText
            id="fullName"
            label={t('services.form.fields.fullName')}
            type="text"
            register={register('fullName', { required: t('services.form.fields.fullNameRequired') })}
            error={errors.fullName}
            required
          />

          <ControlledInputText
            id="phone"
            label={t('services.form.fields.phone')}
            type="tel"
            register={register('phone', {
              required: t('services.form.fields.phoneRequired'),
              pattern: {
                value: /^[\+]?[0-9\s\-\(\)]+$/,
                message: t('services.form.fields.phoneInvalid'),
              },
            })}
            error={errors.phone}
            required
          />

          <ControlledInputText
            id="email"
            label={t('services.form.fields.email')}
            type="email"
            register={register('email', {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: t('services.form.fields.emailInvalid'),
              },
            })}
            error={errors.email}
          />

          <ControlledInputText
            id="address"
            label={t('services.form.fields.address')}
            type="text"
            register={register('address', { required: t('services.form.fields.addressRequired') })}
            error={errors.address}
            required
          />
        </div>
      </div>

      {/* Champs supplémentaires selon la catégorie */}
      {additionalFields.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-6 border-b pb-2 text-xl font-bold text-gray-800">{t('services.form.additionalInfo')}</h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {additionalFields.map(field => (
              <div key={field.name}>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {field.label} {field.required && '*'}
                </label>

                {field.type === 'select' ? (
                  <Controller
                    name={`additionalInfo.${field.name}`}
                    control={control}
                    rules={{ required: field.required ? `${field.label} مطلوب` : false }}
                    render={({ field: { onChange, value } }) => (
                      <select
                        value={value || ''}
                        onChange={onChange}
                        className={`w-full rounded-lg border px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                          errors.additionalInfo?.[field.name] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">{t('services.form.buttons.choose')}</option>
                        {field.options?.map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                ) : field.type === 'radio' ? (
                  <Controller
                    name={`additionalInfo.${field.name}`}
                    control={control}
                    rules={{ required: field.required ? `${field.label} مطلوب` : false }}
                    render={({ field: { onChange, value } }) => (
                      <div className="space-y-2">
                        {field.options?.map(option => (
                          <label key={option} className="flex items-center">
                            <input type="radio" value={option} checked={value === option} onChange={onChange} className="mr-2" />
                            {option}
                          </label>
                        ))}
                      </div>
                    )}
                  />
                ) : (
                  <Controller
                    name={`additionalInfo.${field.name}`}
                    control={control}
                    rules={{ required: field.required ? `${field.label} مطلوب` : false }}
                    render={({ field: { onChange, value } }) => (
                      <input
                        type={field.type}
                        value={value || ''}
                        onChange={onChange}
                        className={`w-full rounded-lg border px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                          errors.additionalInfo?.[field.name] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    )}
                  />
                )}
                {errors.additionalInfo?.[field.name] && (
                  <p className="mt-1 text-sm text-red-500">
                    {String(errors.additionalInfo[field.name]?.message || t('services.form.messages.fieldRequired'))}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div className="mb-8">
        <h3 className="mb-6 border-b pb-2 text-xl font-bold text-gray-800">{t('services.form.requestDetails')}</h3>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">{t('services.form.fields.description')} *</label>
          <textarea
            rows={4}
            {...register('description', {
              required: t('services.form.fields.descriptionRequired'),
              minLength: {
                value: 10,
                message: t('services.form.fields.descriptionMinLength'),
              },
            })}
            className={`w-full rounded-lg border px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={t('services.form.fields.descriptionPlaceholder')}
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
        </div>
      </div>

      {/* Documents */}
      {/* <div className="mb-8">
        <h3 className="mb-6 border-b pb-2 text-xl font-bold text-gray-800">المرفقات (اختياري)</h3>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">إرفاق مستندات</label>
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-2 text-sm text-gray-500">يمكنك إرفاق ملفات PDF، Word، أو صور (الحد الأقصى: 5 ملفات)</p>
        </div>
      </div> */}

      {/* Bouton de soumission */}
      <div className="flex justify-end">
        <Button type="submit" variant="primary" size="lg" loading={isSubmitting} disabled={isSubmitting}>
          {t('services.form.buttons.submit')}
        </Button>
      </div>
    </form>
  );
}
