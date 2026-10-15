import { useMutation } from '@tanstack/react-query';
import { ProfileFormData } from '@/packages/profile/hooks/useProfilePage';
import { useSession } from 'next-auth/react';
import { isApiError, readApiError } from '@/packages/common/utils/api-error.utils';

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

/** Throws USER_EXISTS, INVALID_PHONE, EMAIL_OR_PHONE_REQUIRED, UNAUTHORIZED or UPDATE_FAILED. */
const updateProfile = async (data: ProfileFormData) => {
  const response = await fetch(`/api/user`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).catch(() => {
    throw new Error('UPDATE_FAILED');
  });

  if (!response.ok) {
    const info = await readApiError(response);
    // 409 USER_EXISTS now; a 400 with this message before the error codes were added.
    if (info.status === 409 || isApiError(info, 'USER_EXISTS', 'Email or phone already in use')) throw new Error('USER_EXISTS');
    if (isApiError(info, 'INVALID_PHONE', 'Invalid phone number')) throw new Error('INVALID_PHONE');
    if (isApiError(info, 'EMAIL_OR_PHONE_REQUIRED', 'Email or phone is required')) throw new Error('EMAIL_OR_PHONE_REQUIRED');
    if (info.status === 401) throw new Error('UNAUTHORIZED');
    throw new Error('UPDATE_FAILED');
  }

  return response.json();
};
