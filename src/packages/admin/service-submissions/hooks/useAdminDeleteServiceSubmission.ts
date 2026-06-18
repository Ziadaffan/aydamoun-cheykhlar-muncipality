import { useMutation, useQueryClient } from '@tanstack/react-query';

const deleteAdminServiceSubmission = async (submissionId: string) => {
  const response = await fetch(`/api/admin/service-submissions/${submissionId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete service submission');
  }

  return response.json();
};

export const useAdminDeleteServiceSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminServiceSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-service-submissions'] });
    },
  });
};
