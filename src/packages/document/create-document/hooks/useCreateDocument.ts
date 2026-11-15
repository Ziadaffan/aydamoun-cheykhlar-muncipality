import i18next from 'i18next';
import { DocumentUploadFormData } from '@/packages/document/validation/document.validation';
import { useMutation } from '@tanstack/react-query';

export const useCreateDocument = () => {
  return useMutation({
    mutationFn: createDocument,
  });
};

const createDocument = async (data: DocumentUploadFormData) => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);
  // English version: always sent, so clearing a field clears it on the server.
  formData.append('titleEn', data.titleEn ?? '');
  formData.append('descriptionEn', data.descriptionEn ?? '');
  if (data.file) {
    formData.append('file', data.file as File);
  }

  const response = await fetch('/api/documents', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(i18next.t('documents.form.messages.uploadError'));
  }

  return response.json();
};
