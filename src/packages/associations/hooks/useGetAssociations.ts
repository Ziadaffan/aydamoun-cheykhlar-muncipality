import { useQuery } from '@tanstack/react-query';

export default function useGetAssociations() {
  return useQuery({
    queryKey: ['associations'],
    queryFn: () => getAssociations(),
  });
}

const getAssociations = async () => {
  const response = await fetch('/api/associations');

  if (!response.ok) {
    throw new Error('Failed to fetch associations');
  }

  return response.json();
};
