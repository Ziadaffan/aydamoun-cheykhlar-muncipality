import { useQuery } from '@tanstack/react-query';
import { AdminServiceSubmission } from '../types';

const fetchAdminServiceSubmissions = async (): Promise<AdminServiceSubmission[]> => {
  const response = await fetch('/api/admin/service-submissions');

  if (!response.ok) {
    throw new Error('Failed to fetch service submissions');
  }

  return response.json();
};

export const useAdminServiceSubmissions = () => {
  return useQuery({
    queryKey: ['admin-service-submissions'],
    queryFn: fetchAdminServiceSubmissions,
  });
};
