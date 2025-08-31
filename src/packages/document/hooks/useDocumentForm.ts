'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { documentUploadSchema, DocumentUploadFormData } from '../validation/document.validation';

export function useDocumentForm() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const form = useForm<DocumentUploadFormData>({
    resolver: yupResolver(documentUploadSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'PDF',
      file: undefined,
    },
  });

  const onSubmit = async (data: DocumentUploadFormData) => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('type', data.type);

      const response = await fetch('/api/document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Upload response:', result);

      // Reset form on success
      form.reset();
      setMessage({ type: 'success', text: t('documents.form.messages.uploadSuccess') || 'تم رفع المستند بنجاح' });
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({
        type: 'error',
        text: t('documents.form.messages.uploadError') || 'حدث خطأ أثناء رفع المستند',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeMessage = () => {
    setMessage(null);
  };

  return {
    form,
    isSubmitting,
    message,
    onSubmit,
    closeMessage,
  };
}
