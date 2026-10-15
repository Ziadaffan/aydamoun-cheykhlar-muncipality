import { useMutation } from '@tanstack/react-query';
import { isApiError, readApiError } from '@/packages/common/utils/api-error.utils';

export type UpdatePasswordFormData = {
  oldPassword: string;
  newPassword: string;
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: updatePassword,
  });
};

/** Throws INVALID_PASSWORD, SAME_PASSWORD, WEAK_PASSWORD, UNAUTHORIZED or UPDATE_PASSWORD_FAILED. */
const updatePassword = async (data: UpdatePasswordFormData) => {
  const response = await fetch(`/api/user`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).catch(() => {
    throw new Error('UPDATE_PASSWORD_FAILED');
  });

  if (!response.ok) {
    const info = await readApiError(response);
    if (isApiError(info, 'INVALID_PASSWORD', 'Invalid password')) throw new Error('INVALID_PASSWORD');
    if (isApiError(info, 'SAME_PASSWORD', 'New password cannot be the same as the old password')) throw new Error('SAME_PASSWORD');
    if (info.code === 'WEAK_PASSWORD') throw new Error('WEAK_PASSWORD');
    if (info.status === 401) throw new Error('UNAUTHORIZED');
    throw new Error('UPDATE_PASSWORD_FAILED');
  }

  return response.json();
};
