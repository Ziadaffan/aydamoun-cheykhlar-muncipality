import { useMutation } from '@tanstack/react-query';

export type UpdatePasswordFormData = {
  oldPassword: string;
  newPassword: string;
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: updatePassword,
  });
};

const updatePassword = async (data: UpdatePasswordFormData) => {
  const response = await fetch(`/api/user`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to update password');
      }
      return res.json();
    })
    .catch(() => {
      throw new Error('Failed to update password');
    });

  return response;
};
