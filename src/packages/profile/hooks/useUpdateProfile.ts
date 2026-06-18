import { useMutation } from '@tanstack/react-query';
import { ProfileFormData } from '@/packages/profile/hooks/useProfilePage';
import { useSession } from 'next-auth/react';

export const useUpdateProfile = () => {
  const { update: updateSession } = useSession();

  return useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const response = await updateProfile(data);
      await updateSession();
      return response;
    },
  });
};

const updateProfile = async (data: ProfileFormData) => {
  const response = await fetch(`/api/user`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to update profile');
      }
      return res.json();
    })
    .catch(() => {
      throw new Error('Failed to update profile');
    });

  return response;
};
