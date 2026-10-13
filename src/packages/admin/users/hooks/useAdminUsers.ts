import { useQuery } from '@tanstack/react-query';
import { AdminUser } from '../types';

const fetchAdminUsers = async (): Promise<AdminUser[]> => {
  const response = await fetch('/api/admin/users');

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
};

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: fetchAdminUsers,
  });
};
