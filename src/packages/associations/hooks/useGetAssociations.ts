import { useQuery } from '@tanstack/react-query';
import type { AssociationItem } from '../types';

export default function useGetAssociations() {
  return useQuery<AssociationItem[]>({
    queryKey: ['associations'],
    queryFn: () => getAssociations(),
  });
}

const getAssociations = async (): Promise<AssociationItem[]> => {
  const response = await fetch('/api/associations');

  if (!response.ok) {
    throw new Error('Failed to fetch associations');
  }

  return response.json();
};
