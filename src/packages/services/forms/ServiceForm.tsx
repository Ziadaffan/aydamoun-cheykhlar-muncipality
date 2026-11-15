'use client';

import React from 'react';
import type { ServiceField } from '../utils/serviceFields';
import { useServiceForm } from '../hooks/useServiceForm';
import PersonalInfoSection from './PersonalInfoSection';
import AdditionalFieldsSection from './AdditionalFieldsSection';
import RequestDetailsSection from './RequestDetailsSection';
import FormSubmitButton from './FormSubmitButton';
import InfoMessage from '@/packages/common/components/form/InfoMessage';

type ServiceFormProps = {
  serviceId: string;
  /** The service's form fields (sent resolved by the API). */
  fields: ServiceField[];
};

export default function ServiceForm({ serviceId, fields }: ServiceFormProps) {
  const { form, isSubmitting, message, onSubmit, closeMessage } = useServiceForm({
    fields,
    serviceId,
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isDirty, isValid },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl bg-white p-8 shadow-xl">
      <InfoMessage message={message} onClose={closeMessage} />

      <PersonalInfoSection control={control} errors={errors} />

      <AdditionalFieldsSection additionalFields={fields} control={control} errors={errors} />

      <RequestDetailsSection control={control} errors={errors} />

      <FormSubmitButton isSubmitting={isSubmitting} isDirty={isDirty} />
    </form>
  );
}
