import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateTaxiStopFormData } from '../validation/taxiStops.validation';

export const useUpdateTaxiStop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taxiStop: UpdateTaxiStopFormData & { id: string }) => updateTaxiStop(taxiStop),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taxiStops'] });
    },
  });
};

const updateTaxiStop = async (data: UpdateTaxiStopFormData & { id: string }) => {
  const formData = new FormData();

  formData.append('name', data.name);
  formData.append('fromLocation', data.fromLocation);
  formData.append('toLocation', data.toLocation);
  formData.append('hour', data.hour);
  formData.append('phone', data.phone);

  const response = await fetch(`/api/taxi-stops/${data.id}`, {
    method: 'PUT',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update taxi stop');
  }

  return response.json();
};
