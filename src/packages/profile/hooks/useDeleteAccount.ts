import { useMutation } from '@tanstack/react-query';

const deleteAccount = async (data: { password: string }) => {
  const response = await fetch('/api/user', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error === 'Invalid password' ? 'INVALID_PASSWORD' : 'DELETE_FAILED');
  }

  return response.json();
};

export const useDeleteAccount = () => {
  return useMutation({ mutationFn: deleteAccount });
};
