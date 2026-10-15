import { useMutation } from '@tanstack/react-query';
import { readApiError } from '@/packages/common/utils/api-error.utils';

const resetPassword = async (data: { token: string; password: string }) => {
  const response = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const { status, code } = await readApiError(response);
    if (code === 'WEAK_PASSWORD') throw new Error('WEAK_PASSWORD');
    throw new Error(status === 400 ? 'INVALID_TOKEN' : 'RESET_PASSWORD_FAILED');
  }

  return response.json();
};

export default function useResetPassword() {
  return useMutation({ mutationFn: resetPassword });
}
