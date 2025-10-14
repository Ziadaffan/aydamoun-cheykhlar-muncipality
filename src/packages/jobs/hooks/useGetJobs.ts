import { useQuery } from '@tanstack/react-query';

export default function useGetJobs() {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: () => getJobs(),
  });
}

const getJobs = async () => {
  const response = await fetch('/api/jobs');

  if (!response.ok) {
    throw new Error('Failed to fetch jobs');
  }

  return response.json();
};
