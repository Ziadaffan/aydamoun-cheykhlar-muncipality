import { Council } from '@prisma/client';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

export const useGetCouncilMembers = (): UseQueryResult<Council[], Error> => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['council-members'],
    queryFn: () => getCouncilMembers(),
  });

  return { data, isLoading, error } as UseQueryResult<Council[], Error>;
};

const getCouncilMembers = async (): Promise<Council[]> => {
  const response = await fetch('/api/council');

  if (!response.ok) {
    throw new Error('Failed to fetch council members');
  }

  return response.json();
};
