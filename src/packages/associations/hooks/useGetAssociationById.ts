import { useQuery } from '@tanstack/react-query';

export default function useGetAssociationById(id: string) {
  return useQuery({
    queryKey: ['associations', id],
    queryFn: () => getAssociationById(id),
    enabled: !!id,
  });
}

const getAssociationById = async (id: string) => {
  const response = await fetch(`/api/associations/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch association');
  }

  return response.json();
};
