import { useQuery } from '@tanstack/react-query';
import { AdminServiceSubmission } from '../types';

const fetchAdminServiceSubmission = async (submissionId: string): Promise<AdminServiceSubmission> => {
  const response = await fetch(`/api/admin/service-submissions/${submissionId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch service submission');
  }

  return response.json();
};

export const useAdminServiceSubmission = (submissionId: string) => {
  return useQuery({
    queryKey: ['admin-service-submission', submissionId],
    queryFn: () => fetchAdminServiceSubmission(submissionId),
    enabled: !!submissionId,
  });
};
