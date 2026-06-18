import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
};

const deleteDocument = async (documentId: string) => {
  const response = await fetch(`/api/documents/${documentId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete document');
  }

  return response.json();
};
