import { useQuery } from '@tanstack/react-query';

export default function useGetJobById(id: string) {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => getJobById(id),
    enabled: !!id,
  });
}

const getJobById = async (id: string) => {
  const response = await fetch(`/api/jobs/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch job');
  }

  return response.json();
};

