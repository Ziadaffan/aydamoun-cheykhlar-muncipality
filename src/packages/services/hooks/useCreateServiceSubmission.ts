import { useMutation } from '@tanstack/react-query';
import i18next from 'i18next';
export interface CreateServiceSubmissionData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  description: string;
  additionalInfo: any;
  // documents: File[];
}
export const useCreateServiceSubmission = (serviceId: string) => {
  return useMutation({
    mutationFn: (data: CreateServiceSubmissionData) => createServiceSubmission(data, serviceId),
  });
};

const createServiceSubmission = async (data: CreateServiceSubmissionData, serviceId: string) => {
  const response = await fetch(`/api/services/${serviceId}/submissions`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(i18next.t('services.form.messages.submitError'));
  }

  return response.json();
};
