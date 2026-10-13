import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Role } from '@prisma/client';

type UpdatePayload = {
  userId: string;
  data: { password: string } | { role: Role };
};

const updateAdminUser = async ({ userId, data }: UpdatePayload) => {
  const response = await fetch(`/api/admin/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || 'Failed to update user');
  }

  return response.json();
};

export const useAdminUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
};
