'use client';

import React from 'react';
import { getAdditionalFields } from '../utils/form.utils';
import { useServiceForm } from '../hooks/useServiceForm';
import PersonalInfoSection from './PersonalInfoSection';
import AdditionalFieldsSection from './AdditionalFieldsSection';
import RequestDetailsSection from './RequestDetailsSection';
import FormSubmitButton from './FormSubmitButton';
import FormMessage from './FormMessage';

type ServiceFormProps = {
  category: string;
  serviceId: string;
};

export default function ServiceForm({ category, serviceId }: ServiceFormProps) {
  const { form, isSubmitting, message, onSubmit, closeMessage } = useServiceForm({
    category,
    serviceId,
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = form;
  const additionalFields = getAdditionalFields(category, serviceId);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl bg-white p-8 shadow-xl">
      <FormMessage message={message} onClose={closeMessage} />

      <PersonalInfoSection control={control} errors={errors} />

      <AdditionalFieldsSection additionalFields={additionalFields} control={control} errors={errors} />

      <RequestDetailsSection control={control} errors={errors} />

      <FormSubmitButton isSubmitting={isSubmitting} isDirty={isDirty} />
    </form>
  );
}
