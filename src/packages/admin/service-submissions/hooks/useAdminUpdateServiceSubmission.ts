import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminServiceSubmission } from '../types';

type UpdatePayload = {
  submissionId: string;
  data: Partial<AdminServiceSubmission>;
};

const updateAdminServiceSubmission = async ({ submissionId, data }: UpdatePayload): Promise<AdminServiceSubmission> => {
  const response = await fetch(`/api/admin/service-submissions/${submissionId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update service submission');
  }

  return response.json();
};

export const useAdminUpdateServiceSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminServiceSubmission,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['admin-service-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['admin-service-submission', data.id] });
    },
  });
};
