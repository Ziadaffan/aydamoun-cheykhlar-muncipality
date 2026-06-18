import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateAssociationFormData } from '../validation/associations.validation';

export const useCreateAssociation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAssociation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['associations'] });
    },
  });
};

const createAssociation = async (data: CreateAssociationFormData) => {
  const formData = new FormData();

  formData.append('name', data.name);
  formData.append('description', data.description);
  if (data.image) {
    formData.append('image', data.image);
  }

  const response = await fetch('/api/associations', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create association');
  }

  return response.json();
};
