'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ServiceField } from '@/packages/services/utils/serviceFields';
import PersonalInfoSection from '@/packages/services/forms/PersonalInfoSection';
import AdditionalFieldsSection from '@/packages/services/forms/AdditionalFieldsSection';
import RequestDetailsSection from '@/packages/services/forms/RequestDetailsSection';
import EditSubmissionButton from '@/packages/profile/edit-submission/components/EditSubmissionButton';
import InfoMessage from '@/packages/common/components/form/InfoMessage';
import { UseFormReturn } from 'react-hook-form';
import ControlledSelect from '@/packages/common/components/form/ControlledSelect';
import { ServiceStatus } from '@prisma/client';

type FormData = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  serviceType: string;
  description: string;
  additionalInfo: Record<string, any>;
  status?: ServiceStatus | undefined;
};

type EditSubmissionFormProps = {
  form: UseFormReturn<FormData, any, any>;
  isSubmitting: boolean;
  message: { type: 'success' | 'error'; text: string } | null;
  onSubmit: (data: FormData) => void;
  closeMessage: () => void;
  /** The service's form fields (resolveServiceFields). */
  fields: ServiceField[];
  showStatusField?: boolean;
};

export default function EditSubmissionForm({
  form,
  isSubmitting,
  message,
  onSubmit,
  closeMessage,
  fields,
  showStatusField = false,
}: EditSubmissionFormProps) {
  const { t } = useTranslation();
  const {
    handleSubmit,
    control,
    formState: { errors, isDirty, isValid },
  } = form;
  // A photo still uploading has no value yet: the changes wait for it.
  const [isUploading, setIsUploading] = useState(false);

  const statusOptions = [
    { value: 'PENDING', label: t('profile.submissions.status.pending') },
    { value: 'IN_PROGRESS', label: t('profile.submissions.status.inProgress') },
    { value: 'COMPLETED', label: t('profile.submissions.status.completed') },
    { value: 'REJECTED', label: t('profile.submissions.status.rejected') },
  ];

  return (
    <form onSubmit={handleSubmit(data => !isUploading && onSubmit(data))} className="rounded-2xl bg-white p-8 shadow-xl">
      <InfoMessage message={message} onClose={closeMessage} />

      <PersonalInfoSection control={control} errors={errors} />

      {showStatusField && (
        <div className="mb-8">
          <h3 className="mb-4 border-b pb-2 text-xl font-bold text-gray-800">{t('admin.serviceSubmissions.statusLabel')}</h3>
          <ControlledSelect
            id="status"
            name="status"
            control={control}
            label={t('admin.serviceSubmissions.status')}
            options={statusOptions}
            placeholder={t('services.form.buttons.choose')}
            error={errors.status as any}
          />
        </div>
      )}

      <AdditionalFieldsSection additionalFields={fields} control={control} errors={errors} onUploadingChange={setIsUploading} />

      <RequestDetailsSection control={control} errors={errors} />

      <EditSubmissionButton isSubmitting={isSubmitting} isDirty={isDirty} isValid={isValid} isUploading={isUploading} />
    </form>
  );
}
