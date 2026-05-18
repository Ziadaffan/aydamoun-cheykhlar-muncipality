import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteTaxiStop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTaxiStop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taxiStops'] });
    },
  });
};

const deleteTaxiStop = async (id: string) => {
  const response = await fetch(`/api/taxi-stops/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete taxi stop');
  }

  return response.json();
};
