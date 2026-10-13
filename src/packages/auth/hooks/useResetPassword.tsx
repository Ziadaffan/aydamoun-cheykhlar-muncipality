import { useMutation } from '@tanstack/react-query';

const resetPassword = async (data: { token: string; password: string }) => {
  const response = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(response.status === 400 ? 'INVALID_TOKEN' : 'RESET_PASSWORD_FAILED');
  }

  return response.json();
};

export default function useResetPassword() {
  return useMutation({ mutationFn: resetPassword });
}
