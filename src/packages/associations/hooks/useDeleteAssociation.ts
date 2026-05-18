import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteAssociation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAssociation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['associations'] });
    },
  });
};

const deleteAssociation = async (id: string) => {
  const response = await fetch(`/api/associations/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete association');
  }

  return response.json();
};
