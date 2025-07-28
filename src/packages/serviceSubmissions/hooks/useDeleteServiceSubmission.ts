import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteServiceSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteServiceSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
  });
};

const deleteServiceSubmission = async (submissionId: string) => {
  const response = await fetch(`/api/user/service-submissions/${submissionId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete submission');
  }

  return response.json();
};
