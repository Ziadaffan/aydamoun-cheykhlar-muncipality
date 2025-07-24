import { useQuery } from '@tanstack/react-query';

export const useGetServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: () => getServices(),
  });
};

const getServices = async () => {
  const response = await fetch('/api/services');

  if (!response.ok) {
    throw new Error('Failed to fetch services');
  }

  return response.json();
};
