import { useQuery } from '@tanstack/react-query';

export const useGetService = (id: string) => {
  return useQuery({
    queryKey: ['service', id],
    queryFn: () => getServiceById(id),
  });
};

const getServiceById = async (id: string) => {
  const response = await fetch(`/api/services/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch service');
  }

  return response.json();
};
