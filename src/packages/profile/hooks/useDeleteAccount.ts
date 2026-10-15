import { useMutation } from '@tanstack/react-query';
import { isApiError, readApiError } from '@/packages/common/utils/api-error.utils';

/** Throws INVALID_PASSWORD, PASSWORD_REQUIRED, UNAUTHORIZED or DELETE_FAILED. */
const deleteAccount = async (data: { password: string }) => {
  const response = await fetch('/api/user', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).catch(() => {
    throw new Error('DELETE_FAILED');
  });

  if (!response.ok) {
    const info = await readApiError(response);
    if (isApiError(info, 'INVALID_PASSWORD', 'Invalid password')) throw new Error('INVALID_PASSWORD');
    if (isApiError(info, 'PASSWORD_REQUIRED', 'Password is required')) throw new Error('PASSWORD_REQUIRED');
    if (info.status === 401) throw new Error('UNAUTHORIZED');
    throw new Error('DELETE_FAILED');
  }

  return response.json();
};

export const useDeleteAccount = () => {
  return useMutation({ mutationFn: deleteAccount });
};
