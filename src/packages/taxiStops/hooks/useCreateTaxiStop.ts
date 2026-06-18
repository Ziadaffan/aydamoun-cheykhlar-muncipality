import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateTaxiStopFormData } from '../validation/taxiStops.validation';

export const useCreateTaxiStop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTaxiStop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taxiStops'] });
    },
  });
};

const createTaxiStop = async (data: CreateTaxiStopFormData) => {
  const formData = new FormData();

  formData.append('name', data.name);
  formData.append('fromLocation', data.fromLocation);
  formData.append('toLocation', data.toLocation);
  formData.append('hour', data.hour);
  formData.append('phone', data.phone);

  const response = await fetch('/api/taxi-stops', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create taxi stop');
  }

  return response.json();
};
