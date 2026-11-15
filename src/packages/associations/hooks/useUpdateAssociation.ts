import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateAssociationFormData } from '../validation/associations.validation';

export const useUpdateAssociation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (association: UpdateAssociationFormData & { id: string }) => updateAssociation(association),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['associations'] });
    },
  });
};

const updateAssociation = async (data: UpdateAssociationFormData & { id: string }) => {
  const formData = new FormData();

  formData.append('name', data.name);
  formData.append('description', data.description);
  // English version: always sent, so clearing a field clears it on the server.
  formData.append('nameEn', data.nameEn ?? '');
  formData.append('descriptionEn', data.descriptionEn ?? '');
  if (data.image) {
    formData.append('image', data.image);
  }

  const response = await fetch(`/api/associations/${data.id}`, {
    method: 'PUT',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update association');
  }

  return response.json();
};
