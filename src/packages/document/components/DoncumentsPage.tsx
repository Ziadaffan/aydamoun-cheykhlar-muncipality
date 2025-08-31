'use client';

import React from 'react';
import { useDocumentForm } from '../hooks/useDocumentForm';
import ControlledInputText from '@/packages/common/components/form/ControlledInputText';
import ControlledTextArea from '@/packages/common/components/form/ControlledTextArea';
import ControlledSelect from '@/packages/common/components/form/ControlledSelect';
import ControlledFileInput from '@/packages/common/components/form/ControlledFileInput';
import FormMessage from '@/packages/common/components/form/FormMessage';
import FormSubmitButton from '@/packages/common/components/form/FormSubmitButton';

const documentTypeOptions = [
  { value: 'PDF', label: 'PDF' },
  { value: 'WORD', label: 'WORD' },
  { value: 'OTHER', label: 'OTHER' },
  { value: 'IMAGE', label: 'IMAGE' },
  { value: 'VIDEO', label: 'VIDEO' },
];

export default function DocumentsPage() {
  const { form, isSubmitting, message, onSubmit, closeMessage } = useDocumentForm();

  const {
    handleSubmit,
    control,
    formState: { errors, isDirty, isValid },
  } = form;

  return (
    <div className="mx-auto max-w-2xl p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl bg-white p-8 shadow-xl">
        <FormMessage message={message} onClose={closeMessage} />

        <div className="mb-8">
          <h3 className="mb-6 border-b pb-2 text-xl font-bold text-gray-800">رفع مستند جديد</h3>
        </div>

        <div className="space-y-6">
          <ControlledInputText
            id="title"
            label="عنوان المستند"
            type="text"
            control={control}
            name="title"
            error={errors.title}
            placeholder="أدخل عنوان المستند"
            required
          />

          <ControlledTextArea
            id="description"
            label="وصف المستند"
            control={control}
            name="description"
            error={errors.description}
            placeholder="أدخل وصف المستند"
            rows={4}
            required
          />

          <ControlledSelect
            id="type"
            label="نوع المستند"
            options={documentTypeOptions}
            control={control}
            name="type"
            error={errors.type}
            placeholder="اختر نوع المستند"
            required
          />

          <ControlledFileInput
            id="file"
            label="الملف"
            control={control}
            name="file"
            error={errors.file}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov"
            required
          />
        </div>

        <div className="mt-8">
          <FormSubmitButton isSubmitting={isSubmitting} isDirty={isDirty} isValid={isValid}>
            {isSubmitting ? 'جاري الرفع...' : 'رفع المستند'}
          </FormSubmitButton>
        </div>
      </form>
    </div>
  );
}
