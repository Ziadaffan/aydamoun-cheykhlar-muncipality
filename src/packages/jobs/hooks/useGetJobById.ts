import { useQuery } from '@tanstack/react-query';
import { Jobs } from '@prisma/client';

/** Failed job request; `status` 404 means the job doesn't exist (deleted, or a wrong link). */
export class JobRequestError extends Error {
  constructor(public readonly status: number) {
    super('Failed to fetch job');
  }
}

export default function useGetJobById(id: string) {
  return useQuery<Jobs, Error>({
    queryKey: ['job', id],
    queryFn: () => getJobById(id),
    enabled: !!id,
    // A missing job won't appear on retry.
    retry: (failureCount, error) => !(error instanceof JobRequestError && error.status === 404) && failureCount < 3,
  });
}

const getJobById = async (id: string): Promise<Jobs> => {
  const response = await fetch(`/api/jobs/${encodeURIComponent(id)}`);

  if (!response.ok) {
    throw new JobRequestError(response.status);
  }

  return response.json();
};
