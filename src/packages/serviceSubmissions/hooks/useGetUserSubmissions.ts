import { useQuery } from '@tanstack/react-query';

export const useGetUserSubmissions = () => {
  return useQuery({
    queryKey: ['submissions'],
    queryFn: getUserSubmissions,
  });
};

const getUserSubmissions = async () => {
  const response = await fetch(`/api/user/service-submissions`);

  if (!response.ok) {
    throw new Error('Failed to fetch submissions');
  }

  return response.json();
};
