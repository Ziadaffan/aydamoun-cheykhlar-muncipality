import { useMutation } from '@tanstack/react-query';

const forgotPassword = async (data: { email: string }) => {
  const response = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('FORGOT_PASSWORD_FAILED');
  }

  return response.json();
};

export default function useForgotPassword() {
  return useMutation({ mutationFn: forgotPassword });
}
