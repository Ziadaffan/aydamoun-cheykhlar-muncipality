import { useQuery } from '@tanstack/react-query';

export const useGetNewsById = (id: string) => {
  return useQuery({
    queryKey: ['news', id],
    queryFn: () => getNewsById(id),
  });
};

const getNewsById = async (id: string) => {
  const response = await fetch(`/api/news/${id}`);
  return response.json();
};
