'use client';

import React from 'react';
import { getAdditionalFields } from '@/packages/services/utils/form.utils';
import PersonalInfoSection from '@/packages/services/forms/PersonalInfoSection';
import AdditionalFieldsSection from '@/packages/services/forms/AdditionalFieldsSection';
import RequestDetailsSection from '@/packages/services/forms/RequestDetailsSection';
import EditSubmissionButton from '@/packages/profile/edit-submission/components/EditSubmissionButton';
import InfoMessage from '@/packages/common/components/form/InfoMessage';
import { Control, FieldErrors } from 'react-hook-form';

type FormData = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  serviceType: string;
  description: string;
  additionalInfo: Record<string, any>;
};

type EditSubmissionFormProps = {
  form: {
    handleSubmit: (onSubmit: (data: FormData) => void) => (e: React.FormEvent) => void;
    control: Control<FormData>;
    formState: { errors: FieldErrors<FormData>; isDirty: boolean; isValid: boolean };
  };
  isSubmitting: boolean;
  message: { type: 'success' | 'error'; text: string } | null;
  onSubmit: (data: FormData) => void;
  closeMessage: () => void;
  category: string;
  serviceId: string;
};

export default function EditSubmissionForm({ form, isSubmitting, message, onSubmit, closeMessage, category, serviceId }: EditSubmissionFormProps) {
  const {
    handleSubmit,
    control,
    formState: { errors, isDirty, isValid },
  } = form;

  const additionalFields = getAdditionalFields(category, serviceId);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl bg-white p-8 shadow-xl">
      <InfoMessage message={message} onClose={closeMessage} />

      <PersonalInfoSection control={control} errors={errors} />

      <AdditionalFieldsSection additionalFields={additionalFields} control={control} errors={errors} />

      <RequestDetailsSection control={control} errors={errors} />

      <EditSubmissionButton isSubmitting={isSubmitting} isDirty={isDirty} isValid={isValid} />
    </form>
  );
}
